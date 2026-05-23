import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { spacing, font } from '../theme';
import { useTheme } from '../context/ThemeContext';

/** Секционно заглавие – uppercase, малък шрифт, spacing. */
export default function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return <Text style={[s.text, { color: colors.textMuted }]}>{title}</Text>;
}

const s = StyleSheet.create({
  text: {
    fontSize: font.size.xs,
    fontWeight: font.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm + 4,
    marginTop: spacing.sm,
  },
});
