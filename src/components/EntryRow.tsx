import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { LogEntry, addEntry, deleteEntry, getPersonalRecord } from '../db/logEntries';
import { getExerciseById } from '../db/exercises';
import { getExerciseColor, getExerciseEmoji } from '../constants/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';

interface Props {
  entry: LogEntry;
  setCount?: number;
  onDuplicated?: () => void;
  onDeleted?: () => void;
  onEdit?: (entry: LogEntry) => void;
}

export function EntryRow({ entry, setCount, onDuplicated, onDeleted, onEdit }: Props) {
  const [exerciseName, setExerciseName] = useState(entry.exerciseName ?? '');
  const [category, setCategory] = useState('Other');
  const [isPR, setIsPR] = useState(false);

  useEffect(() => {
    // If name is already stored on the entry, use it directly
    if (entry.exerciseName) {
      setExerciseName(entry.exerciseName);
    } else {
      getExerciseById(entry.exerciseId).then((ex) => {
        if (ex) {
          setExerciseName(ex.name);
          setCategory(ex.category);
        }
      });
    }
    getPersonalRecord(entry.exerciseId).then((pr) => {
      if (pr && entry.weight >= pr.weight) setIsPR(true);
    });
  }, [entry.exerciseId, entry.exerciseName, entry.weight]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      'Delete Entry',
      `Remove ${exerciseName} (${entry.weight} ${entry.unit})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteEntry(entry.id);
            onDeleted?.();
          },
        },
      ]
    );
  }, [entry, exerciseName, onDeleted]);

  const handleDuplicate = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addEntry({
      dateTime: Date.now(),
      exerciseId: entry.exerciseId,
      exerciseName: entry.exerciseName,
      weight: entry.weight,
      unit: entry.unit,
      note: entry.note,
    });
    onDuplicated?.();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [entry, onDuplicated]);

  const timeStr = new Date(entry.dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  const color = getExerciseColor(category);
  const emoji = getExerciseEmoji(category);
  const isPilates = category === 'Pilates' || entry.exerciseName?.toLowerCase().includes('pilates');

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
      <Text style={styles.actionEmoji}>🗑️</Text>
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderLeftActions = () => (
    <TouchableOpacity style={styles.duplicateAction} onPress={handleDuplicate}>
      <Text style={styles.actionEmoji}>📋</Text>
      <Text style={styles.actionText}>Duplicate</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
    >
      <TouchableOpacity style={styles.row} onPress={() => onEdit?.(entry)} activeOpacity={0.7}>
        <View style={[styles.thumb, { backgroundColor: color + '33' }]}>
          <Text style={styles.thumbEmoji}>{emoji}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{exerciseName || entry.exerciseId}</Text>
            {isPR && !isPilates && <Text style={styles.prBadge}>🏆 PR</Text>}
          </View>
          <Text style={styles.time}>
            {timeStr}
            {setCount && setCount > 1 ? `  ·  ${setCount} sets` : ''}
            {entry.note ? `  ·  ${entry.note}` : ''}
          </Text>
        </View>
        <View style={styles.right}>
          {isPilates ? (
            <View style={[styles.weightBadge, { borderColor: '#E91E8C55' }]}>
              <Text style={[styles.weight, { color: '#E91E8C', fontSize: 13 }]}>🧘</Text>
            </View>
          ) : (
            <View style={[styles.weightBadge, { borderColor: color + '55' }]}>
              <Text style={[styles.weight, { color }]}>{entry.weight}</Text>
              <Text style={styles.unit}>{entry.unit}</Text>
            </View>
          )}
          <Text style={styles.editHint}>tap to edit</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.bg,
  },
  thumb: {
    width: 44, height: 44,
    borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 22 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  name: { ...typography.bodyMed, flex: 1 },
  prBadge: { fontSize: 11, color: '#FFD700' },
  time: { ...typography.caption, marginTop: 2 },
  right: { alignItems: 'center', gap: 2 },
  weightBadge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    minWidth: 56,
  },
  weight: { ...typography.bodyMed, fontSize: 17 },
  unit: { ...typography.caption },
  editHint: { fontSize: 9, color: colors.textMuted },
  deleteAction: {
    backgroundColor: '#FF4444',
    justifyContent: 'center', alignItems: 'center',
    width: 80, gap: 4,
  },
  duplicateAction: {
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    width: 80, gap: 4,
  },
  actionEmoji: { fontSize: 20 },
  actionText: { ...typography.caption, color: colors.white, fontWeight: '600' },
});
