// lib/db.ts
// NeonDB PostgreSQL connection pool via 'pg'
import { Pool } from 'pg';

let pool: Pool;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function initDB(): Promise<void> {
  const db = getPool();

  // Create users table (with room_number)
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255)        NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      password    TEXT                NOT NULL,
      role        VARCHAR(20)         NOT NULL DEFAULT 'student',
      room_number VARCHAR(20),
      created_at  TIMESTAMPTZ         DEFAULT NOW()
    );
  `);

  // Migration: add room_number to existing tables that don't have it yet
  await db.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS room_number VARCHAR(20);
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
