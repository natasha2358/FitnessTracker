import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { ExerciseCategory, getExerciseColor } from '../constants/exercises';

type Category = ExerciseCategory | 'All';

interface Props {
  categories: Category[];
  active: Category;
  onSelect: (cat: Category) => void;
}

export function CategoryFilter({ categories, active, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isActive = active === cat;
        const color = cat === 'All' ? colors.primary : getExerciseColor(cat);
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isActive && { backgroundColor: color, borderColor: color }]}
            onPress={() => onSelect(cat)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSub,
  },
  chipTextActive: {
    color: colors.white,
  },
});
