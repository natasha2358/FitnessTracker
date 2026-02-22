import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useEntriesForDate } from '../hooks/useEntries';
import { EntryList } from '../components/EntryList';
import { AddExerciseModal, AddExerciseModalRef } from '../components/AddExerciseModal';
import { useStore } from '../store/useStore';

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function TodayScreen() {
  const today = new Date().toISOString().split('T')[0];
  const { entries, loading } = useEntriesForDate(today);
  const bumpEntriesVersion = useStore((s) => s.bumpEntriesVersion);
  const modalRef = useRef<AddExerciseModalRef>(null);

  const handleAdd = useCallback(() => {
    modalRef.current?.open(today);
  }, [today]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateLabel}>{formatDate(today)}</Text>
          <Text style={styles.title}>Today</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </View>

      <EntryList
        entries={entries}
        loading={loading}
        onEntryAdded={bumpEntriesVersion}
      />

      <AddExerciseModal ref={modalRef} onSaved={bumpEntriesVersion} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: { ...typography.h1, marginTop: 2 },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  addButtonText: { ...typography.bodyMed, color: colors.white },
});
