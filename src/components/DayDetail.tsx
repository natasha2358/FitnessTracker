import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEntriesForDate } from '../hooks/useEntries';
import { EntryList } from './EntryList';
import { useStore } from '../store/useStore';
import { colors, spacing, typography, radius } from '../constants/theme';
import { PROGRAM, getDayColor } from '../constants/program';

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
  const { bumpEntriesVersion, programDateMap } = useStore();

  const programDayNum = programDateMap[dateStr];
  const programDay = programDayNum != null
    ? PROGRAM.find((d) => d.day === programDayNum) ?? null
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dayTitle}>{formatDayHeader(dateStr)}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAddSet}>
          <Text style={styles.addBtnText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </View>

      {programDay && (
        <View style={[styles.programBadge, { borderLeftColor: getDayColor(programDay.title) }]}>
          <Text style={styles.programBadgeText}>
            📋 Day {programDay.day} · {programDay.title}
          </Text>
        </View>
      )}

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
  programBadge: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  programBadgeText: {
    ...typography.body,
    color: colors.textSub,
    fontSize: 12,
  },
});
