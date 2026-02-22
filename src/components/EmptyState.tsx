import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface Props { message: string; }

export function EmptyState({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏋️</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, marginTop: spacing.xxl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
