import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, font, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function MetaRow({
  icon, text, color, dense,
}: {
  icon: IoniconName;
  text: string;
  color?: string;
  dense?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.row, dense && { marginBottom: 2 }]}>
      <View style={[styles.iconChip, color ? { backgroundColor: color + '22' } : null]}>
        <Ionicons name={icon} size={13} color={color || colors.primary} />
      </View>
      <Text style={styles.text} numberOfLines={2}>{text}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs + 2 },
    iconChip: {
      width: 24, height: 24, borderRadius: radius.sm,
      backgroundColor: colors.primaryFaded,
      alignItems: 'center', justifyContent: 'center',
      marginRight: spacing.sm,
    },
    text: { fontSize: font.size.sm, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  });
}
