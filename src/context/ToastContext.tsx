import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';
import { radius, spacing, font, depth, ThemeColors } from '../theme';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type ToastOptions = {
  variant?: ToastVariant;
  durationMs?: number;
};

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
  durationMs: number;
};

type ToastContextValue = {
  show: (message: string, options?: ToastOptions) => void;
  info:    (message: string, options?: Omit<ToastOptions, 'variant'>) => void;
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => void;
  warning: (message: string, options?: Omit<ToastOptions, 'variant'>) => void;
  error:   (message: string, options?: Omit<ToastOptions, 'variant'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const counterRef = useRef(0);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    counterRef.current += 1;
    setToast({
      id: counterRef.current,
      message,
      variant: options.variant ?? 'info',
      durationMs: options.durationMs ?? DEFAULT_DURATION,
    });
  }, []);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    info:    (m, o) => show(m, { ...o, variant: 'info' }),
    success: (m, o) => show(m, { ...o, variant: 'success' }),
    warning: (m, o) => show(m, { ...o, variant: 'warning' }),
    error:   (m, o) => show(m, { ...o, variant: 'error' }),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost toast={toast} onHide={() => setToast(null)} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastHost({ toast, onHide }: { toast: Toast | null; onHide: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const hideRef = useRef(onHide);
  hideRef.current = onHide;

  useEffect(() => {
    if (!toast) return;
    const animateIn = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8, tension: 80 }),
    ]);
    animateIn.start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 180, useNativeDriver: true }),
      ]).start(() => hideRef.current());
    }, toast.durationMs);

    return () => {
      clearTimeout(timer);
      opacity.setValue(0);
      translateY.setValue(-20);
    };
  }, [toast, opacity, translateY]);

  if (!toast) return null;

  const v = variantStyles(colors)[toast.variant];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.host,
        { top: insets.top + spacing.sm, opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable
        onPress={() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -20, duration: 140, useNativeDriver: true }),
          ]).start(() => hideRef.current());
        }}
        style={[styles.toast, depth.level2, { backgroundColor: v.bg, borderColor: v.border }]}
      >
        <Ionicons name={v.icon} size={20} color={v.fg} style={{ marginRight: spacing.sm }} />
        <Text style={[styles.message, { color: v.fg }]} numberOfLines={3}>{toast.message}</Text>
      </Pressable>
    </Animated.View>
  );
}

function variantStyles(colors: ThemeColors): Record<ToastVariant, { bg: string; fg: string; border: string; icon: IoniconName }> {
  return {
    info:    { bg: colors.surface, fg: colors.text,    border: colors.border,       icon: 'information-circle' },
    success: { bg: colors.surface, fg: colors.success, border: colors.successFaded, icon: 'checkmark-circle' },
    warning: { bg: colors.surface, fg: colors.warning, border: colors.warningFaded, icon: 'alert-circle' },
    error:   { bg: colors.surface, fg: colors.danger,  border: colors.dangerFaded,  icon: 'close-circle' },
  };
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    maxWidth: 560,
    width: '100%',
  },
  message: {
    flex: 1,
    fontSize: font.size.md,
    fontWeight: font.medium,
    lineHeight: 20,
  },
});
