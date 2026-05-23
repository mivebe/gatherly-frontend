import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { radius, spacing, depth, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  accentColor?: string;
  level?: 0 | 1 | 2 | 3 | 4;
  compact?: boolean;
};

const levels = [depth.level0, depth.level1, depth.level2, depth.level3, depth.level4];

export default function Card({
  children, onPress, style, disabled, accentColor, level = 2, compact,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const inner = (
    <>
      {accentColor ? <View style={[styles.accent, { backgroundColor: accentColor }]} /> : null}
      <View style={compact ? styles.contentCompact : styles.content}>{children}</View>
    </>
  );

  const wrapperStyle = [
    styles.card,
    levels[level],
    accentColor ? styles.cardWithAccent : null,
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: spacing.md - 2,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    cardWithAccent: { flexDirection: 'row' },
    accent:         { width: 4 },
    content:        { padding: spacing.md, flex: 1 },
    contentCompact: { padding: spacing.sm + 4, flex: 1 },
  });
}
