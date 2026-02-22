import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
import { useExercises } from '../hooks/useExercises';
import { ExerciseCard } from './ExerciseCard';
import { CategoryFilter } from './CategoryFilter';
import { colors, spacing, typography, radius } from '../constants/theme';
import { ExerciseCategory } from '../constants/exercises';

interface Props {
  onPressExercise: (id: string) => void;
}

const CATEGORIES: (ExerciseCategory | 'All')[] = [
  'All', 'Push', 'Pull', 'Legs', 'Core', 'Pilates', 'Other',
];

export function ExerciseGrid({ onPressExercise }: Props) {
  const { exercises } = useExercises();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | 'All'>('All');

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchCat = activeCategory === 'All' || ex.category === activeCategory;
      const matchQ = ex.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [exercises, query, activeCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Search..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View style={styles.filterWrapper}>
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={() => onPressExercise(item.id)} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No exercises found.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  filterWrapper: { overflow: 'visible' },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: 120 },
  separator: { height: 8 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
