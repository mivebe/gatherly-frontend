import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, font } from '../theme';

/** Секционно заглавие – uppercase, малък шрифт, spacing (bekar стил) */
export default function SectionHeader({ title }: { title: string }) {
  return <Text style={s.text}>{title}</Text>;
}

const s = StyleSheet.create({
  text: {
    fontSize: font.size.xs,
    fontWeight: font.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm + 4,
    marginTop: spacing.sm,
  },
});
