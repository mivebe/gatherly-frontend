import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, spacing, font } from '../theme';

type Props = TextInputProps & { label?: string; required?: boolean };

export default function InputField({ label, required, style, ...rest }: Props) {
  return (
    <View style={s.wrap}>
      {label ? (
        <Text style={s.label}>
          {label}{required ? <Text style={{ color: colors.danger }}> *</Text> : ''}
        </Text>
      ) : null}
      <TextInput
        style={[s.input, style]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: font.size.sm, fontWeight: font.medium, color: colors.textSecondary, marginBottom: spacing.xs + 2 },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: font.size.md,
    color: colors.textPrimary,
  },
});
