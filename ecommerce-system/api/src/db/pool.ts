import dotenv from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, '../../.env') });
dotenv.config({ path: path.join(here, '../../../.env') });

const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl ? new pg.Pool({ connectionString: databaseUrl }) : null;

export function requirePool(): pg.Pool {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured');
  }
  return pool;
}
