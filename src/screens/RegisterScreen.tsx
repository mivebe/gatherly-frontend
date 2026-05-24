import React, { useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, rgba, ThemeColors } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Role = 'user' | 'organizer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PW_MIN = 6;

type Errors = {
  full_name?: string;
  email?: string;
  password?: string;
  form?: string;
};

function validate(name: string, email: string, password: string): Errors {
  const errs: Errors = {};
  const trimmedName = name.trim();
  if (!trimmedName) errs.full_name = 'Името е задължително.';
  else if (trimmedName.length < 2) errs.full_name = 'Името трябва да е поне 2 символа.';

  const trimmedEmail = email.trim();
  if (!trimmedEmail) errs.email = 'Имейлът е задължителен.';
  else if (!EMAIL_RE.test(trimmedEmail)) errs.email = 'Невалиден формат на имейл.';

  if (!password) errs.password = 'Паролата е задължителна.';
  else if (password.length < PW_MIN) errs.password = `Паролата трябва да е поне ${PW_MIN} символа.`;

  return errs;
}

export default function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { register } = useAuth();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<Role>('user');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const s = useMemo(() => createStyles(colors), [colors]);

  const submit = async () => {
    setSubmitted(true);
    const e = validate(full_name, email, password);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await register({ full_name: full_name.trim(), email: email.trim(), password, role });
    } catch (e: any) {
      const msg = e?.message || '';
      if (/exist|already|EMAIL/i.test(msg)) {
        setErrors({ email: 'Този имейл вече е регистриран.' });
      } else {
        setErrors({ form: msg || 'Възникна грешка при регистрация.' });
      }
    }
    finally { setBusy(false); }
  };

  const revalidate = (next: Partial<{ full_name: string; email: string; password: string }>) => {
    if (!submitted) return;
    setErrors(validate(
      next.full_name ?? full_name,
      next.email ?? email,
      next.password ?? password,
    ));
  };

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={s.header}>
          <Text style={s.title}>Създайте акаунт</Text>
          <Text style={s.subtitle}>Попълнете данните за регистрация</Text>
        </View>

        <View style={s.card}>
          {errors.form ? (
            <View style={s.banner}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={s.bannerText}>{errors.form}</Text>
            </View>
          ) : null}

          <InputField
            label="Пълно име" icon="person-outline" required
            value={full_name}
            onChangeText={(v) => { setName(v); revalidate({ full_name: v }); }}
            placeholder="Иван Иванов"
            error={submitted ? errors.full_name : undefined}
          />
          <InputField
            label="Имейл" icon="mail-outline" required
            value={email}
            onChangeText={(v) => { setEmail(v); revalidate({ email: v }); }}
            autoCapitalize="none" autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
            error={submitted ? errors.email : undefined}
          />
          <InputField
            label="Парола" icon="lock-closed-outline" required
            rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPw(v => !v)}
            value={password}
            onChangeText={(v) => { setPassword(v); revalidate({ password: v }); }}
            secureTextEntry={!showPw} placeholder={`Мин. ${PW_MIN} символа`}
            error={submitted ? errors.password : undefined}
            hint={submitted ? undefined : `Поне ${PW_MIN} символа`}
          />

          <Text style={s.roleTitle}>Тип акаунт</Text>
          <View style={s.roleRow}>
            <RoleCard r="user"      active={role === 'user'}      onSelect={setRole}
              icon="person-outline"    label="Потребител"  desc="Резервирайте за събития" />
            <RoleCard r="organizer" active={role === 'organizer'} onSelect={setRole}
              icon="briefcase-outline" label="Организатор" desc="Създавайте свои събития" />
          </View>

          <Button label="Създай акаунт" onPress={submit} loading={busy} size="lg" style={{ marginTop: spacing.lg }} />
        </View>

        <TouchableOpacity style={s.footerLink} onPress={() => navigation.goBack()}>
          <Text style={s.footerText}>
            Вече имате акаунт?{' '}
            <Text style={s.footerCta}>Влезте</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RoleCard({
  r, active, onSelect, icon, label, desc,
}: {
  r: Role;
  active: boolean;
  onSelect: (r: Role) => void;
  icon: IoniconName;
  label: string;
  desc: string;
}) {
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={[
        s.roleCard,
        active
          ? { borderColor: colors.primary, backgroundColor: rgba(colors.primary, 0.06) }
          : { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
      onPress={() => onSelect(r)}
      activeOpacity={0.85}
    >
      <View style={[s.roleIconBox, active && { backgroundColor: colors.primary }]}>
        <Ionicons name={icon} size={20} color={active ? colors.textOnPrimary : colors.textSecondary} />
      </View>
      <Text style={[s.roleLabel, active && { color: colors.primary }]}>{label}</Text>
      <Text style={s.roleDesc} numberOfLines={2}>{desc}</Text>
    </TouchableOpacity>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap:   { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl },
    back:   { width: 40, height: 40, justifyContent: 'center', marginBottom: spacing.sm },

    header:   { marginBottom: spacing.lg, paddingHorizontal: spacing.sm },
    title:    { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.text },
    subtitle: { fontSize: font.size.sm, color: colors.textMuted, marginTop: 4 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level2,
    },

    banner: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      backgroundColor: rgba(colors.danger, 0.10),
      borderColor: rgba(colors.danger, 0.30), borderWidth: 1,
      borderRadius: radius.md, padding: spacing.sm + 2,
      marginBottom: spacing.md,
    },
    bannerText: { color: colors.danger, fontSize: font.size.sm, fontWeight: font.medium, flex: 1 },

    roleTitle: { fontSize: font.size.sm, fontWeight: font.medium, color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.xs },
    roleRow:   { flexDirection: 'row', gap: spacing.sm },
    roleCard:  {
      flex: 1, borderWidth: 1.5, borderRadius: radius.md,
      padding: spacing.md, alignItems: 'flex-start',
    },
    roleIconBox: {
      width: 36, height: 36, borderRadius: radius.sm,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    roleLabel: { fontSize: font.size.md, fontWeight: font.semibold, color: colors.text },
    roleDesc:  { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },

    footerLink: { marginTop: spacing.lg, alignItems: 'center' },
    footerText: { color: colors.textSecondary, fontSize: font.size.md },
    footerCta:  { color: colors.primary, fontWeight: font.semibold },
  });
}
