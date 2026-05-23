import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

type Variant = 'primary' | 'danger' | 'outline';

export default function Button({ label, onPress, variant = 'primary', loading, style }:
  { label: string; onPress: () => void; variant?: Variant; loading?: boolean; style?: ViewStyle }) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        s.base,
        isPrimary && { backgroundColor: colors.primary },
        isDanger  && { backgroundColor: colors.danger },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
        loading && { opacity: 0.7 },
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={isOutline ? colors.primary : '#fff'} />
        : <Text style={[s.label, isOutline && { color: colors.primary }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#fff', fontWeight: font.semibold, fontSize: font.size.md },
});
