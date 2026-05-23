import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, font, rgba } from '../theme';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'muted' | 'info';

const variantColors: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.primaryFaded, text: colors.primary,  border: rgba(colors.primary, 0.25) },
  success: { bg: colors.successFaded, text: colors.success,  border: rgba(colors.success, 0.25) },
  warning: { bg: colors.warningFaded, text: colors.warning,  border: rgba(colors.warning, 0.25) },
  danger:  { bg: colors.dangerFaded,  text: colors.danger,   border: rgba(colors.danger, 0.25) },
  info:    { bg: colors.infoFaded,    text: colors.info,     border: rgba(colors.info, 0.25) },
  muted:   { bg: colors.borderLight,  text: colors.textMuted, border: colors.border },
};

export default function Badge({ label, variant = 'primary' }: { label: string; variant?: Variant }) {
  const c = variantColors[variant];
  return (
    <View style={[s.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[s.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: font.size.xs, fontWeight: font.semibold, letterSpacing: 0.3 },
});
