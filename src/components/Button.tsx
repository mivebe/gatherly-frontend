import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, font, depth } from '../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: IoniconName;
  style?: ViewStyle;
};

const sizes: Record<Size, { padV: number; padH: number; font: number; iconSize: number }> = {
  sm: { padV: spacing.sm,        padH: spacing.md,       font: font.size.sm, iconSize: 16 },
  md: { padV: spacing.md - 2,    padH: spacing.lg,       font: font.size.md, iconSize: 18 },
  lg: { padV: spacing.md + 2,    padH: spacing.xl,       font: font.size.lg, iconSize: 20 },
};

const tone = (v: Variant) => {
  switch (v) {
    case 'primary':   return { bg: colors.primary,    fg: colors.textOnPrimary, border: 'transparent' };
    case 'secondary': return { bg: colors.secondary,  fg: '#FFFFFF',            border: 'transparent' };
    case 'danger':    return { bg: colors.danger,     fg: '#FFFFFF',            border: 'transparent' };
    case 'outline':   return { bg: 'transparent',     fg: colors.primary,       border: colors.primary };
    case 'ghost':     return { bg: 'transparent',     fg: colors.text,          border: 'transparent' };
  }
};

export default function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, icon, style,
}: Props) {
  const t = tone(variant);
  const sz = sizes[size];
  const isFlat = variant === 'outline' || variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        s.base,
        { paddingVertical: sz.padV, paddingHorizontal: sz.padH,
          backgroundColor: t.bg, borderColor: t.border,
          borderWidth: variant === 'outline' ? 1.5 : 0 },
        !isFlat && depth.level1,
        (loading || disabled) && { opacity: 0.55 },
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={t.fg} />
      ) : (
        <View style={s.row}>
          {icon ? <Ionicons name={icon} size={sz.iconSize} color={t.fg} style={{ marginRight: spacing.sm - 2 }} /> : null}
          <Text style={[s.label, { color: t.fg, fontSize: sz.font }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base:  { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  row:   { flexDirection: 'row', alignItems: 'center' },
  label: { fontWeight: font.semibold, letterSpacing: 0.2 },
});
