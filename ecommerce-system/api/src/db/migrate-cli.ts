import { pool } from './pool.js';
import { runMigrations } from './migrate.js';

if (!pool) {
  console.error('DATABASE_URL is not set.');
  process.exit(2);
}

try {
  await runMigrations(pool);
  console.log('Migrations finished OK.');
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await pool.end();
}
