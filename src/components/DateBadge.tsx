import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, font, rgba } from '../theme';
import { useTheme } from '../context/ThemeContext';

export default function DateBadge({
  date, color, time,
}: {
  date: Date;
  color?: string;
  time?: boolean;
}) {
  const { colors } = useTheme();
  const c = color || colors.primary;
  const day   = date.getDate();
  const month = date.toLocaleString('bg-BG', { month: 'short' }).toUpperCase().replace('.', '');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins  = String(date.getMinutes()).padStart(2, '0');

  return (
    <View style={[s.wrap, { backgroundColor: rgba(c, 0.10), borderColor: rgba(c, 0.20) }]}>
      <Text style={[s.month, { color: c }]}>{month}</Text>
      <Text style={[s.day, { color: c }]}>{day}</Text>
      {time ? <Text style={[s.time, { color: colors.textMuted }]}>{hours}:{mins}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
  },
  month: { fontSize: 10, fontWeight: font.bold, letterSpacing: 1 },
  day:   { fontSize: 22, fontWeight: font.bold, lineHeight: 24, marginTop: 1 },
  time:  { fontSize: 10, marginTop: 2, fontWeight: font.medium },
});
