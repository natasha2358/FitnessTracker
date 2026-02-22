export interface ProgramDay {
  day: number;
  title: string;
  exercises: string[];
}

export const PROGRAM: ProgramDay[] = [
  { day: 1,  title: 'Leg Day',                  exercises: ['Suitcase Squat', 'Static Lunge', 'RDL', 'Rear-Step Lunge', 'Pause-Bottom Goblet Squat', 'Lateral Lunge', 'Half Goblet Squat', 'Full Goblet Squat'] },
  { day: 2,  title: 'Upper Body',               exercises: ['Chest Press', 'Flyes', 'Renegade Row', 'Pullover', 'Shoulder Press', 'Rear Delt Fly', 'Lateral Raise', 'Alternating Front Raise'] },
  { day: 3,  title: 'Glutes',                   exercises: ['Banded Hip Thrust (Pause)', 'Hip Thrust (Pause)', 'Staggered Hip Thrust', 'Sumo Deadlift Squat', 'Bulgarian Lunge', 'Single-Leg Hip Thrust'] },
  { day: 4,  title: 'Full Body',                exercises: ['Bent-Over Row', 'Static Lunge', 'RDL', 'Chest Press', 'Push Press', 'Heel-Elevated Squat', 'Rear-Step Lunge', 'Maker'] },
  { day: 5,  title: 'Arms + Abs',               exercises: ['Palms-Up Curls', 'Diamond Press', 'Dips', 'Wide Curls', 'Tricep Press', 'Skull Crushers', 'Hammer Curls'] },
  { day: 6,  title: 'Leg Day',                  exercises: ['Closer-Stance Lunge', 'Heel-Elevated Squat (Slow)', 'Bulgarian Lunge (Slow)', 'Close Bulgarian Lunge', 'Goblet Squat', 'Heel-Elevated Squat + Hold'] },
  { day: 7,  title: 'Shoulders + Triceps',      exercises: ['Shoulder Press', 'Arnold Press', 'Face Pulls', 'Alternating Lateral Raises', 'Upright Rows', 'Tate Press', 'Skull Crushers', 'Shoulder Crushers', 'Overhead Tricep Extension', 'Lateral Raise + Partials'] },
  { day: 8,  title: 'Glutes + Hamstrings',      exercises: ['RDL', 'Banded Hip Thrust (Slow/Pause)', 'Banded Hamstring Hip Thrust', 'Staggered RDL (L/R)', 'Lunge to Staggered RDL', 'Single-Leg Hamstring Thrust'] },
  { day: 9,  title: 'Full Body',                exercises: ['Bent-Over Row', 'Squat-to-Press', 'High Squat', 'Chest Press', 'Static Lunge', 'Single-Arm Shoulder Press', 'Lateral Lunge', 'Half-Squat + Push Press + Squat-to-Press'] },
  { day: 10, title: 'Back + Biceps',            exercises: ['Single-Arm Row', 'Pullover', 'Single-Arm Supine Row', 'Hammer Curls', 'Cross-Body Curls', 'Wide Curls', 'Supine Row + 21s Palms-Up Curls'] },
  { day: 11, title: 'Leg Day + Calves',         exercises: ['Paused Goblet Squat', 'Elevated Lunge', 'Paused Lunge', 'Rear-Step Lunge (2 DB)', 'Rear-Step Forward-Lean Lunge', 'Step-Into Curtsy Lunge', 'Static Curtsy Lunge', 'Calf Raise Variations'] },
  { day: 12, title: 'Chest + Triceps',          exercises: ['Chest Press', 'Diamond Press', 'Flyes', 'Tricep Press', 'Skull Crushers', 'Dips'] },
  { day: 13, title: 'Glutes / Hamstrings / Back', exercises: ['Renegade Row', 'Rotational Row', 'Deadstop Row', 'Pullovers', 'RDL (Slow/Pause)', 'Staggered RDL', 'Sumo Deadlift Squat', 'Banded Hip Thrust'] },
  { day: 14, title: 'Unilateral Full Body',     exercises: ['Alternating Chest Press', 'Static Lunge', 'Alternating Rear-Step Lunge', 'Renegade Row (L/R)', 'Bulgarian Lunge', 'Forward-Lean Lunge', 'Single-Arm Arnold Press', 'Clean to Single-Arm Arnold Press', 'Squat-to-Lunge'] },
  { day: 15, title: 'Shoulders',               exercises: ['Shoulder Press', 'Frontal Raise', 'Rear Delt Fly', 'Lateral Raise', 'Hammer Front Raise', 'Partial Rear Delt Raise', 'Lateral Partials', 'Arc Raise'] },
  { day: 16, title: 'Hamstrings',              exercises: ['RDL (Slow/Paused)', 'Staggered RDL', 'Staggered RDL to Lunge', 'Balance RDL', 'Hamstring Thrust', 'Single-Leg Hamstring Thrust'] },
  { day: 17, title: 'Complete Upper Body',     exercises: ['Chest Press + Dips', 'Pullovers', 'Diamond Press', 'Landmine Row', 'Arnold Press', 'Lateral-to-Frontal Arcs', 'Partial Rear Delt Fly', 'Around-the-World'] },
  { day: 18, title: 'Glutes',                  exercises: ['Sumo Squat Deadlift', 'Banded Hip Thrust + Hold', 'Hip Thrust Pulses', 'Full Hip Thrust', 'Elevated Lunge', 'Rear Lunge', 'Single-Leg Hip Thrust + Pulses'] },
  { day: 19, title: 'Full Body',               exercises: ['Chest Press', 'Push-Ups', 'Static Lunge', 'Rear-Step Forward Lunge', 'Pullovers', 'Bent-Over Row', 'Pause Goblet Squat', '1½ Goblet Squat', 'Shoulder Press', 'Push Press', 'RDL', '1½ RDL'] },
  { day: 20, title: 'Arms + Abs / Core',       exercises: ['Diamond Press', 'Tricep Press', 'Skull Crushers', 'Shoulder Crushers', 'Overhead Tricep Extension', 'Plank Hip Twist', 'Side Plank Lift', 'Leg Lowers + Reverse Crunch', 'Palms-Up Curls', 'Wide Curls', 'Hammer Curls', 'Cross-Body Curls'] },
  { day: 21, title: 'Leg Day – Step Ups',      exercises: ['Heel-Elevated Squat', 'Static Lunge + Step-Up', 'Rear-Step Lunge + Step-Up', 'Lateral Lunge + Side Step-Up', 'Forward-Lean Lunge + Step-Up', 'Single Calf Raise (L/R)'] },
  { day: 22, title: 'Upper Body',              exercises: ['Chest Press', 'Flyes', 'Single-Arm Row', 'Pullovers', 'Momentum Row', 'Push-Ups', 'Supine Double Row', 'Alternating Renegade Row'] },
  { day: 23, title: 'Glutes + Hamstrings',     exercises: ['RDL Slow Eccentric', 'Sumo Deadlift Slow Eccentric', 'Banded Hip Thrust', 'Hip Thrust (Slow)', 'Hamstring Hip Thrust', 'Glute Bridge', 'Hamstring Bridge', 'Single-Leg Bridge'] },
  { day: 24, title: 'Full Body – Circuits',    exercises: ['High Squat', 'Squat-to-Press', 'Bent-Over Rowmaker', 'RDL', 'RDL to High Squat', 'Shoulder Press', 'Clean-to-Press', 'Forward Step Alternating Lunges', 'Rear-Step Alternating Lunge'] },
  { day: 25, title: 'Shoulders – Supersets',   exercises: ['Rear Delt Flyes', 'Hammer Raise', '90° Lateral Raise', 'Rear Delt Row', 'Upright Row', 'Arc Frontal Raise', 'Lateral Raise + Partials', 'Arnold Press'] },
  { day: 26, title: 'Leg Day – Step Ups',      exercises: ['Sumo Deadlift Squat', 'Lunge Hold', 'Alternating Rear Lunge', 'RDL', 'Step-Up (L/R)', 'Sumo Deadlift Hold'] },
  { day: 27, title: 'Upper Body – Antagonist', exercises: ['Alternating Renegade Rows', 'Pause Push-Ups', 'Pullovers', 'Diamond Press', 'Single-Arm Hammer Press', 'Single-Arm Rear Delt Fly', 'Slow Lateral Raise', 'Slow Frontal Raise'] },
  { day: 28, title: 'Glutes',                  exercises: ['Clam (Slow/Hold/Faster)', 'Straight-Leg Lift', 'Hip Thrust', 'Staggered Thrust', 'Forward-Lean Bulgarian Lunge', 'Single-Leg Thrust'] },
  { day: 29, title: 'Full Body – Hypertrophy', exercises: ['Shoulder Press', 'Static Lunge (L/R)', 'Chest Press', 'Paused Goblet Squat', 'Pullover', 'RDL', 'Bulgarian Lunge (L/R)', 'Push-Ups'] },
  { day: 30, title: 'Arms + Abs / Core',       exercises: ['Dips', 'Tricep Press', 'Skull Crushers', 'Crunch + Crunch Pulses', 'X-Arm Sit-Up', 'Hollow-to-V Sit', 'Reverse Crunch', 'Plank Feet Walkout', 'Cross-Body Curl', 'Hammer Curls', 'Alternating Curls'] },
];

const DAY_COLORS: Record<string, string> = {
  'Leg Day':       '#4CAF84',
  'Upper Body':    '#6C63FF',
  'Glutes':        '#FF6584',
  'Full Body':     '#FF9800',
  'Arms':          '#2196F3',
  'Back':          '#2196F3',
  'Shoulders':     '#9C27B0',
  'Hamstrings':    '#4CAF84',
  'Chest':         '#6C63FF',
  'Unilateral':    '#FF9800',
};

export function getDayColor(title: string): string {
  for (const key of Object.keys(DAY_COLORS)) {
    if (title.includes(key)) return DAY_COLORS[key];
  }
  return '#6C63FF';
}
