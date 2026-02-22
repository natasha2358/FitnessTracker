import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useExercises } from '../hooks/useExercises';
import { Exercise } from '../db/exercises';
import { getExerciseColor, getExerciseEmoji } from '../constants/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';

interface Props {
  onSelect: (exercise: Exercise) => void;
}

export function ExercisePicker({ onSelect }: Props) {
  const { exercises } = useExercises();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const results = q
      ? exercises.filter((e) => e.name.toLowerCase().includes(q))
      : exercises;
    return [
      ...results.filter((e) => e.isFavorite),
      ...results.filter((e) => !e.isFavorite),
    ];
  }, [exercises, query]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.search}
        placeholder="Search exercises..."
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const color = getExerciseColor(item.category);
          const emoji = getExerciseEmoji(item.category);
          return (
            <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
              <View style={[styles.thumb, { backgroundColor: color + '33' }]}>
                <Text style={styles.thumbEmoji}>{emoji}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={[styles.category, { color }]}>{item.category}</Text>
              </View>
              {item.isFavorite && <Text style={styles.star}>⭐</Text>}
            </TouchableOpacity>
          );
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: 22,
  },
  info: { flex: 1 },
  name: { ...typography.bodyMed },
  category: { ...typography.caption, fontWeight: '600' },
  star: { fontSize: 14 },
});
