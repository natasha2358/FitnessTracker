import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEntriesForDate } from '../hooks/useEntries';
import { EntryList } from './EntryList';
import { useStore } from '../store/useStore';
import { colors, spacing, typography, radius } from '../constants/theme';

interface Props {
  dateStr: string;
  onAddSet: () => void;
}

function formatDayHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date().toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export function DayDetail({ dateStr, onAddSet }: Props) {
  const { entries, loading } = useEntriesForDate(dateStr);
  const bumpEntriesVersion = useStore((s) => s.bumpEntriesVersion);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dayTitle}>{formatDayHeader(dateStr)}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAddSet}>
          <Text style={styles.addBtnText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </View>
      <EntryList entries={entries} loading={loading} onEntryAdded={bumpEntriesVersion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dayTitle: { ...typography.h3 },
  addBtn: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addBtnText: { ...typography.bodyMed, color: colors.primary },
});
