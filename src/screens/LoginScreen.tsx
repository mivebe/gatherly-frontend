import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, rgba, ThemeColors } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = {
  email?: string;
  password?: string;
  form?: string;
};

function validate(email: string, password: string): Errors {
  const errs: Errors = {};
  const trimmed = email.trim();
  if (!trimmed) errs.email = 'Имейлът е задължителен.';
  else if (!EMAIL_RE.test(trimmed)) errs.email = 'Невалиден формат на имейл.';
  if (!password) errs.password = 'Паролата е задължителна.';
  return errs;
}

export default function LoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('user@demo.bg');
  const [password, setPassword] = useState('demo1234');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const s = useMemo(() => createStyles(colors), [colors]);

  const submit = async () => {
    setSubmitted(true);
    const e = validate(email, password);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      const msg = e?.message || '';
      if (/credential|password|email|UNAUTHORIZED|INVALID/i.test(msg)) {
        setErrors({ form: 'Невалиден имейл или парола.' });
      } else {
        setErrors({ form: msg || 'Възникна грешка при вход. Опитайте отново.' });
      }
    } finally { setBusy(false); }
  };

  const onChangeEmail = (v: string) => {
    setEmail(v);
    if (submitted) setErrors(validate(v, password));
  };
  const onChangePassword = (v: string) => {
    setPassword(v);
    if (submitted) setErrors(validate(email, v));
  };

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.brandWrap}>
          <View style={s.logoCircle}>
            <Ionicons name="ticket" size={36} color={colors.textOnPrimary} />
          </View>
          <Text style={s.brand}>Gatherly</Text>
          <Text style={s.tagline}>Резервации и събития в едно приложение</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Добре дошли</Text>
          <Text style={s.cardSub}>Влезте в акаунта си, за да продължите</Text>

          {errors.form ? (
            <View style={s.banner}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={s.bannerText}>{errors.form}</Text>
            </View>
          ) : null}

          <InputField
            label="Имейл" icon="mail-outline" required
            value={email} onChangeText={onChangeEmail}
            autoCapitalize="none" autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
            error={submitted ? errors.email : undefined}
          />
          <InputField
            label="Парола" icon="lock-closed-outline" required
            rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPw(v => !v)}
            value={password} onChangeText={onChangePassword}
            secureTextEntry={!showPw}
            placeholder="Въведете парола"
            error={submitted ? errors.password : undefined}
          />

          <Button label="Влез" onPress={submit} loading={busy} size="lg" style={{ marginTop: spacing.sm }} />
        </View>

        <TouchableOpacity style={s.footerLink} onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text style={s.footerText}>
            Нямате акаунт?{' '}
            <Text style={s.footerCta}>Регистрирайте се</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap:   { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },

    brandWrap: { alignItems: 'center', marginBottom: spacing.xl },
    logoCircle: {
      width: 80, height: 80, borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: spacing.md,
      ...depth.level3,
      shadowColor: colors.primary, shadowOpacity: 0.35,
    },
    brand:   { fontSize: font.size.hero, fontWeight: font.bold, color: colors.text, letterSpacing: -0.8 },
    tagline: { fontSize: font.size.sm, color: colors.textMuted, marginTop: spacing.xs + 2, textAlign: 'center' },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level2,
    },
    cardTitle: { fontSize: font.size.xl, fontWeight: font.bold, color: colors.text },
    cardSub:   { fontSize: font.size.sm, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },

    banner: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      backgroundColor: rgba(colors.danger, 0.10),
      borderColor: rgba(colors.danger, 0.30), borderWidth: 1,
      borderRadius: radius.md, padding: spacing.sm + 2,
      marginBottom: spacing.md,
    },
    bannerText: { color: colors.danger, fontSize: font.size.sm, fontWeight: font.medium, flex: 1 },

    footerLink: { marginTop: spacing.lg, alignItems: 'center' },
    footerText: { color: colors.textSecondary, fontSize: font.size.md },
    footerCta:  { color: colors.primary, fontWeight: font.semibold },
  });
}
