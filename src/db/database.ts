import * as SQLite from 'expo-sqlite';
import { SEED_EXERCISES } from '../constants/exercises';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('fitness.db');
  }
  return _db;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS exercises (
      id         TEXT PRIMARY KEY NOT NULL,
      name       TEXT NOT NULL,
      category   TEXT NOT NULL,
      imageKey   TEXT NOT NULL,
      isFavorite INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS log_entries (
      id           TEXT PRIMARY KEY NOT NULL,
      dateTime     INTEGER NOT NULL,
      exerciseId   TEXT NOT NULL,
      exerciseName TEXT,
      weight       REAL NOT NULL,
      unit         TEXT NOT NULL DEFAULT 'kg',
      note         TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_log_dateTime ON log_entries(dateTime);
    CREATE INDEX IF NOT EXISTS idx_log_exerciseId ON log_entries(exerciseId);
  `);

  // Add exerciseName column if it doesn't exist (migration for existing installs)
  try {
    await db.execAsync(`ALTER TABLE log_entries ADD COLUMN exerciseName TEXT`);
  } catch (_) {
    // Column already exists, ignore
  }

  await seedIfNeeded(db);
}

async function seedIfNeeded(db: SQLite.SQLiteDatabase): Promise<void> {
  for (const ex of SEED_EXERCISES) {
    await db.runAsync(
      `INSERT OR IGNORE INTO exercises (id, name, category, imageKey, isFavorite) VALUES (?, ?, ?, ?, 0)`,
      [ex.id, ex.name, ex.category, ex.imageKey]
    );
  }
}
