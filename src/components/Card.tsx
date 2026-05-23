import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, depth } from '../theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  /** Ляв цветен акцент (bekar стил) */
  accentColor?: string;
  /** Ниво на дълбочина (0-4) */
  level?: 0 | 1 | 2 | 3 | 4;
};

const levels = [depth.level0, depth.level1, depth.level2, depth.level3, depth.level4];

export default function Card({ children, onPress, style, disabled, accentColor, level = 2 }: Props) {
  return (
    <TouchableOpacity
      style={[
        s.card,
        levels[level],
        accentColor ? { borderLeftWidth: 3, borderLeftColor: accentColor } : null,
        style,
        disabled && { opacity: 0.45 },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
  },
});
