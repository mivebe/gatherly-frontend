import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, font, rgba } from '../theme';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<Size, { box: number; font: number }> = {
  sm: { box: 32, font: font.size.sm },
  md: { box: 40, font: font.size.md },
  lg: { box: 56, font: font.size.lg },
  xl: { box: 96, font: font.size.hero },
};

export default function Avatar({
  name, size = 'md', color,
}: {
  name: string;
  size?: Size;
  color?: string;
}) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const sz = sizes[size];
  const bg = color || colors.primary;
  return (
    <View style={[
      s.wrap,
      { width: sz.box, height: sz.box, borderRadius: radius.full,
        backgroundColor: rgba(bg, 0.12), borderColor: rgba(bg, 0.3) },
    ]}>
      <Text style={[s.text, { fontSize: sz.font, color: bg }]}>{initials || '?'}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  text: { fontWeight: font.bold, letterSpacing: 0.5 },
});
