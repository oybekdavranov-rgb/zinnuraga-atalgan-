'use strict';
/**
 * TOTP (RFC 6238) — ikki bosqichli kirish (Google Authenticator, Authy va h.k.).
 * Faqat Node ichki `crypto` bilan — hech qanday tashqi kutubxona yo'q.
 */
const crypto = require('node:crypto');

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf) {
  let bits = 0; let value = 0; let out = '';
  for (const b of buf) {
    value = (value << 8) | b; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  const clean = String(str || '').toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0; let value = 0; const out = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx; bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(out);
}

/** Yangi maxfiy kalit (base32). */
function generateSecret(bytes = 20) {
  return base32Encode(crypto.randomBytes(bytes));
}

/** HOTP — bitta hisoblagich uchun 6 xonali kod. */
function hotp(secretBase32, counter) {
  const key = base32Decode(secretBase32);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const bin = ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);
  return String(bin % 1000000).padStart(6, '0');
}

/**
 * Kodni tekshiradi. `window` — oldingi/keyingi 30s oynalarга ruxsat (soat farqiga bardosh).
 * Timing-safe solishtirish.
 */
function verify(token, secretBase32, window = 1) {
  const clean = String(token || '').replace(/\D/g, '');
  if (clean.length !== 6 || !secretBase32) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    const expected = hotp(secretBase32, counter + i);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(clean))) return true;
  }
  return false;
}

/** Authenticator ilovasi uchun otpauth:// havolasi (QR yoki qo'lda kiritish). */
function otpauthURL(secretBase32, label, issuer = 'Kokand University') {
  const path = encodeURIComponent(`${issuer}:${label}`);
  const params = new URLSearchParams({
    secret: secretBase32, issuer, algorithm: 'SHA1', digits: '6', period: '30',
  });
  return `otpauth://totp/${path}?${params.toString()}`;
}

module.exports = { generateSecret, hotp, verify, otpauthURL, base32Encode, base32Decode };
