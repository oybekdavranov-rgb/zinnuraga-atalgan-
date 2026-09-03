'use strict';
/**
 * Avtomatik zaxira (backup) — faqat SQLite uchun.
 *  - `data/backups/` ichiga vaqt tamg'asi bilan nusxa oladi
 *  - oxirgi N tasini saqlaydi (BACKUP_KEEP, default 14), qolganini o'chiradi
 *  - startda bir marta + har BACKUP_INTERVAL_HOURS soatda (default 24)
 *
 * PostgreSQL'da managed backup (Railway/Neon) yoki `pg_dump` cron ishlatiladi —
 * bu modul u yerda hech narsa qilmaydi (skipped).
 */
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db');
const { config } = require('./config');
const log = require('./logger');

async function backupOnce() {
  if (db.dialect !== 'sqlite') return { skipped: 'postgres' };
  try {
    await db.checkpoint(); // WAL'ni asosiy faylga yozamiz — nusxa to'liq bo'ladi
    const dir = path.join(config.DATA_DIR, 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/:/g, '-').replace('T', '_').slice(0, 16);
    const dest = path.join(dir, `app-${stamp}.db`);
    fs.copyFileSync(config.SQLITE_PATH, dest);

    // Rotatsiya — faqat oxirgi N ta zaxira qoladi
    const keep = Math.max(1, Number(process.env.BACKUP_KEEP || 14));
    const files = fs.readdirSync(dir).filter((f) => /^app-.*\.db$/.test(f)).sort();
    while (files.length > keep) {
      const old = files.shift();
      try { fs.unlinkSync(path.join(dir, old)); } catch { /* ignore */ }
    }
    log.info('zaxira nusxa yaratildi', { file: path.basename(dest), keep });
    return { dest };
  } catch (err) {
    log.error('zaxira xatosi', { err: err.message });
    return { error: err.message };
  }
}

/** Startda bir marta + davriy zaxira rejalashtiradi. */
function schedule() {
  const hours = Number(process.env.BACKUP_INTERVAL_HOURS || 24);
  if (hours <= 0) return null;
  backupOnce().catch(() => {});
  const timer = setInterval(() => { backupOnce().catch(() => {}); }, hours * 60 * 60 * 1000);
  if (timer.unref) timer.unref();
  return timer;
}

module.exports = { backupOnce, schedule };
