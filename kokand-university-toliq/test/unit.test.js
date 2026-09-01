'use strict';
const { test } = require('node:test');
const assert = require('node:assert');

const { sanitizeUrl, sanitizeString, isEmail, sanitizeFilename } = require('../src/security/sanitize');
const { hashPassword, newSalt, verifyPassword } = require('../src/security/passwords');
const { magicOk } = require('../src/uploads');

test('sanitizeUrl xavfli sxemalarni bloklaydi', () => {
  assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('  javascript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('java\tscript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('data:text/html,<script>'), '');
  assert.strictEqual(sanitizeUrl('vbscript:msgbox'), '');
});

test('sanitizeUrl xavfsiz URL larni saqlaydi', () => {
  assert.strictEqual(sanitizeUrl('https://kokanduni.uz'), 'https://kokanduni.uz');
  assert.strictEqual(sanitizeUrl('/news.html'), '/news.html');
  assert.strictEqual(sanitizeUrl('#anchor'), '#anchor');
  assert.strictEqual(sanitizeUrl('mailto:a@b.uz'), 'mailto:a@b.uz');
  assert.strictEqual(sanitizeUrl('www.x.uz'), 'https://www.x.uz');
});

test('sanitizeString maxLength ni cheklaydi', () => {
  assert.strictEqual(sanitizeString('  hi  '), 'hi');
  assert.strictEqual(sanitizeString('abcdef', 3), 'abc');
  assert.strictEqual(sanitizeString(null), '');
});

test('isEmail to‘g‘ri ishlaydi', () => {
  assert.ok(isEmail('a@b.uz'));
  assert.ok(!isEmail('notanemail'));
  assert.ok(!isEmail('a@b'));
});

test('sanitizeFilename xavfli belgilarni tozalaydi', () => {
  assert.strictEqual(sanitizeFilename('../../etc/passwd'), 'passwd');
  assert.strictEqual(sanitizeFilename('a b!.png'), 'a-b-.png');
});

test('parol hash + verify (scrypt) ishlaydi', () => {
  const salt = newSalt();
  const hash = hashPassword('Secret123', salt);
  const user = { salt, password_hash: hash };
  assert.ok(verifyPassword('Secret123', user));
  assert.ok(!verifyPassword('wrong', user));
  assert.ok(!verifyPassword('Secret123', null)); // user yo'q
});

test('magicOk fayl imzosini tekshiradi', () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  assert.ok(magicOk('.png', png));
  assert.ok(!magicOk('.png', Buffer.from('notapng12345')));
  const pdf = Buffer.from('%PDF-1.4 rest of file here');
  assert.ok(magicOk('.pdf', pdf));
  assert.ok(!magicOk('.html', Buffer.from('<script>xxxx</script>')));
});
