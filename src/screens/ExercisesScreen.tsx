import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../constants/theme';
import { ExerciseGrid } from '../components/ExerciseGrid';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ExercisesStackParamList } from '../navigation/ExercisesStack';

type Nav = StackNavigationProp<ExercisesStackParamList, 'ExercisesList'>;

export function ExercisesScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.container}>
      <ExerciseGrid onPressExercise={(id) => navigation.navigate('ExerciseDetail', { exerciseId: id })} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg } });
