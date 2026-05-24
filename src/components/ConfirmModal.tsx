import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, font, depth, rgba, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  icon?: IoniconName;
  loading?: boolean;
};

export default function ConfirmModal({
  visible, onCancel, onConfirm,
  title, message,
  confirmLabel = 'Потвърди',
  cancelLabel  = 'Откажи',
  destructive,
  icon,
  loading,
}: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);
  const accent = destructive ? colors.danger : colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={s.backdrop} onPress={loading ? undefined : onCancel}>
        <Pressable style={s.cardWrap} onPress={() => {}}>
          <View style={s.card}>
            {icon ? (
              <View style={[s.iconWrap, { backgroundColor: rgba(accent, 0.12) }]}>
                <Ionicons name={icon} size={28} color={accent} />
              </View>
            ) : null}

            <Text style={s.title}>{title}</Text>
            {message ? <Text style={s.message}>{message}</Text> : null}

            <View style={s.actions}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={s.cancelBtn}
                  onPress={onCancel}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={s.cancelLabel}>{cancelLabel}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  label={confirmLabel}
                  onPress={onConfirm}
                  variant={destructive ? 'danger' : 'primary'}
                  loading={loading}
                  size="md"
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
      backgroundColor: colors.overlay,
      paddingHorizontal: spacing.lg,
    },
    cardWrap: { width: '100%', maxWidth: 380 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level4,
      alignItems: 'center',
    },
    iconWrap: {
      width: 56, height: 56, borderRadius: radius.full,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: font.size.xl, fontWeight: font.bold,
      color: colors.text, textAlign: 'center',
    },
    message: {
      fontSize: font.size.md, color: colors.textSecondary,
      textAlign: 'center', marginTop: spacing.sm,
      lineHeight: font.size.md * font.leading.normal,
    },
    actions: {
      flexDirection: 'row', gap: spacing.sm,
      marginTop: spacing.lg, width: '100%',
    },
    cancelBtn: {
      paddingVertical: spacing.md - 2,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    cancelLabel: {
      color: colors.text, fontWeight: font.semibold,
      fontSize: font.size.md, letterSpacing: 0.2,
    },
  });
}
