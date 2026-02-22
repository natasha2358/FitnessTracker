import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity,
} from 'react-native';
import { PROGRAM, ProgramDay, getDayColor } from '../constants/program';
import { colors, spacing, typography, radius } from '../constants/theme';
import { WorkoutSessionModal, WorkoutSessionModalRef } from '../components/WorkoutSessionModal';

export function ProgramScreen() {
  const sessionModalRef = useRef<WorkoutSessionModalRef>(null);

  const renderDay = ({ item }: { item: ProgramDay }) => {
    const color = getDayColor(item.title);
    return (
      <TouchableOpacity
        style={styles.dayCard}
        onPress={() => sessionModalRef.current?.open(item)}
        activeOpacity={0.75}
      >
        <View style={[styles.dayNumberBox, { backgroundColor: color + '22', borderRightColor: colors.border }]}>
          <Text style={[styles.dayNumber, { color }]}>{item.day}</Text>
        </View>
        <View style={styles.dayInfo}>
          <Text style={styles.dayLabel}>DAY {item.day}</Text>
          <Text style={styles.dayTitle}>{item.title}</Text>
          <Text style={styles.exerciseCount}>{item.exercises.length} exercises</Text>
        </View>
        <View style={[styles.accentBar, { backgroundColor: color }]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>30-Day Program</Text>
        <Text style={styles.subtitle}>Tap a day to log your workout</Text>
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
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.caption, marginTop: 2 },
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
  dayNumberBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  dayNumber: { fontSize: 22, fontWeight: '800' },
  dayInfo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dayLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  dayTitle: { ...typography.bodyMed, marginTop: 1 },
  exerciseCount: { ...typography.caption, marginTop: 2 },
  accentBar: { width: 4, alignSelf: 'stretch' },
});
