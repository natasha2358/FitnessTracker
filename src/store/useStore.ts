import { create } from 'zustand';

interface AppState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  unit: 'kg' | 'lb';
  toggleUnit: () => void;
  entriesVersion: number;
  bumpEntriesVersion: () => void;
  exercisesVersion: number;
  bumpExercisesVersion: () => void;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export const useStore = create<AppState>((set) => ({
  selectedDate: todayISO(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  unit: 'kg',
  toggleUnit: () => set((s) => ({ unit: s.unit === 'kg' ? 'lb' : 'kg' })),
  entriesVersion: 0,
  bumpEntriesVersion: () => set((s) => ({ entriesVersion: s.entriesVersion + 1 })),
  exercisesVersion: 0,
  bumpExercisesVersion: () => set((s) => ({ exercisesVersion: s.exercisesVersion + 1 })),
}));
