'use strict';
// Muhitni require'dan OLDIN o'rnatamiz (config env'ni require vaqtida o'qiydi)
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');
process.env.NODE_ENV = 'development';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kucms-metrics-'));
process.env.SQLITE_PATH = path.join(TMP, 'metrics.db');

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../src/db');
const metrics = require('../src/metrics');

before(async () => { await db.init(); });
after(async () => { try { await db.close(); } catch { /* ignore */ } });

test('view: ikki xil tashrifchi = 2, bir tashrifchi takror = o‘smaydi (dedup)', async () => {
  await metrics.recordEvents('vidA', [{ type: 'view', id: 'card:x:1', label: 'Test' }]);
  await metrics.recordEvents('vidB', [{ type: 'view', id: 'card:x:1', label: 'Test' }]);
  let counts = await metrics.getCounts(['card:x:1']);
  assert.strictEqual(counts['card:x:1'], 2, 'ikki xil vid = 2');

  // Bir xil vid qayta ko'radi — son o'zgarmasligi kerak
  await metrics.recordEvents('vidA', [{ type: 'view', id: 'card:x:1' }]);
  await metrics.recordEvents('vidA', [{ type: 'view', id: 'card:x:1' }]);
  counts = await metrics.getCounts(['card:x:1']);
  assert.strictEqual(counts['card:x:1'], 2, 'takror ko‘rish sanalmaydi');
});

test('collect javobida joriy son qaytadi', async () => {
  const res = await metrics.recordEvents('vidC', [{ type: 'view', id: 'card:x:1' }]);
  assert.strictEqual(res.counts['card:x:1'], 3, 'yangi vid qo‘shildi = 3');
});

test('search: normalizatsiya (trim/lowercase/bo‘shliq) bir kalitga tushadi', async () => {
  await metrics.recordEvents('v1', [{ type: 'search', query: 'Grant  2026' }]);
  await metrics.recordEvents('v2', [{ type: 'search', query: '  grant 2026 ' }]);
  const s = await metrics.getSummary();
  const row = s.topSearched.find((x) => x.key === 'grant 2026');
  assert.ok(row, 'grant 2026 kaliti mavjud');
  assert.strictEqual(row.count, 2, 'ikkalasi bir kalitga qo‘shildi');
});

test('click: har bosish sanaladi (raw)', async () => {
  await metrics.recordEvents('v1', [{ type: 'click', id: 'btn:apply', label: 'Ariza' }]);
  await metrics.recordEvents('v1', [{ type: 'click', id: 'btn:apply', label: 'Ariza' }]);
  const s = await metrics.getSummary();
  const row = s.topClicked.find((x) => x.key === 'btn:apply');
  assert.ok(row && row.count >= 2, 'bosishlar yig‘iladi');
});

test('pageview: unikal tashrifchi va nom to‘g‘ri', async () => {
  await metrics.recordEvents('pv1', [{ type: 'pageview', path: '/' }]);
  await metrics.recordEvents('pv1', [{ type: 'pageview', path: '/' }]); // o'sha vid — unikal +1 emas
  await metrics.recordEvents('pv2', [{ type: 'pageview', path: '/shaharcha.html' }]);
  const s = await metrics.getSummary();
  assert.strictEqual(s.name, 'Kokand University Imora AI');
  assert.ok(s.totalVisitors >= 2, 'kamida 2 unikal tashrifchi (pv1, pv2)');
  assert.ok(s.totalHits >= 3, 'jami 3 sahifa ochilishi');
  assert.ok(s.launchDate && s.launchDate > 0, 'launch sanasi yozildi');
  assert.strictEqual(s.byHourOfDay.length, 24, '24 soatlik grafik');
});

test('sanitizatsiya: juda uzun/keraksiz maydonlar cheklanadi, xato bermaydi', async () => {
  const big = 'A'.repeat(5000);
  const res = await metrics.recordEvents('vidZ', [
    { type: 'view', id: big, label: big },
    { type: 'search', query: 'x' },   // 2 belgidan qisqa — e'tiborga olinmaydi
    { type: 'nomalum', id: 'z' },      // noma'lum tur — e'tiborsiz
    null, 'buzuq',                     // buzuq yozuvlar — yiqilmaydi
  ]);
  assert.ok(res && typeof res.counts === 'object', 'javob obyekt');
});

test('runMaintenance: eski dedup keshini o‘chiradi, tashrifchini saqlaydi', async () => {
  // Eski (200 kun oldingi) "seen" yozuvini qo'lda qo'yamiz
  const oldTs = Date.now() - 200 * 24 * 60 * 60 * 1000;
  await db.run('INSERT INTO metrics_view_seen (session_key, key, first_seen) VALUES (?, ?, ?)', ['old-vid', 'card:old:1', oldTs]);
  const before = await db.get('SELECT COUNT(*) AS c FROM metrics_view_seen');
  const visitorsBefore = await db.get('SELECT COUNT(*) AS c FROM metrics_visitor');

  const r = await metrics.runMaintenance();
  assert.ok(r.seenDeleted >= 1, 'kamida 1 eski seen o‘chdi');

  const after = await db.get('SELECT COUNT(*) AS c FROM metrics_view_seen');
  const visitorsAfter = await db.get('SELECT COUNT(*) AS c FROM metrics_visitor');
  assert.ok(Number(after.c) < Number(before.c), 'seen jadvali qisqardi');
  assert.strictEqual(Number(visitorsAfter.c), Number(visitorsBefore.c), 'tashrifchilar O‘CHMAYDI');
});
