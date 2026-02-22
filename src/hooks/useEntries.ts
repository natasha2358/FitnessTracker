import { useEffect, useState } from 'react';
import { getEntriesForDate, LogEntry } from '../db/logEntries';
import { useStore } from '../store/useStore';

export function useEntriesForDate(dateStr: string) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const version = useStore((s) => s.entriesVersion);
  useEffect(() => {
    setLoading(true);
    getEntriesForDate(dateStr).then(setEntries).finally(() => setLoading(false));
  }, [dateStr, version]);
  return { entries, loading };
}
