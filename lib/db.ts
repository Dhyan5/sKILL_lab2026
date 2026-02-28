// lib/db.ts
// NeonDB PostgreSQL connection pool via 'pg'
import { Pool } from 'pg';

let pool: Pool;

/**
 * Returns a singleton PostgreSQL connection pool.
 * Uses DATABASE_URL from environment variables.
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

/**
 * Initialise database tables if they don't already exist.
 * Called once at API startup via the /api/init route.
 */
export async function initDB(): Promise<void> {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      name      VARCHAR(255)        NOT NULL,
      email     VARCHAR(255) UNIQUE NOT NULL,
      password  TEXT                NOT NULL,
      role      VARCHAR(20)         NOT NULL DEFAULT 'student',
      created_at TIMESTAMPTZ        DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS complaints (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category    VARCHAR(100)   NOT NULL,
      description TEXT           NOT NULL,
      priority    VARCHAR(20)    NOT NULL DEFAULT 'medium',
      status      VARCHAR(20)    NOT NULL DEFAULT 'pending',
      created_at  TIMESTAMPTZ    DEFAULT NOW(),
      updated_at  TIMESTAMPTZ    DEFAULT NOW()
    );
  `);
}
