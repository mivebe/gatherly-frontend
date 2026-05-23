import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, font, rgba, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={styles.label}>
          {label}{required ? <Text style={{ color: colors.danger }}> *</Text> : ''}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          multiline && styles.multiline,
          focused && { borderColor: colors.primary, backgroundColor: colors.surface,
                       shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={18}
            color={focused ? colors.primary : colors.textMuted}
            style={{ marginRight: spacing.sm }} />
        ) : null}
        <TextInput
          style={[styles.input, multiline && { textAlignVertical: 'top' }, style]}
          placeholderTextColor={rgba(colors.textMuted.startsWith('#') ? colors.textMuted : '#94A3B8', 0.85)}
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap:  { marginBottom: spacing.md },
    label: { fontSize: font.size.sm, fontWeight: font.medium, color: colors.textSecondary, marginBottom: spacing.xs + 2 },
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
}
