import React from 'react';
import { Calendar } from 'react-native-calendars';
import { colors } from '../constants/theme';

interface Props {
  selectedDate: string;
  markedDates: Record<string, any>;
  onDayPress: (dateStr: string) => void;
  onMonthChange: (year: number, month: number) => void;
}

export function CalendarMonth({ selectedDate, markedDates, onDayPress, onMonthChange }: Props) {
  return (
    <Calendar
      current={selectedDate}
      markedDates={markedDates}
      onDayPress={(day) => onDayPress(day.dateString)}
      onMonthChange={(month) => onMonthChange(month.year, month.month - 1)}
      theme={{
        backgroundColor: colors.bg,
        calendarBackground: colors.bg,
        textSectionTitleColor: colors.textSub,
        selectedDayBackgroundColor: colors.primary,
        selectedDayTextColor: colors.white,
        todayTextColor: colors.primaryLight,
        dayTextColor: colors.text,
        textDisabledColor: colors.textMuted,
        dotColor: colors.primary,
        selectedDotColor: colors.white,
        arrowColor: colors.primary,
        monthTextColor: colors.text,
        textDayFontWeight: '500',
        textMonthFontWeight: '700',
      }}
    />
  );
}
