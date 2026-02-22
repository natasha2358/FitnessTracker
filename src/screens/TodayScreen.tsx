import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useEntriesForDate } from '../hooks/useEntries';
import { EntryList } from '../components/EntryList';
import { AddExerciseModal, AddExerciseModalRef } from '../components/AddExerciseModal';
import { WorkoutSessionModal, WorkoutSessionModalRef } from '../components/WorkoutSessionModal';
import { ProgramDayPickerModal, ProgramDayPickerModalRef } from '../components/ProgramDayPickerModal';
import { useStore } from '../store/useStore';
import { ProgramDay, getDayColor, PROGRAM } from '../constants/program';

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function TodayScreen() {
  const today = new Date().toISOString().split('T')[0];
  const { entries, loading } = useEntriesForDate(today);
  const { bumpEntriesVersion, programDateMap } = useStore();

  const modalRef        = useRef<AddExerciseModalRef>(null);
  const pickerRef       = useRef<ProgramDayPickerModalRef>(null);
  const sessionModalRef = useRef<WorkoutSessionModalRef>(null);

  const handleAdd = useCallback(() => {
    modalRef.current?.open(today);
  }, [today]);

  const handleOpenProgramPicker = useCallback(() => {
    pickerRef.current?.open();
  }, []);

  const handleDaySelected = useCallback((day: ProgramDay) => {
    sessionModalRef.current?.open(day);
  }, []);

  // Show subheader if today has a program day recorded
  const todayDayNum = programDateMap[today];
  const todayProgDay = todayDayNum != null
    ? PROGRAM.find((d) => d.day === todayDayNum) ?? null
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.dateLabel}>{formatDate(today)}</Text>
          <Text style={styles.title}>Today</Text>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.programButton} onPress={handleOpenProgramPicker}>
            <Text style={styles.programButtonText}>📋 Program</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {todayProgDay && (
        <View style={[styles.subheader, { borderLeftColor: getDayColor(todayProgDay.title) }]}>
          <Text style={styles.subheaderText}>
            Day {todayProgDay.day} · {todayProgDay.title}
          </Text>
        </View>
      )}

      <EntryList
        entries={entries}
        loading={loading}
        onEntryAdded={bumpEntriesVersion}
      />

      <AddExerciseModal ref={modalRef} onSaved={bumpEntriesVersion} />
      <ProgramDayPickerModal ref={pickerRef} onSelect={handleDaySelected} />
      <WorkoutSessionModal ref={sessionModalRef} onSaved={bumpEntriesVersion} />
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
  titleBlock: { flex: 1 },
  dateLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: { ...typography.h1, marginTop: 2 },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  programButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  programButtonText: { ...typography.body, color: colors.text, fontSize: 13 },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  addButtonText: { ...typography.bodyMed, color: colors.white },
  subheader: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  subheaderText: {
    ...typography.bodyMed,
    color: colors.textSub,
    fontSize: 13,
  },
});
