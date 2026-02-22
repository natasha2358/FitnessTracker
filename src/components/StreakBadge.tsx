import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStreakDays } from '../db/logEntries';
import { useStore } from '../store/useStore';
import { colors, spacing, typography, radius } from '../constants/theme';

export function StreakBadge() {
  const [streak, setStreak] = useState(0);
  const version = useStore((s) => s.entriesVersion);
  useEffect(() => { getStreakDays().then(setStreak); }, [version]);
  if (streak === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, gap: 4 },
  fire: { fontSize: 16 },
  count: { ...typography.bodyMed, color: colors.accent },
});
