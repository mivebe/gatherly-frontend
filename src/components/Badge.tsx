import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, font, rgba, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'muted' | 'info' | 'secondary';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const variantColors = (colors: ThemeColors): Record<Variant, { bg: string; text: string }> => ({
  primary:   { bg: colors.primaryFaded,   text: colors.primary },
  secondary: { bg: colors.secondaryFaded, text: colors.secondary },
  success:   { bg: colors.successFaded,   text: colors.success },
  warning:   { bg: colors.warningFaded,   text: colors.warning },
  danger:    { bg: colors.dangerFaded,    text: colors.danger },
  info:      { bg: colors.infoFaded,      text: colors.info },
  muted:     { bg: colors.borderLight,    text: colors.textMuted },
});

export default function Badge({
  label, variant = 'primary', icon, soft = true,
}: {
  label: string;
  variant?: Variant;
  icon?: IoniconName;
  soft?: boolean;
}) {
  const { colors } = useTheme();
  const c  = variantColors(colors)[variant];
  const bg = soft ? c.bg : c.text;
  const fg = soft ? c.text : '#FFFFFF';

  return (
    <View style={[s.badge, { backgroundColor: bg, borderColor: soft ? rgba(c.text.startsWith('#') ? c.text : colors.primary, 0.18) : 'transparent' }]}>
      {icon ? <Ionicons name={icon} size={12} color={fg} style={{ marginRight: 4 }} /> : null}
      <Text style={[s.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: font.size.xs, fontWeight: font.semibold, letterSpacing: 0.3 },
});
