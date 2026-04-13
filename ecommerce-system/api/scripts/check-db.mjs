import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(root, '../.env') });
dotenv.config({ path: path.join(root, '../../.env') });

const u = process.env.DATABASE_URL;
console.log('DATABASE_URL configured:', Boolean(u));
if (!u) {
  process.exitCode = 2;
  process.exit();
}

const pool = new pg.Pool({ connectionString: u });
try {
  const db = await pool.query(
    'SELECT current_database() AS db, current_user AS u',
  );
  console.log('Connected OK -> database:', db.rows[0].db, 'user:', db.rows[0].u);
  const t = await pool.query(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename",
  );
  console.log('Public table count:', t.rows.length);
  if (t.rows.length) {
    console.log('Tables:', t.rows.map((r) => r.tablename).join(', '));
  } else {
    console.log(
      'No tables in public schema. Apply the migration (pgAdmin / psql), e.g.:',
    );
    console.log(
      '  psql "<your DATABASE_URL>" -f db/migrations/001_seller_products.sql',
    );
    console.log('  (run from the ecommerce-system folder)');
  }
} catch (e) {
  console.error('Connection/query FAILED:', e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  await pool.end();
}
