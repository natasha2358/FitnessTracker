import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../db/exercises';
import { getExerciseColor, getExerciseEmoji } from '../constants/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';

interface Props {
  exercise: Exercise;
  onPress: () => void;
}

export function ExerciseCard({ exercise, onPress }: Props) {
  const color = getExerciseColor(exercise.category);
  const emoji = getExerciseEmoji(exercise.category);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.accent, { backgroundColor: color }]} />
      <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.name} numberOfLines={1}>{exercise.name}</Text>
        <Text style={[styles.category, { color }]}>{exercise.category}</Text>
      </View>
      {exercise.isFavorite && <Text style={styles.star}>⭐</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    height: 64,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  iconBox: {
    width: 56,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  textBlock: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    gap: 2,
  },
  name: { ...typography.bodyMed, fontSize: 14 },
  category: { fontSize: 11, fontWeight: '600' },
  star: { paddingRight: spacing.sm, fontSize: 14 },
});
