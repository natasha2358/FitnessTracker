import { getDb } from './database';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  imageKey: string;
  isFavorite: boolean;
}

export async function getAllExercises(): Promise<Exercise[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM exercises ORDER BY isFavorite DESC, name ASC`
  );
  return rows.map(rowToExercise);
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    `SELECT * FROM exercises WHERE id = ?`, [id]
  );
  return row ? rowToExercise(row) : null;
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE exercises SET isFavorite = ? WHERE id = ?`,
    [isFavorite ? 1 : 0, id]
  );
}

export async function createExercise(exercise: Omit<Exercise, 'isFavorite'>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO exercises (id, name, category, imageKey, isFavorite) VALUES (?, ?, ?, ?, 0)`,
    [exercise.id, exercise.name, exercise.category, exercise.imageKey]
  );
}

export async function deleteExercise(id: string): Promise<void> {
  const db = await getDb();
  // Also delete all log entries for this exercise
  await db.runAsync(`DELETE FROM log_entries WHERE exerciseId = ?`, [id]);
  await db.runAsync(`DELETE FROM exercises WHERE id = ?`, [id]);
}

function rowToExercise(row: any): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    imageKey: row.imageKey,
    isFavorite: row.isFavorite === 1,
  };
}
