import { useEffect, useState } from 'react';
import { getAllExercises, Exercise } from '../db/exercises';
import { useStore } from '../store/useStore';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const version = useStore((s) => s.exercisesVersion);
  useEffect(() => {
    getAllExercises().then(setExercises).finally(() => setLoading(false));
  }, [version]);
  return { exercises, loading };
}
