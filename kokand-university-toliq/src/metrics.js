'use strict';
/**
 * IMORA AI — jonli statistika yadrosi.
 *
 * Sayt ochilgan kundan beri:
 *   - necha kishi tashrif buyurgan (metrics_visitor — unikal session_key)
 *   - qaysi vaqtda kirilgan (metrics_hourly — soatlik "bucket")
 *   - har bir karta / reklama / bo'lim necha marta ko'rilgan (metrics_counter scope=view)
 *   - nima ko'proq bosilgan (scope=click) va qidirilgan (scope=search)
 *   - qaysi sahifaga ko'proq kirilgan (scope=path)
 *
 * Hech qanday shaxsiy ma'lumot (PII) saqlanmaydi — faqat brauzer o'zi
 * yaratgan tasodifiy `vid` (visitor id). IP saqlanmaydi.
 */
const db = require('./db');
const { sanitizeString } = require('./security/sanitize');

const SCOPES = new Set(['view', 'click', 'search', 'path']);
const MAX_EVENTS = 40;      // bitta so'rovda maksimal hodisa
const KEY_MAX = 200;        // kalit uzunligi chegarasi
const LABEL_MAX = 200;      // ko'rinadigan nom uzunligi
const MAX_IDS = 200;        // counts so'rovida maksimal id

// O'zbekiston vaqti (Asia/Tashkent, DST yo'q) — statistika lokal vaqtda ko'rinadi.
const TZ_OFFSET_MS = 5 * 60 * 60 * 1000;

function pad2(n) { return String(n).padStart(2, '0'); }

