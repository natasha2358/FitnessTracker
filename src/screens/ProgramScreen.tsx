import React, { useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { PROGRAM, ProgramDay, getDayColor } from '../constants/program';
import { colors, spacing, typography, radius } from '../constants/theme';
import { WorkoutSessionModal, WorkoutSessionModalRef } from '../components/WorkoutSessionModal';
import { useStore } from '../store/useStore';
import { resetProgress } from '../db/programProgress';

export function ProgramScreen() {
  const sessionModalRef = useRef<WorkoutSessionModalRef>(null);
  const { completedProgramDays, resetCompletedProgramDays, setProgramDateMap } = useStore();

  const handleResetProgress = useCallback(() => {
    Alert.alert(
      'Reset Progress',
      'This will clear all completed day markers. Your logged workouts will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            resetCompletedProgramDays();
            setProgramDateMap({});
          },
        },
      ]
    );
  }, [resetCompletedProgramDays, setProgramDateMap]);

  const renderDay = ({ item }: { item: ProgramDay }) => {
    const color = getDayColor(item.title);
    const done = completedProgramDays.includes(item.day);
    return (
      <TouchableOpacity
        style={[styles.dayCard, done && styles.dayCardDone]}
        onPress={() => sessionModalRef.current?.open(item)}
        activeOpacity={0.75}
      >
        <View style={[styles.dayNumberBox, { backgroundColor: done ? colors.border + '66' : color + '22', borderRightColor: colors.border }]}>
          <Text style={[styles.dayNumber, { color: done ? colors.textMuted : color }]}>{item.day}</Text>
          {done && <Text style={styles.doneCheck}>✓</Text>}
        </View>
        <View style={styles.dayInfo}>
          <Text style={[styles.dayLabel, done && styles.textMuted]}>DAY {item.day}</Text>
          <Text style={[styles.dayTitle, done && styles.textMuted]}>{item.title}</Text>
          <Text style={styles.exerciseCount}>{item.exercises.length} exercises</Text>
        </View>
        <View style={[styles.accentBar, { backgroundColor: done ? colors.border : color }]} />
      </TouchableOpacity>
    );
  };

  const completedCount = completedProgramDays.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>30-Day Program</Text>
          <Text style={styles.subtitle}>
            {completedCount > 0
              ? `${completedCount}/30 days completed`
              : 'Tap a day to log your workout'}
          </Text>
        </View>
        {completedCount > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleResetProgress}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={PROGRAM}
        keyExtractor={(item) => String(item.day)}
        renderItem={renderDay}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <WorkoutSessionModal ref={sessionModalRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.caption, marginTop: 2 },
  resetButton: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  resetButtonText: { ...typography.label, color: colors.textMuted },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
    gap: spacing.sm,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardDone: {
    opacity: 0.6,
    backgroundColor: colors.surfaceAlt,
  },
  dayNumberBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  dayNumber: { fontSize: 22, fontWeight: '800' },
  doneCheck: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  dayInfo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dayLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  dayTitle: { ...typography.bodyMed, marginTop: 1 },
  textMuted: { color: colors.textMuted },
  exerciseCount: { ...typography.caption, marginTop: 2 },
  accentBar: { width: 4, alignSelf: 'stretch' },
});
