'use strict';
/**
 * Kokand University CMS — kirish nuqtasi (entry point).
 * Modullar: src/  (config, logger, db, auth, security, routes)
 * Baza: DATABASE_URL bo'lsa PostgreSQL, aks holda SQLite (dev).
 */
const { config, assertProductionSecrets } = require('./src/config');
const log = require('./src/logger');
const site = require('./src/site-profile');
const db = require('./src/db');
const { bootstrapUsers, seedContent, cleanupSessions, applyAdminReset } = require('./src/db/seed');
const { loadManifest } = require('./src/manifest');
const metrics = require('./src/metrics');
const backup = require('./src/backup');
const { createServer } = require('./src/app');

let server;

async function start() {
  assertProductionSecrets();
  await db.init();
  await cleanupSessions();
  await bootstrapUsers();
  await applyAdminReset();        // ADMIN_RESET env berilgan bo'lsa — parolni tiklaydi
  await seedContent();
  loadManifest();
  metrics.scheduleMaintenance(); // Imora AI — eski statistikani vaqti-vaqti bilan tozalaydi
  backup.schedule();             // avtomatik zaxira (SQLite) — startda + har 24 soatda

  server = createServer();
  server.listen(config.PORT, () => {
    log.info(`${site.profile.label} CMS ishga tushdi`, { port: config.PORT, env: config.IS_PROD ? 'production' : 'development', db: db.dialect, profile: site.profile.name });
    if (!config.IS_PROD) {
      log.info(`[dev] Staff:  ${config.DEFAULT_STAFF_EMAIL} / ${config.DEFAULT_STAFF_PASSWORD}`);
      log.info(`[dev] Editor: ${config.DEFAULT_EDITOR_EMAIL} / ${config.DEFAULT_EDITOR_PASSWORD}`);
    }
  });
}

function shutdown(signal) {
  log.info(`${signal} qabul qilindi — to‘xtatilmoqda`);
  if (!server) process.exit(0);
  server.close(async () => {
    try { await db.close(); } catch { /* ignore */ }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => log.error('unhandledRejection', { err: String(err) }));

start().catch((err) => {
  log.error('Ishga tushirishda xato', { err: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = { start };
