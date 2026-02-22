import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ExercisesScreen } from '../screens/ExercisesScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { colors } from '../constants/theme';

export type ExercisesStackParamList = {
  ExercisesList: undefined;
  ExerciseDetail: { exerciseId: string };
};

const Stack = createStackNavigator<ExercisesStackParamList>();

export function ExercisesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bg }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: '700' }, headerShadowVisible: false }}>
      <Stack.Screen name="ExercisesList" component={ExercisesScreen} options={{ title: 'Exercises' }} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
