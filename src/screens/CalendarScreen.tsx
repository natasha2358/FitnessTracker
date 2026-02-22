import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
import { CalendarMonth } from '../components/CalendarMonth';
import { DayDetail } from '../components/DayDetail';
import { StreakBadge } from '../components/StreakBadge';
import { AddExerciseModal, AddExerciseModalRef } from '../components/AddExerciseModal';
import { useStore } from '../store/useStore';
import { getDatesWithEntries } from '../db/logEntries';
import { getDayColor, PROGRAM } from '../constants/program';

export function CalendarScreen() {
  const { selectedDate, setSelectedDate, bumpEntriesVersion, entriesVersion, programDateMap } = useStore();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const modalRef = useRef<AddExerciseModalRef>(null);

  const loadMarked = useCallback(async (year: number, month: number) => {
    const dates = await getDatesWithEntries(year, month);
    const marks: Record<string, any> = {};
    for (const d of dates) {
      // Use program day color if one was done that day, else default
      const dayNum = programDateMap[d];
      const programDay = dayNum != null ? PROGRAM.find((p) => p.day === dayNum) : null;
      const dotColor = programDay ? getDayColor(programDay.title) : colors.primary;
      marks[d] = { marked: true, dotColor };
    }
    marks[selectedDate] = {
      ...(marks[selectedDate] ?? {}),
      selected: true,
      selectedColor: colors.primary,
    };
    setMarkedDates(marks);
  }, [selectedDate, programDateMap]);

  useEffect(() => {
    const d = new Date(selectedDate + 'T00:00:00');
    loadMarked(d.getFullYear(), d.getMonth());
  }, [selectedDate, entriesVersion, programDateMap]);

  const handleAddExercise = useCallback(() => {
    modalRef.current?.open(selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <StreakBadge />
      </View>

      <CalendarMonth
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={(d) => setSelectedDate(d)}
        onMonthChange={loadMarked}
      />

      <DayDetail dateStr={selectedDate} onAddSet={handleAddExercise} />

      <AddExerciseModal ref={modalRef} onSaved={bumpEntriesVersion} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { ...typography.h1 },
});
