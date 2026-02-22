import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { PROGRAM, ProgramDay, getDayColor } from '../constants/program';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useStore } from '../store/useStore';

export interface ProgramDayPickerModalRef {
  open: () => void;
}

interface Props {
  onSelect: (day: ProgramDay) => void;
}

export const ProgramDayPickerModal = forwardRef<ProgramDayPickerModalRef, Props>(
  ({ onSelect }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const completedProgramDays = useStore((s) => s.completedProgramDays);

    useImperativeHandle(ref, () => ({
      open() {
        sheetRef.current?.present();
      },
    }));

    const handleSelect = (day: ProgramDay) => {
      sheetRef.current?.dismiss();
      onSelect(day);
    };

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={['85%']}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Program Day</Text>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.list}>
          {PROGRAM.map((day) => {
            const color = getDayColor(day.title);
            const done = completedProgramDays.includes(day.day);
            return (
              <TouchableOpacity
                key={day.day}
                style={[styles.dayCard, done && styles.dayCardDone]}
                onPress={() => handleSelect(day)}
                activeOpacity={0.75}
              >
                <View style={[styles.dayNumberBox, { backgroundColor: color + '22' }]}>
                  <Text style={[styles.dayNumber, { color: done ? colors.textMuted : color }]}>
                    {day.day}
                  </Text>
                  {done && <Text style={styles.doneCheck}>✓</Text>}
                </View>
                <View style={styles.dayInfo}>
                  <Text style={[styles.dayLabel, done && styles.textDone]}>DAY {day.day}</Text>
                  <Text style={[styles.dayTitle, done && styles.textDone]}>{day.title}</Text>
                  <Text style={styles.exerciseCount}>{day.exercises.length} exercises</Text>
                </View>
                <View style={[styles.accentBar, { backgroundColor: done ? colors.border : color }]} />
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.surface },
  handle: { backgroundColor: colors.border },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { ...typography.h2 },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
    gap: spacing.sm,
  },
  dayCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardDone: {
    opacity: 0.55,
  },
  dayNumberBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  dayNumber: { fontSize: 20, fontWeight: '800' },
  doneCheck: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  dayInfo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dayLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  dayTitle: { ...typography.bodyMed, marginTop: 1 },
  textDone: { color: colors.textMuted },
  exerciseCount: { ...typography.caption, marginTop: 2 },
  accentBar: { width: 4, alignSelf: 'stretch' },
});
