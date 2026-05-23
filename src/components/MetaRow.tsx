import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, font } from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/** Ред с иконка + текст, за метаданни в карти и детайли. */
export default function MetaRow({ icon, text, color }: { icon: IoniconName; text: string; color?: string }) {
  return (
    <View style={s.row}>
      <Ionicons name={icon} size={15} color={color || colors.textSecondary} style={s.icon} />
      <Text style={[s.text, color ? { color } : null]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  icon: { marginRight: spacing.sm - 2 },
  text: { fontSize: font.size.sm, color: colors.textSecondary, flex: 1 },
});
