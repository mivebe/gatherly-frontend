import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await register({ full_name, email, password, role }); }
    catch (e: any) { Alert.alert('Грешка', e.message); }
    finally { setBusy(false); }
  };

  const RoleBtn = ({ r, label, icon }: { r: 'user' | 'organizer'; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }) => {
    const active = role === r;
    return (
      <TouchableOpacity style={[s.roleBtn, active && s.roleBtnActive]} onPress={() => setRole(r)} activeOpacity={0.8}>
        <Ionicons name={icon} size={20} color={active ? '#fff' : colors.textSecondary} />
        <Text style={[s.roleLabel, active && s.roleLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Създайте акаунт</Text>
        <Text style={s.subtitle}>Попълнете данните за регистрация</Text>

        <InputField label="Пълно име" value={full_name} onChangeText={setName}
          placeholder="Иван Иванов" required />
        <InputField label="Имейл" value={email} onChangeText={setEmail}
          autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" required />
        <InputField label="Парола" value={password} onChangeText={setPassword}
          secureTextEntry placeholder="Мин. 6 символа" required />

        <Text style={s.roleTitle}>Изберете роля</Text>
        <View style={s.roleRow}>
          <RoleBtn r="user" label="Потребител" icon="person-outline" />
          <RoleBtn r="organizer" label="Организатор" icon="briefcase-outline" />
        </View>

        <Button label="Създай акаунт" onPress={submit} loading={busy} style={{ marginTop: spacing.lg }} />

        <Text style={s.link} onPress={() => navigation.goBack()}>
          Вече имате акаунт?{' '}
          <Text style={{ fontWeight: font.semibold }}>Влезте</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.xxxl },
  title: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: font.size.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl, marginTop: spacing.xs },
  roleTitle: { fontSize: font.size.sm, fontWeight: font.medium, color: colors.textSecondary, marginBottom: spacing.sm },
  roleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: spacing.md, borderRadius: radius.sm,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
  },
  roleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleLabel: { fontSize: font.size.sm, fontWeight: font.medium, color: colors.textSecondary },
  roleLabelActive: { color: '#fff' },
  link: { textAlign: 'center', marginTop: spacing.xl, color: colors.primaryLight, fontSize: font.size.md },
});
