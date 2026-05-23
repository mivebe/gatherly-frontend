import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

/**
 * Визуална лента за запълненост на капацитета.
 * Показва „свободни / общо" с цветна индикация.
 */
export default function CapacityBar({ available, capacity }: { available: number; capacity: number }) {
  const taken = capacity - available;
  const pct = capacity > 0 ? taken / capacity : 0;
  const barColor = pct >= 1 ? colors.danger : pct >= 0.8 ? colors.warning : colors.success;

  return (
    <View style={s.wrap}>
      <View style={s.track}>
        <View style={[s.fill, { width: `${Math.min(pct * 100, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={[s.label, { color: barColor }]}>
        {available > 0 ? `${available} свободни от ${capacity}` : 'Запълнено'}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: spacing.sm },
  track: { height: 6, backgroundColor: colors.borderLight, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.full },
  label: { fontSize: font.size.xs, fontWeight: font.semibold, marginTop: spacing.xs },
});