/** ts -> "YYYY-MM-DD-HH" (Toshkent vaqti bo'yicha). */
function bucketOf(ts) {
  const d = new Date(ts + TZ_OFFSET_MS);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}-${pad2(d.getUTCHours())}`;
}

/** Hisoblagichni +by ga oshiradi (yo'q bo'lsa yaratadi). label bo'sh bo'lmasa yangilaydi. */
async function bumpCounter(scope, key, label, now, by = 1) {
  if (!SCOPES.has(scope)) return;
  const k = sanitizeString(key, KEY_MAX);
  if (!k) return;
  await db.run(
    `INSERT INTO metrics_counter (scope, key, label, count, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(scope, key) DO UPDATE SET
       count = metrics_counter.count + ?,
       label = CASE WHEN excluded.label = '' THEN metrics_counter.label ELSE excluded.label END,
       updated_at = excluded.updated_at`,
    [scope, k, sanitizeString(label, LABEL_MAX), by, now, by]
  );
}

/**
 * Bir tashrifchi (session_key) bitta elementni faqat BIR marta sanaydi.
 * Shunda "ko'rishlar" soni = unikal odamlar soni bo'ladi va qayta-yuklash yoki
 * qo'pol takror bilan sonni shishirib bo'lmaydi (soxtalashtirishga qarshi qatlam).
 * Qaytaradi: true — yangi (sanaldi), false — allaqachon ko'rilgan.
 */
async function countUniqueView(sk, key, label, now) {
  if (sk) {
    const ins = await db.run(
      `INSERT INTO metrics_view_seen (session_key, key, first_seen) VALUES (?, ?, ?)
       ON CONFLICT(session_key, key) DO NOTHING`,
      [sk, key, now]
    );
    if (!ins || !ins.changes) return false; // allaqachon ko'rilgan
  }
  await bumpCounter('view', key, label, now);
  return true;
}

/** Tashrif yozuvi: unikal tashrifchi + soatlik hisob + sahifa. */
async function recordVisit(sessionKey, path, now) {
  let isNew = false;
  const sk = sanitizeString(sessionKey, 80);
  if (sk) {
    const existing = await db.get('SELECT session_key FROM metrics_visitor WHERE session_key = ?', [sk]);
    if (existing) {
      await db.run('UPDATE metrics_visitor SET last_seen = ?, hits = hits + 1 WHERE session_key = ?', [now, sk]);
    } else {
      isNew = true;
      await db.run('INSERT INTO metrics_visitor (session_key, first_seen, last_seen, hits) VALUES (?, ?, ?, 1)', [sk, now, now]);
    }
  }
  const bucket = bucketOf(now);
  const newV = isNew ? 1 : 0;
  await db.run(
    `INSERT INTO metrics_hourly (bucket, hits, visitors) VALUES (?, 1, ?)
     ON CONFLICT(bucket) DO UPDATE SET
       hits = metrics_hourly.hits + 1,
       visitors = metrics_hourly.visitors + ?`,
    [bucket, newV, newV]
  );
  await bumpCounter('path', path || '/', path || '/', now);
  // Ishga tushgan (launch) sanasi — bir marta yoziladi.
  await db.run(
    `INSERT INTO metrics_meta (key, value) VALUES ('launch', ?) ON CONFLICT(key) DO NOTHING`,
    [String(now)]
  );
}

/**
 * Brauzerdan kelgan hodisalar to'plamini qayd etadi.
 * events: [{type:'pageview',path}, {type:'view',id,label}, {type:'click',id,label}, {type:'search',query}]
 * Qaytaradi: { counts: { <view id>: yangi_son } } — kartalarni darhol yangilash uchun.
 */
async function recordEvents(sessionKey, events) {
  const now = Date.now();
  const counts = {};
  if (!Array.isArray(events)) return { counts };
  const sk = sanitizeString(sessionKey, 80);
  const list = events.slice(0, MAX_EVENTS);
  const viewKeys = new Set();
  let pageviewPath = null;
  let sawPageview = false;

  for (const ev of list) {
    if (!ev || typeof ev !== 'object') continue;
    const type = String(ev.type || '');
    if (type === 'pageview') {
      sawPageview = true;
      if (pageviewPath === null) pageviewPath = sanitizeString(ev.path, 300) || '/';
    } else if (type === 'view') {
      const key = sanitizeString(ev.id, KEY_MAX);
      if (!key) continue;
      await countUniqueView(sk, key, ev.label, now); // faqat yangi bo'lsa sanaydi
      viewKeys.add(key);                             // joriy sonni javobga qaytarish uchun
    } else if (type === 'click') {
      const key = sanitizeString(ev.id, KEY_MAX);
      if (!key) continue;
      await bumpCounter('click', key, ev.label, now);
    } else if (type === 'search') {
      const norm = sanitizeString(ev.query, 120).toLowerCase().replace(/\s+/g, ' ').trim();
      if (norm.length < 2) continue;
      await bumpCounter('search', norm, sanitizeString(ev.query, 120), now);
    }
  }

  if (sawPageview) await recordVisit(sessionKey, pageviewPath || '/', now);

  if (viewKeys.size) Object.assign(counts, await getCounts([...viewKeys]));
  return { counts };
}

/** Berilgan id'lar uchun joriy ko'rish sonlari (jonli badge uchun). */
async function getCounts(ids) {
  const clean = [];
  const seen = new Set();
  for (const raw of (ids || [])) {
    const k = sanitizeString(raw, KEY_MAX);
    if (k && !seen.has(k)) { seen.add(k); clean.push(k); }
    if (clean.length >= MAX_IDS) break;
  }
  const out = {};
  if (!clean.length) return out;
  const placeholders = clean.map(() => '?').join(',');
  const rows = await db.all(
    `SELECT key, count FROM metrics_counter WHERE scope = 'view' AND key IN (${placeholders})`,
    clean
  );
  for (const r of rows) out[r.key] = Number(r.count);
  return out;
}

async function topList(scope, limit = 12) {
  const rows = await db.all(
    `SELECT key, label, count FROM metrics_counter WHERE scope = ? ORDER BY count DESC, updated_at DESC LIMIT ${Number(limit)}`,
    [scope]
  );
  return rows.map((r) => ({ key: r.key, label: r.label || r.key, count: Number(r.count) }));
}

/** Admin panel uchun to'liq statistika xulosasi. */
async function getSummary() {
  const now = Date.now();
  const totalVisitorsRow = await db.get('SELECT COUNT(*) AS c FROM metrics_visitor');
  const totalHitsRow = await db.get('SELECT COALESCE(SUM(hits), 0) AS s FROM metrics_hourly');
  const launchRow = await db.get("SELECT value FROM metrics_meta WHERE key = 'launch'");
  const hourlyRows = await db.all('SELECT bucket, hits, visitors FROM metrics_hourly');

  const byHour = Array.from({ length: 24 }, (_, h) => ({ hour: h, hits: 0 }));
  const byDay = new Map();
  const todayStr = bucketOf(now).slice(0, 10);
  let todayHits = 0;
  let todayVisitors = 0;

  for (const r of hourlyRows) {
    const parts = String(r.bucket).split('-'); // [YYYY, MM, DD, HH]
    const hh = Number(parts[3] || 0);
    const day = parts.slice(0, 3).join('-');
    const hits = Number(r.hits) || 0;
    const visitors = Number(r.visitors) || 0;
    if (hh >= 0 && hh < 24) byHour[hh].hits += hits;
    const cur = byDay.get(day) || { day, hits: 0, visitors: 0 };
    cur.hits += hits; cur.visitors += visitors;
    byDay.set(day, cur);
    if (day === todayStr) { todayHits += hits; todayVisitors += visitors; }
  }

  const last14Days = [...byDay.values()].sort((a, b) => (a.day < b.day ? -1 : 1)).slice(-14);

  return {
    name: 'Kokand University Imora AI',
    generatedAt: now,
    launchDate: launchRow ? Number(launchRow.value) : null,
    totalVisitors: Number(totalVisitorsRow ? totalVisitorsRow.c : 0),
    totalHits: Number(totalHitsRow ? totalHitsRow.s : 0),
    todayHits,
    todayVisitors,
    byHourOfDay: byHour,
    last14Days,
    topViewed: await topList('view'),
    topClicked: await topList('click'),
    topSearched: await topList('search'),
    topPaths: await topList('path'),
  };
}

/**
 * Eski ma'lumotni tozalash (jadvallar cheksiz o'smasligi uchun).
 *  - metrics_view_seen: takror-himoya keshi — RETENTION kundan eski yozuvlar o'chadi.
 *    (Unikal tashrifchilar `metrics_visitor` da saqlanadi — u O'CHIRILMAYDI.)
 *  - metrics_hourly: juda eski soatlik yozuvlar o'chadi (grafik uchun ~2 yil yetadi).
 * Yig'ma sonlar (metrics_counter) va tashrifchilar ro'yxati O'ZGARMAYDI.
 */
async function runMaintenance() {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const seenDays = Number(process.env.METRICS_SEEN_RETENTION_DAYS || 180);
  const hourlyDays = Number(process.env.METRICS_HOURLY_RETENTION_DAYS || 730);
  const result = {};
  try {
    const r1 = await db.run('DELETE FROM metrics_view_seen WHERE first_seen < ?', [now - seenDays * DAY]);
    result.seenDeleted = (r1 && r1.changes) || 0;
    // bucket = "YYYY-MM-DD-HH"; sana prefiksi bo'yicha leksikografik solishtiramiz
    const cut = new Date(now - hourlyDays * DAY + TZ_OFFSET_MS);
    const cutStr = `${cut.getUTCFullYear()}-${pad2(cut.getUTCMonth() + 1)}-${pad2(cut.getUTCDate())}`;
    const r2 = await db.run('DELETE FROM metrics_hourly WHERE bucket < ?', [cutStr]);
    result.hourlyDeleted = (r2 && r2.changes) || 0;
  } catch (err) {
    result.error = err.message;
  }
  return result;
}

/** Startda bir marta + har 24 soatda tozalashni rejalashtiradi. */
function scheduleMaintenance() {
  runMaintenance().catch(() => {});
  const timer = setInterval(() => { runMaintenance().catch(() => {}); }, 24 * 60 * 60 * 1000);
  if (timer.unref) timer.unref(); // jarayonni ushlab qolmasin
  return timer;
}

module.exports = { recordEvents, getCounts, getSummary, runMaintenance, scheduleMaintenance };
