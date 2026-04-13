import cors from 'cors';
import express from 'express';

import { pool } from './db/pool.js';
import { runMigrations } from './db/migrate.js';
import { productsRouter } from './routes/products.js';
import { UPLOAD_ROOT, uploadRouter } from './routes/upload.js';

if (pool && process.env.SKIP_DB_MIGRATE !== '1') {
  try {
    await runMigrations(pool);
    console.log('[api] Database migrations up to date');
  } catch (e) {
    console.error('[api] Database migration failed:', e);
    process.exit(1);
  }
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(UPLOAD_ROOT));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'kpd-smart-api' });
});

app.get('/health/db', async (_req, res) => {
  if (!pool) {
    res.status(503).json({
      ok: false,
      error: 'DATABASE_URL is not set.',
    });
    return;
  }
  try {
    const r = await pool.query<{ db: string; now: string }>(
      'SELECT current_database() AS db, now()::text AS now',
    );
    const row = r.rows[0];
    res.json({
      ok: true,
      database: row?.db,
      serverTime: row?.now,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(503).json({ ok: false, error: message });
  }
});

app.use('/api/upload', uploadRouter);
app.use('/api/products', productsRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  if (!pool) {
    console.warn(
      '[api] DATABASE_URL missing — create ecommerce-system/.env (see api/env.example)',
    );
  }
});
