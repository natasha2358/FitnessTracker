export type ExerciseCategory = 'Push' | 'Pull' | 'Legs' | 'Core' | 'Pilates' | 'Other';

export interface SeedExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  imageKey: string;
}

export const SEED_EXERCISES: SeedExercise[] = [
  { id: 'bench_press',       name: 'Bench Press',       category: 'Push',    imageKey: 'bench_press' },
  { id: 'incline_press',     name: 'Incline Press',     category: 'Push',    imageKey: 'incline_press' },
  { id: 'overhead_press',    name: 'Overhead Press',    category: 'Push',    imageKey: 'overhead_press' },
  { id: 'lateral_raise',     name: 'Lateral Raise',     category: 'Push',    imageKey: 'lateral_raise' },
  { id: 'tricep_pushdown',   name: 'Tricep Pushdown',   category: 'Push',    imageKey: 'tricep_pushdown' },
  { id: 'deadlift',          name: 'Deadlift',          category: 'Pull',    imageKey: 'deadlift' },
  { id: 'barbell_row',       name: 'Barbell Row',       category: 'Pull',    imageKey: 'barbell_row' },
  { id: 'pull_up',           name: 'Pull-Up',           category: 'Pull',    imageKey: 'pull_up' },
  { id: 'lat_pulldown',      name: 'Lat Pulldown',      category: 'Pull',    imageKey: 'lat_pulldown' },
  { id: 'bicep_curl',        name: 'Bicep Curl',        category: 'Pull',    imageKey: 'bicep_curl' },
  { id: 'squat',             name: 'Squat',             category: 'Legs',    imageKey: 'squat' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', category: 'Legs',    imageKey: 'romanian_deadlift' },
  { id: 'leg_press',         name: 'Leg Press',         category: 'Legs',    imageKey: 'leg_press' },
  { id: 'lunges',            name: 'Lunges',            category: 'Legs',    imageKey: 'lunges' },
  { id: 'leg_curl',          name: 'Leg Curl',          category: 'Legs',    imageKey: 'leg_curl' },
  { id: 'plank',             name: 'Plank',             category: 'Core',    imageKey: 'plank' },
  { id: 'cable_crunch',      name: 'Cable Crunch',      category: 'Core',    imageKey: 'cable_crunch' },
  { id: 'ab_rollout',        name: 'Ab Rollout',        category: 'Core',    imageKey: 'ab_rollout' },
  { id: 'face_pull',         name: 'Face Pull',         category: 'Other',   imageKey: 'face_pull' },
  { id: 'farmers_carry',     name: "Farmer's Carry",    category: 'Other',   imageKey: 'farmers_carry' },
  { id: 'pilates',           name: 'Pilates',           category: 'Pilates', imageKey: 'pilates' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Push:    '#6C63FF',
  Pull:    '#FF6584',
  Legs:    '#4CAF84',
  Core:    '#FF9800',
  Pilates: '#E91E8C',
  Other:   '#2196F3',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  Push:    '💪',
  Pull:    '🏋️',
  Legs:    '🦵',
  Core:    '🎯',
  Pilates: '🧘',
  Other:   '⚡',
};

export function getExerciseColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#6C63FF';
}

export function getExerciseEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] ?? '💪';
}
