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
  error?: string | null;
  hint?: string;
};

export default function InputField({
  label, required, icon, rightIcon, onRightIconPress,
  error, hint,
  style, multiline, onFocus, onBlur, editable, ...rest
}: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const hasError = !!error;
  const borderColor = hasError
    ? colors.danger
    : focused ? colors.primary : colors.border;
  const iconColor = hasError
    ? colors.danger
    : focused ? colors.primary : colors.textMuted;

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
          { borderColor },
          focused && !hasError && {
            backgroundColor: colors.surface,
            shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 }, elevation: 2,
          },
          hasError && { backgroundColor: rgba(colors.danger, 0.04) },
          editable === false && { opacity: 0.6 },
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={18}
            color={iconColor}
            style={{ marginRight: spacing.sm }} />
        ) : null}
        <TextInput
          style={[styles.input, multiline && { textAlignVertical: 'top' }, style]}
          placeholderTextColor={rgba(colors.textMuted.startsWith('#') ? colors.textMuted : '#94A3B8', 0.85)}
          multiline={multiline}
          editable={editable}
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

      {hasError ? (
        <View style={styles.feedback}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={[styles.feedbackText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
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
    feedback: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
      marginTop: spacing.xs + 2,
    },
    feedbackText: { fontSize: font.size.xs, fontWeight: font.medium },
    hint: {
      fontSize: font.size.xs, color: colors.textMuted,
      marginTop: spacing.xs + 2,
    },
  });
}
