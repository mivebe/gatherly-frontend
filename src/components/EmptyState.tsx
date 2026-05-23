import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, font } from '../theme';
import { useTheme } from '../context/ThemeContext';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function EmptyState({ icon, message }: { icon: IoniconName; message: string }) {
  const { colors } = useTheme();
  return (
    <View style={s.wrap}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={[s.text, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxxl + 20 },
  text: { fontSize: font.size.md, marginTop: spacing.md, textAlign: 'center' },
});
