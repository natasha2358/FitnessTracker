import { create } from 'zustand';
import { getCompletedDays, getDateDayMap } from '../db/programProgress';

interface AppState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  unit: 'kg' | 'lb';
  toggleUnit: () => void;
  entriesVersion: number;
  bumpEntriesVersion: () => void;
  exercisesVersion: number;
  bumpExercisesVersion: () => void;

  // Program progress
  completedProgramDays: number[];
  setCompletedProgramDays: (days: number[]) => void;
  addCompletedProgramDay: (day: number) => void;
  resetCompletedProgramDays: () => void;

  // Date → program day number mapping
  programDateMap: Record<string, number>;
  setProgramDateMap: (map: Record<string, number>) => void;
  setDateProgramDay: (date: string, dayNum: number) => void;

  // Load persisted program data from AsyncStorage
  loadProgramProgress: () => Promise<void>;
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

  completedProgramDays: [],
  setCompletedProgramDays: (days) => set({ completedProgramDays: days }),
  addCompletedProgramDay: (day) =>
    set((s) =>
      s.completedProgramDays.includes(day)
        ? s
        : { completedProgramDays: [...s.completedProgramDays, day] }
    ),
  resetCompletedProgramDays: () => set({ completedProgramDays: [] }),

  programDateMap: {},
  setProgramDateMap: (map) => set({ programDateMap: map }),
  setDateProgramDay: (date, dayNum) =>
    set((s) => ({ programDateMap: { ...s.programDateMap, [date]: dayNum } })),

  loadProgramProgress: async () => {
    const [days, map] = await Promise.all([getCompletedDays(), getDateDayMap()]);
    set({ completedProgramDays: days, programDateMap: map });
  },
}));
