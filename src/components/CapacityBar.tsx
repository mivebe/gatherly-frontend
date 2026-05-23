import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, font, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';

export default function CapacityBar({ available, capacity }: { available: number; capacity: number }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const taken = capacity - available;
  const pct = capacity > 0 ? taken / capacity : 0;
  const barColor =
    pct >= 1     ? colors.danger
    : pct >= 0.8 ? colors.warning
    : colors.success;

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(pct * 100, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.label, { color: barColor }]}>
        {available > 0 ? `${available} свободни от ${capacity}` : 'Запълнено'}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap:  { marginTop: spacing.sm },
    track: { height: 6, backgroundColor: colors.borderLight, borderRadius: radius.full, overflow: 'hidden' },
    fill:  { height: 6, borderRadius: radius.full },
    label: { fontSize: font.size.xs, fontWeight: font.semibold, marginTop: spacing.xs },
  });
}
