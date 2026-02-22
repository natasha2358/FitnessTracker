import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_DAYS_KEY = 'program_completed_days';
const DATE_DAY_MAP_KEY   = 'program_date_day_map';

export async function getCompletedDays(): Promise<number[]> {
  try {
    const val = await AsyncStorage.getItem(COMPLETED_DAYS_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function markDayCompleted(day: number): Promise<void> {
  const current = await getCompletedDays();
  if (!current.includes(day)) {
    await AsyncStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify([...current, day]));
  }
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(COMPLETED_DAYS_KEY);
  await AsyncStorage.removeItem(DATE_DAY_MAP_KEY);
}

export async function getDateDayMap(): Promise<Record<string, number>> {
  try {
    const val = await AsyncStorage.getItem(DATE_DAY_MAP_KEY);
    return val ? JSON.parse(val) : {};
  } catch {
    return {};
  }
}

export async function setDateDay(dateStr: string, day: number): Promise<void> {
  const current = await getDateDayMap();
  current[dateStr] = day;
  await AsyncStorage.setItem(DATE_DAY_MAP_KEY, JSON.stringify(current));
}
