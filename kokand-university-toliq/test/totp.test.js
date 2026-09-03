'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const totp = require('../src/security/totp');

test('base32 encode/decode round-trip', () => {
  const buf = Buffer.from('Hello Kokand University!');
  assert.deepStrictEqual(totp.base32Decode(totp.base32Encode(buf)), buf);
});

test('TOTP: joriy kod tasdiqlanadi', () => {
  const secret = totp.generateSecret();
  const counter = Math.floor(Date.now() / 1000 / 30);
  const code = totp.hotp(secret, counter);
  assert.strictEqual(code.length, 6);
  assert.ok(totp.verify(code, secret), 'joriy kod to‘g‘ri bo‘lishi kerak');
});

test('TOTP: xato/eskirgan kodlar rad etiladi', () => {
  const secret = totp.generateSecret();
  const counter = Math.floor(Date.now() / 1000 / 30);
  const farCode = totp.hotp(secret, counter + 100); // oyna tashqarisidagi kod
  assert.ok(!totp.verify(farCode, secret), 'uzoq oynadagi kod rad etiladi');
  assert.ok(!totp.verify('12345', secret), '5 xonali rad etiladi');
  assert.ok(!totp.verify('abcdef', secret), 'harfli rad etiladi');
  assert.ok(!totp.verify('123456', ''), 'secretsiz rad etiladi');
});

test('otpauthURL to‘g‘ri format', () => {
  const url = totp.otpauthURL('ABCDEFGH', 'staff@kokandu.uz');
  assert.ok(url.startsWith('otpauth://totp/'), 'otpauth sxemasi');
  assert.ok(url.includes('secret=ABCDEFGH'), 'secret bor');
  assert.ok(/issuer=Kokand/.test(url), 'issuer bor');
});
