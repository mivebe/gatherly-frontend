import React, { useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, rgba, ThemeColors } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { register } = useAuth();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [busy, setBusy] = useState(false);
  const s = useMemo(() => createStyles(colors), [colors]);

  const submit = async () => {
    setBusy(true);
    try { await register({ full_name, email, password, role }); }
    catch (e: any) { Alert.alert('Грешка', e.message); }
    finally { setBusy(false); }
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
          <InputField
            label="Пълно име" icon="person-outline" required
            value={full_name} onChangeText={setName}
            placeholder="Иван Иванов"
          />
          <InputField
            label="Имейл" icon="mail-outline" required
            value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address"
            placeholder="you@example.com"
          />
          <InputField
            label="Парола" icon="lock-closed-outline" required
            rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPw(v => !v)}
            value={password} onChangeText={setPassword}
            secureTextEntry={!showPw} placeholder="Мин. 6 символа"
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
  r: 'user' | 'organizer';
  active: boolean;
  onSelect: (r: 'user' | 'organizer') => void;
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
