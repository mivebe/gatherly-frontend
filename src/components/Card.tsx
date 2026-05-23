import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, depth } from '../theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  /** Цветен ляв акцент (bekar стил). */
  accentColor?: string;
  /** Дълбочина на сянката (0–4). */
  level?: 0 | 1 | 2 | 3 | 4;
  /** По-плоско padding/малки карти. */
  compact?: boolean;
};

const levels = [depth.level0, depth.level1, depth.level2, depth.level3, depth.level4];

export default function Card({
  children, onPress, style, disabled, accentColor, level = 2, compact,
}: Props) {
  const inner = (
    <>
      {accentColor ? <View style={[s.accent, { backgroundColor: accentColor }]} /> : null}
      <View style={[compact ? s.contentCompact : s.content]}>{children}</View>
    </>
  );

  const wrapperStyle = [
    s.card,
    levels[level],
    accentColor ? s.cardWithAccent : null,
    style,
    disabled && { opacity: 0.45 },
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={wrapperStyle} onPress={onPress} activeOpacity={0.85}>
        {inner}
      </TouchableOpacity>
    );
  }
  return <View style={wrapperStyle}>{inner}</View>;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md - 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardWithAccent: { flexDirection: 'row' },
  accent: { width: 4 },
  content:        { padding: spacing.md, flex: 1 },
  contentCompact: { padding: spacing.sm + 4, flex: 1 },
});
