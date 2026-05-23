import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, font } from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/** Ред с иконка-чип + текст, за метаданни в карти и детайли. */
export default function MetaRow({
  icon, text, color, dense,
}: {
  icon: IoniconName;
  text: string;
  color?: string;
  dense?: boolean;
}) {
  return (
    <View style={[s.row, dense && { marginBottom: 2 }]}>
      <View style={[s.iconChip, color ? { backgroundColor: color + '22' } : null]}>
        <Ionicons name={icon} size={13} color={color || colors.primary} />
      </View>
      <Text style={s.text} numberOfLines={2}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs + 2 },
  iconChip: {
    width: 24, height: 24, borderRadius: radius.sm,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  text: { fontSize: font.size.sm, color: colors.textSecondary, flex: 1, lineHeight: 18 },
});
