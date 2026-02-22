import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ExercisesStackParamList } from '../navigation/ExercisesStack';
import { getExerciseById, toggleFavorite, deleteExercise, Exercise } from '../db/exercises';
import { getHistoryForExercise, getLastUsedWeight, LogEntry } from '../db/logEntries';
import { getExerciseColor, getExerciseEmoji } from '../constants/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';
import { AddExerciseModal, AddExerciseModalRef } from '../components/AddExerciseModal';
import { useStore } from '../store/useStore';

type RouteT = RouteProp<ExercisesStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen() {
  const { params } = useRoute<RouteT>();
  const navigation = useNavigation();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [lastUsed, setLastUsed] = useState<{ weight: number; unit: string } | null>(null);
  const logModalRef = useRef<AddExerciseModalRef>(null);
  const bumpEntriesVersion = useStore((s) => s.bumpEntriesVersion);
  const bumpExercisesVersion = useStore((s) => s.bumpExercisesVersion);
  const today = new Date().toISOString().split('T')[0];

  const load = async () => {
    const [ex, hist, lu] = await Promise.all([
      getExerciseById(params.exerciseId),
      getHistoryForExercise(params.exerciseId),
      getLastUsedWeight(params.exerciseId),
    ]);
    setExercise(ex);
    setHistory(hist);
    setLastUsed(lu);
  };

  useEffect(() => { load(); }, []);

  const handleToggleFavorite = async () => {
    if (!exercise) return;
    await toggleFavorite(exercise.id, !exercise.isFavorite);
    bumpExercisesVersion();
    load();
  };

  const handleDelete = () => {
    if (!exercise) return;
    Alert.alert(
      'Delete Exercise',
      `Delete "${exercise.name}"? This will also delete all logged history for this exercise.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteExercise(exercise.id);
            bumpExercisesVersion();
            bumpEntriesVersion();
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!exercise) return null;

  const color = getExerciseColor(exercise.category);
  const emoji = getExerciseEmoji(exercise.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: color + '22' }]}>
          <Text style={styles.heroEmoji}>{emoji}</Text>
        </View>

        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <View style={[styles.categoryBadge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.categoryText, { color }]}>{exercise.category}</Text>
              </View>
              <Text style={styles.name}>{exercise.name}</Text>
            </View>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconBtn}>
              <Text style={styles.iconBtnText}>{exercise.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>

          {/* Last used */}
          {lastUsed && (
            <View style={styles.lastUsedCard}>
              <Text style={styles.lastUsedLabel}>LAST USED</Text>
              <Text style={styles.lastUsedWeight}>
                {lastUsed.weight}
                <Text style={styles.lastUsedUnit}> {lastUsed.unit}</Text>
              </Text>
            </View>
          )}

          {/* Log button */}
          <TouchableOpacity
            style={[styles.logButton, { backgroundColor: color }]}
            onPress={() => logModalRef.current?.open(today, exercise.id)}
          >
            <Text style={styles.logButtonText}>+ Log This Exercise</Text>
          </TouchableOpacity>

          {/* History */}
          <Text style={styles.sectionTitle}>History</Text>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>No sessions logged yet.</Text>
            </View>
          ) : (
            history.map((entry) => (
              <View key={entry.id} style={styles.historyRow}>
                <Text style={styles.historyDate}>
                  {new Date(entry.dateTime).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </Text>
                <View style={[styles.historyBadge, { backgroundColor: color + '22' }]}>
                  <Text style={[styles.historyWeight, { color }]}>
                    {entry.weight} {entry.unit}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <AddExerciseModal
        ref={logModalRef}
        onSaved={() => { bumpEntriesVersion(); load(); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 90 },
  content: { padding: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
  categoryText: { ...typography.label, textTransform: 'uppercase' },
  name: { ...typography.h2, marginTop: 2 },
  iconBtn: { padding: spacing.sm, marginTop: spacing.xs },
  iconBtnText: { fontSize: 24 },
  deleteIcon: { fontSize: 22 },
  lastUsedCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lastUsedLabel: { ...typography.label, color: colors.primary, marginBottom: spacing.xs },
  lastUsedWeight: { ...typography.h2 },
  lastUsedUnit: { ...typography.body, color: colors.textSub },
  logButton: { borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg },
  logButtonText: { ...typography.bodyMed, color: colors.white },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  emptyHistory: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyEmoji: { fontSize: 36, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: { ...typography.body, color: colors.textSub },
  historyBadge: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  historyWeight: { ...typography.bodyMed },
});
