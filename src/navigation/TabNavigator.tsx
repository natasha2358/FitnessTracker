import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TodayScreen } from '../screens/TodayScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ExercisesStack } from './ExercisesStack';
import { ProgramScreen } from '../screens/ProgramScreen';
import { colors } from '../constants/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Today:     '⚡',
    Calendar:  '📅',
    Program:   '📋',
    Exercises: '🏋️',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={styles.iconEmoji}>{icons[label]}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'android'
    ? Math.max(insets.bottom + 8, 24)
    : Math.max(insets.bottom, 16);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 52 + bottomPad,
          paddingBottom: bottomPad,
          paddingTop: 8,
          paddingHorizontal: 4,
        },
      }}
    >
      <Tab.Screen name="Today"     component={TodayScreen}    options={{ tabBarIcon: ({ focused }) => <TabIcon label="Today"     focused={focused} /> }} />
      <Tab.Screen name="Calendar"  component={CalendarScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Calendar"  focused={focused} /> }} />
      <Tab.Screen name="Program"   component={ProgramScreen}  options={{ tabBarIcon: ({ focused }) => <TabIcon label="Program"   focused={focused} /> }} />
      <Tab.Screen name="Exercises" component={ExercisesStack} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Exercises" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    gap: 3,
  },
  iconEmoji: { fontSize: 22, lineHeight: 26 },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
    includeFontPadding: false,
  },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },
});
