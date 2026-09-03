'use strict';
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { config } = require('./config');
const { escapeHtml } = require('./security/sanitize');

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return raw.split(';').reduce((acc, chunk) => {
    const [name, ...rest] = chunk.trim().split('=');
    if (!name) return acc;
    acc[name] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || '/'}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.secure) parts.push('Secure');
  const prev = res.getHeader('Set-Cookie');
  const list = prev ? (Array.isArray(prev) ? prev : [prev]) : [];
  list.push(parts.join('; '));
  res.setHeader('Set-Cookie', list);
}

function clearCookie(res, name) {
  setCookie(res, name, '', { expires: new Date(0) });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function parseJsonBody(req) {
  const buffer = await readBody(req, config.MAX_JSON_BYTES);
  const text = buffer.toString('utf8');
  return text ? JSON.parse(text) : {};
}

async function parseFormData(req) {
  const body = await readBody(req, config.MAX_UPLOAD_BYTES + 1024 * 1024);
  const request = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: req.headers,
    body,
  });
  return request.formData();
}

function inferMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
    '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
  };
  return map[ext] || 'application/octet-stream';
}

/**
 * Kesh siyosati (tezlik uchun):
 *  - rasm/video/shrift — uzoq kesh (kamdan-kam o'zgaradi)
 *  - css/js — o'rtacha (o'zgarishi mumkin, lekin har so'rovda emas)
 *  - html/json va boshqalar — keshlanmaydi (kontent admin paneldan yangilanadi)
 */
function cacheControlFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.mp4', '.webm',
    '.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
    return 'public, max-age=604800'; // 7 kun
  }
  if (['.css', '.js', '.mjs'].includes(ext)) {
    return 'public, max-age=3600';   // 1 soat
  }
  return 'no-cache';                 // html/json — har doim yangi
}

async function serveStaticFile(res, absolutePath, roots) {
  const safePath = path.normalize(absolutePath);
  const allowedRoots = roots || [config.PUBLIC_DIR, config.ADMIN_DIR, config.UPLOADS_DIR];
  if (!allowedRoots.some((root) => safePath === root || safePath.startsWith(root + path.sep))) {
    sendJson(res, 403, { ok: false, error: 'Forbidden' });
    return;
  }
  try {
    const stat = await fsp.stat(safePath);
    if (!stat.isFile()) {
      sendJson(res, 404, { ok: false, error: 'Not found' });
      return;
    }
    res.writeHead(200, {
      'Content-Type': inferMimeType(safePath),
      'Cache-Control': cacheControlFor(safePath),
    });
    fs.createReadStream(safePath).pipe(res);
  } catch {
    sendJson(res, 404, { ok: false, error: 'Not found' });
  }
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  // CSP: manbalarni cheklaydi (tashqi skript/stil/iframe inyeksiyasini bloklaydi),
  // lekin sahifalardagi inline skript/stil va YouTube (galereya orqa-foni) ishlaydi.
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "img-src 'self' data: blob: https:",             // passiv: rasm skript ishga tushira olmaydi
    "media-src 'self' https: blob:",
    "script-src 'self' 'unsafe-inline'",              // XSS uchun asosiy nazorat — faqat o'z domen + inline
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.typekit.net",
    "font-src 'self' data: https://fonts.gstatic.com https://use.typekit.net",
    "connect-src 'self'",                             // tashqi eksfiltratsiyani bloklaydi
    'frame-src https://www.youtube.com https://www.youtube-nocookie.com',
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '));
  if (config.IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
}

module.exports = {
  parseCookies, setCookie, clearCookie, sendJson, redirect,
  readBody, parseJsonBody, parseFormData, inferMimeType, serveStaticFile,
  setSecurityHeaders, escapeHtml,
};
