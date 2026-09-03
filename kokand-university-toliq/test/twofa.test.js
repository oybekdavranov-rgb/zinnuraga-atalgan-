'use strict';
// Muhit — require'dan oldin
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');
process.env.NODE_ENV = 'development';
process.env.DEFAULT_STAFF_PASSWORD = 'TestStaff123';
process.env.DEFAULT_EDITOR_PASSWORD = 'TestEditor123';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kucms-2fa-'));
process.env.SQLITE_PATH = path.join(TMP, 'twofa.db');
process.env.UPLOAD_DIR = path.join(TMP, 'uploads');

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../src/db');
const { bootstrapUsers } = require('../src/db/seed');
const { createServer } = require('../src/app');
const totp = require('../src/security/totp');

let server; let base; let cookies = {};
function cookieHeader() { return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; '); }
function storeCookies(res) {
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of sc) { const [pair] = c.split(';'); const i = pair.indexOf('='); cookies[pair.slice(0, i)] = pair.slice(i + 1); }
}
async function req(method, url, body) {
  const headers = { Cookie: cookieHeader() };
  if (body) headers['Content-Type'] = 'application/json';
  if (['POST', 'PUT', 'DELETE'].includes(method)) headers['x-csrf-token'] = cookies['ku_csrf'] || '';
  const res = await fetch(base + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  storeCookies(res);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

before(async () => {
  await db.init();
  await bootstrapUsers();
  server = createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
  await req('GET', '/api/admin/session'); // csrf cookie
});
after(async () => { await new Promise((r) => server.close(r)); try { await db.close(); } catch { /* ignore */ } });

test('2FA to‘liq oqim: setup → enable → login kod bilan', async () => {
  // 1) Kirish (2FA hali yo'q — oddiy login ishlaydi)
  let r = await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'TestStaff123' });
  assert.strictEqual(r.status, 200, 'oddiy login ishlaydi');

  // 2) 2FA sozlash — secret olamiz
  r = await req('POST', '/api/admin/2fa/setup', {});
  assert.strictEqual(r.status, 200);
  const secret = r.data.secret;
  assert.ok(secret && secret.length >= 16, 'secret berildi');
  assert.ok(r.data.otpauth.startsWith('otpauth://'), 'otpauth havolasi');

  // 3) Noto'g'ri kod bilan yoqib bo'lmaydi
  r = await req('POST', '/api/admin/2fa/enable', { code: '000000' });
  assert.strictEqual(r.status, 400, 'xato kod rad etiladi');

  // 4) To'g'ri kod bilan yoqamiz
  const code = totp.hotp(secret, Math.floor(Date.now() / 1000 / 30));
  r = await req('POST', '/api/admin/2fa/enable', { code });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.data.enabled, true, '2FA yoqildi');

  // 5) Chiqamiz
  await req('POST', '/api/admin/logout', {});

  // 6) Endi kodsiz login RAD etiladi (need2fa)
  r = await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'TestStaff123' });
  assert.strictEqual(r.status, 401, 'kodsiz login rad etiladi');
  assert.strictEqual(r.data.need2fa, true, 'need2fa bayrog‘i');

  // 7) Noto'g'ri kod bilan ham rad etiladi
  r = await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'TestStaff123', code: '000000' });
  assert.strictEqual(r.status, 401, 'xato kod rad etiladi');

  // 8) To'g'ri kod bilan kiramiz
  const code2 = totp.hotp(secret, Math.floor(Date.now() / 1000 / 30));
  r = await req('POST', '/api/admin/login', { email: 'staff@kokandu.uz', password: 'TestStaff123', code: code2 });
  assert.strictEqual(r.status, 200, 'to‘g‘ri kod bilan kirish');
  assert.strictEqual(r.data.ok, true);

  // 9) O'chirish — noto'g'ri parol rad etiladi
  r = await req('POST', '/api/admin/2fa/disable', { password: 'notright' });
  assert.strictEqual(r.status, 400, 'xato parol bilan o‘chirib bo‘lmaydi');

  // 10) To'g'ri parol bilan o'chiriladi
  r = await req('POST', '/api/admin/2fa/disable', { password: 'TestStaff123' });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.data.enabled, false, '2FA o‘chirildi');
});
