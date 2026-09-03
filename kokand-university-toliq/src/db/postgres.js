'use strict';
/** PostgreSQL adapter — production (Railway/VPS). `?` -> `$n` avtomatik tarjima. */
const fs = require('node:fs');
const { Pool } = require('pg');

/**
 * TLS konfiguratsiyasi:
 *  - PGSSL=disable            -> SSL o'chirilgan (faqat ishonchli ichki tarmoq)
 *  - PGSSLROOTCERT=/path/ca   -> CA sertifikat bilan TO'LIQ tekshiruv (eng xavfsiz)
 *  - PGSSL=no-verify          -> shifrlangan, lekin sertifikat tekshirilmaydi (Railway default)
 *  - (default)                -> no-verify (Railway self-signed bilan ishlashi uchun)
 */
function buildSsl() {
  if (process.env.PGSSL === 'disable') return false;
  const caPath = process.env.PGSSLROOTCERT;
  if (caPath && fs.existsSync(caPath)) {
    return { ca: fs.readFileSync(caPath, 'utf8'), rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

function toPg(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// "id" ustuni bo'lmagan jadvallar — ularga RETURNING id qo'shilmaydi.
const NO_ID_TABLES = new Set([
  'settings', 'overrides',
  'metrics_counter', 'metrics_hourly', 'metrics_meta', 'metrics_visitor',
]);

function insertTable(sql) {
  const m = /^\s*insert\s+into\s+"?([a-z_][a-z0-9_]*)"?/i.exec(sql);
  return m ? m[1].toLowerCase() : null;
}

async function runQuery(client, sql, params) {
  const base = toPg(sql);
  const isInsert = /^\s*insert/i.test(base) && !/returning/i.test(base);
  const table = isInsert ? insertTable(base) : null;
  const wantId = isInsert && !(table && NO_ID_TABLES.has(table));
  try {
    const r = await client.query(wantId ? `${base} RETURNING id` : base, params);
    return { changes: r.rowCount, lastId: r.rows[0] ? r.rows[0].id : undefined };
  } catch (err) {
    // Xavfsizlik to'ri: kutilmagan "id ustuni yo'q" (42703) holatida RETURNING'siz qayta urinamiz.
    if (wantId && err && err.code === '42703') {
      const r = await client.query(base, params);
      return { changes: r.rowCount, lastId: undefined };
    }
    throw err;
  }
}

class PostgresAdapter {
  constructor(connectionString) {
    this.dialect = 'postgres';
    this.pool = new Pool({
      connectionString,
      ssl: buildSsl(),
      max: Number(process.env.PG_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  async get(sql, params = []) {
    const r = await this.pool.query(toPg(sql), params);
    return r.rows[0] || null;
  }
  async all(sql, params = []) {
    const r = await this.pool.query(toPg(sql), params);
    return r.rows;
  }
  async run(sql, params = []) {
    return runQuery(this.pool, sql, params);
  }
  async exec(sql) {
    await this.pool.query(sql);
  }
  async tx(fn) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const wrap = {
        dialect: 'postgres',
        get: async (s, p = []) => (await client.query(toPg(s), p)).rows[0] || null,
        all: async (s, p = []) => (await client.query(toPg(s), p)).rows,
        run: (s, p = []) => runQuery(client, s, p),
      };
      const result = await fn(wrap);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  async close() {
    await this.pool.end();
  }
}

module.exports = PostgresAdapter;
