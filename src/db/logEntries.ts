import { getDb } from './database';
import * as Crypto from 'expo-crypto';

export interface LogEntry {
  id: string;
  dateTime: number;
  exerciseId: string;
  exerciseName?: string; // stored directly for program exercises not in DB
  weight: number;
  unit: 'kg' | 'lb';
  note?: string;
}

export async function getEntriesForDate(dateStr: string): Promise<LogEntry[]> {
  const db = await getDb();
  const start = new Date(dateStr + 'T00:00:00').getTime();
  const end   = new Date(dateStr + 'T23:59:59').getTime();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM log_entries WHERE dateTime >= ? AND dateTime <= ? ORDER BY dateTime ASC`,
    [start, end]
  );
  return rows.map(rowToEntry);
}

export async function getDatesWithEntries(year: number, month: number): Promise<string[]> {
  const db = await getDb();
  const startDate = new Date(year, month, 1);
  const endDate   = new Date(year, month + 1, 0, 23, 59, 59);
  const rows = await db.getAllAsync<any>(
    `SELECT DISTINCT dateTime FROM log_entries WHERE dateTime >= ? AND dateTime <= ?`,
    [startDate.getTime(), endDate.getTime()]
  );
  const dateSet = new Set<string>();
  for (const row of rows) {
    dateSet.add(new Date(row.dateTime).toISOString().split('T')[0]);
  }
  return Array.from(dateSet);
}

export async function getLastUsedWeight(exerciseId: string): Promise<{ weight: number; unit: 'kg' | 'lb' } | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    `SELECT weight, unit FROM log_entries WHERE exerciseId = ? ORDER BY dateTime DESC LIMIT 1`,
    [exerciseId]
  );
  return row ? { weight: row.weight, unit: row.unit } : null;
}

export async function getPersonalRecord(exerciseId: string): Promise<{ weight: number; unit: 'kg' | 'lb' } | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    `SELECT weight, unit FROM log_entries WHERE exerciseId = ? ORDER BY weight DESC LIMIT 1`,
    [exerciseId]
  );
  return row ? { weight: row.weight, unit: row.unit } : null;
}

export async function getHistoryForExercise(exerciseId: string): Promise<LogEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM log_entries WHERE exerciseId = ? ORDER BY dateTime DESC LIMIT 50`,
    [exerciseId]
  );
  return rows.map(rowToEntry);
}

export async function addEntry(entry: Omit<LogEntry, 'id'>): Promise<LogEntry> {
  const db = await getDb();
  const id = Crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO log_entries (id, dateTime, exerciseId, exerciseName, weight, unit, note) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, entry.dateTime, entry.exerciseId, entry.exerciseName ?? null, entry.weight, entry.unit, entry.note ?? null]
  );
  return { id, ...entry };
}

export async function updateEntry(id: string, weight: number, unit: 'kg' | 'lb', note?: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE log_entries SET weight = ?, unit = ?, note = ? WHERE id = ?`,
    [weight, unit, note ?? null, id]
  );
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM log_entries WHERE id = ?`, [id]);
}

export async function getStreakDays(): Promise<number> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT DISTINCT date(dateTime / 1000, 'unixepoch', 'localtime') as d
     FROM log_entries ORDER BY d DESC LIMIT 365`
  );
  if (!rows.length) return 0;
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const row of rows) {
    const d = new Date(row.d + 'T00:00:00');
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000);
    if (diff === 0 || diff === 1) { streak++; cursor = d; } else { break; }
  }
  return streak;
}

function rowToEntry(row: any): LogEntry {
  return {
    id: row.id,
    dateTime: row.dateTime,
    exerciseId: row.exerciseId,
    exerciseName: row.exerciseName ?? undefined,
    weight: row.weight,
    unit: row.unit as 'kg' | 'lb',
    note: row.note ?? undefined,
  };
}
