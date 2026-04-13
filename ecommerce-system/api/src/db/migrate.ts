import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Pool } from 'pg';

/** ecommerce-system/db/migrations — works from api/src (tsx) and api/dist (node). */
export function migrationsDirectory(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, '../../../db/migrations');
}

/**
 * Runs all *.sql files in migrationsDirectory() in alphabetical order.
 * Scripts should use IF NOT EXISTS so repeats are safe.
 */
export async function runMigrations(pool: Pool): Promise<void> {
  const dir = migrationsDirectory();
  if (!fs.existsSync(dir)) {
    throw new Error(`Migrations folder not found: ${dir}`);
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  const client = await pool.connect();
  try {
    for (const file of files) {
      const full = path.join(dir, file);
      const sql = fs.readFileSync(full, 'utf8').trim();
      if (!sql) {
        continue;
      }
      await client.query(sql);
    }
  } finally {
    client.release();
  }
}
