import React, {
  forwardRef, useImperativeHandle, useRef, useState, useCallback,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView,
} from 'react-native';
import {
  BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { ProgramDay, getDayColor } from '../constants/program';
import { addEntry } from '../db/logEntries';
import { getAllExercises } from '../db/exercises';
import { markDayCompleted, setDateDay } from '../db/programProgress';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useStore } from '../store/useStore';

export interface WorkoutSessionModalRef {
  open: (day: ProgramDay) => void;
}

interface WorkoutSessionModalProps {
  onSaved?: () => void;
}

interface ExerciseEntry {
  name: string;
  weight: string;
  done: boolean;
  exerciseId: string | null;
}

function DateSelector({ date, onChange, color }: { date: string; onChange: (d: string) => void; color: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    days.push(day);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dateRow}
    >
      {days.map((day) => {
        const iso = day.toISOString().split('T')[0];
        const isSelected = iso === date;
        const isToday = day.getTime() === today.getTime();
        return (
          <TouchableOpacity
            key={iso}
            style={[styles.dateChip, isSelected && { backgroundColor: color, borderColor: color }]}
            onPress={() => onChange(iso)}
          >
            <Text style={[styles.dateChipDay, isSelected && styles.dateChipTextActive]}>
              {isToday ? 'Today' : day.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={[styles.dateChipNum, isSelected && styles.dateChipTextActive]}>
              {day.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export const WorkoutSessionModal = forwardRef<WorkoutSessionModalRef, WorkoutSessionModalProps>(
  ({ onSaved }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [day, setDay] = useState<ProgramDay | null>(null);
    const [entries, setEntries] = useState<ExerciseEntry[]>([]);
    const [saving, setSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { unit, bumpEntriesVersion, addCompletedProgramDay, setDateProgramDay } = useStore();

    useImperativeHandle(ref, () => ({
      async open(programDay: ProgramDay) {
        const dbExercises = await getAllExercises();
        const mapped: ExerciseEntry[] = programDay.exercises.map((name) => {
          const match = dbExercises.find(
            (ex) => ex.name.toLowerCase() === name.toLowerCase()
          );
          return { name, weight: '', done: false, exerciseId: match?.id ?? null };
        });
        setDay(programDay);
        setEntries(mapped);
        setSaving(false);
        setSelectedDate(new Date().toISOString().split('T')[0]);
        sheetRef.current?.present();
      },
    }));

    const updateWeight = useCallback((index: number, value: string) => {
      setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, weight: value } : e)));
    }, []);

    const toggleDone = useCallback((index: number) => {
      setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, done: !e.done } : e)));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const handleSaveAll = useCallback(async () => {
      if (!day) return;
      const toSave = entries.filter((e) => e.weight && parseFloat(e.weight) > 0);
      if (toSave.length === 0) {
        Alert.alert('No weights entered', 'Enter at least one weight to save.');
        return;
      }
      setSaving(true);
      try {
        const now = new Date();
        const [y, m, d] = selectedDate.split('-').map(Number);

        for (let i = 0; i < toSave.length; i++) {
          const e = toSave[i];
          const parsed = parseFloat(e.weight);
          if (isNaN(parsed) || parsed <= 0) continue;
          const exerciseId = e.exerciseId ?? e.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          await addEntry({
            dateTime: new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds() + i).getTime(),
            exerciseId,
            exerciseName: e.exerciseId ? undefined : e.name,
            weight: parsed,
            unit,
          });
        }

        // Persist program day completion and date mapping
        await markDayCompleted(day.day);
        await setDateDay(selectedDate, day.day);
        addCompletedProgramDay(day.day);
        setDateProgramDay(selectedDate, day.day);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        bumpEntriesVersion();
        onSaved?.();

        const todayIso = new Date().toISOString().split('T')[0];
        const dateLabel = selectedDate === todayIso
          ? 'today'
          : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        Alert.alert(
          '✅ Workout Saved!',
          `${toSave.length} exercise${toSave.length > 1 ? 's' : ''} logged for ${dateLabel}.`,
          [{ text: 'Done', onPress: () => sheetRef.current?.dismiss() }]
        );
      } catch (err: any) {
        Alert.alert('Error', err?.message ?? 'Could not save workout');
      } finally {
        setSaving(false);
      }
    }, [day, entries, unit, selectedDate, bumpEntriesVersion, addCompletedProgramDay, setDateProgramDay, onSaved]);

    if (!day) return null;

    const color = getDayColor(day.title);
    const filledCount = entries.filter((e) => e.weight && parseFloat(e.weight) > 0).length;

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={['92%']}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        {/* Fixed header with date picker */}
        <View style={[styles.sessionHeader, { borderBottomColor: color + '44' }]}>
          <View style={styles.headerTop}>
            <View style={[styles.dayBadge, { backgroundColor: color + '22' }]}>
              <Text style={[styles.dayBadgeText, { color }]}>DAY {day.day}</Text>
            </View>
            <Text style={styles.sessionTitle}>{day.title}</Text>
          </View>

          <Text style={styles.datePickerLabel}>📅  Log for:</Text>
          <DateSelector date={selectedDate} onChange={setSelectedDate} color={color} />

          <Text style={styles.sessionSub}>
            {filledCount}/{entries.length} filled · {unit}
          </Text>
        </View>

        {/* Scrollable exercise list */}
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {entries.map((entry, index) => (
            <View key={index} style={[styles.exerciseRow, entry.done && styles.exerciseRowDone]}>
              <TouchableOpacity
                style={[styles.checkbox, entry.done && { backgroundColor: color, borderColor: color }]}
                onPress={() => toggleDone(index)}
              >
                {entry.done && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>

              <Text style={[styles.exerciseName, entry.done && styles.exerciseNameDone]} numberOfLines={2}>
                {entry.name}
              </Text>

              <View style={styles.weightInputWrapper}>
                <TextInput
                  style={[styles.weightInput, entry.weight ? { borderColor: color } : {}]}
                  value={entry.weight}
                  onChangeText={(v) => updateWeight(index, v)}
                  placeholder="—"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                  editable={!entry.done}
                />
                <Text style={styles.unitLabel}>{unit}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: color }, saving && styles.disabled]}
            onPress={handleSaveAll}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? 'Saving...'
                : filledCount > 0
                ? `Save ${filledCount} Exercise${filledCount > 1 ? 's' : ''}`
                : 'Enter weights to save'}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.surface },
  handle: { backgroundColor: colors.border },
  sessionHeader: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dayBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  dayBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sessionTitle: { ...typography.h2 },
  datePickerLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  dateChip: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    minWidth: 52,
  },
  dateChipDay: { fontSize: 10, fontWeight: '600', color: colors.textMuted },
  dateChipNum: { fontSize: 16, fontWeight: '700', color: colors.text },
  dateChipTextActive: { color: colors.white },
  sessionSub: { ...typography.caption, marginTop: 4 },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 60,
    gap: spacing.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseRowDone: { opacity: 0.5 },
  checkbox: {
    width: 24, height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: colors.white, fontSize: 13, fontWeight: '700' },
  exerciseName: { ...typography.body, flex: 1, fontSize: 14 },
  exerciseNameDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  weightInputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weightInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    width: 64,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...typography.bodyMed,
    color: colors.text,
    textAlign: 'center',
  },
  unitLabel: { ...typography.caption, width: 20 },
  saveButton: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  disabled: { opacity: 0.4 },
  saveButtonText: { ...typography.bodyMed, color: colors.white },
});
