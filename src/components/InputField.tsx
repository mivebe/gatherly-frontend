import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, font, rgba } from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = TextInputProps & {
  label?: string;
  required?: boolean;
  icon?: IoniconName;
  rightIcon?: IoniconName;
  onRightIconPress?: () => void;
};

export default function InputField({
  label, required, icon, rightIcon, onRightIconPress,
  style, multiline, onFocus, onBlur, ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.wrap}>
      {label ? (
        <Text style={s.label}>
          {label}{required ? <Text style={{ color: colors.danger }}> *</Text> : ''}
        </Text>
      ) : null}
      <View
        style={[
          s.inputWrap,
          multiline && s.multiline,
          focused && { borderColor: colors.primary, backgroundColor: colors.surface,
                       shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? colors.primary : colors.textMuted}
            style={{ marginRight: spacing.sm }}
          />
        ) : null}
        <TextInput
          style={[s.input, multiline && { textAlignVertical: 'top' }, style]}
          placeholderTextColor={rgba(colors.textMuted, 0.85)}
          multiline={multiline}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
        {rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:  { marginBottom: spacing.md },
  label: {
    fontSize: font.size.sm,
    fontWeight: font.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: spacing.sm + 2 },
  input: {
    flex: 1,
    fontSize: font.size.md,
    color: colors.text,
    paddingVertical: spacing.sm + 4,
  },
});
