import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius, depth, rgba } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('user@demo.bg');
  const [password, setPassword] = useState('demo1234');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await login(email, password); }
    catch (e: any) { Alert.alert('Грешка при вход', e.message); }
    finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Бранд блок */}
        <View style={s.brandWrap}>
          <View style={s.logoCircle}>
            <Ionicons name="ticket" size={36} color={colors.textOnPrimary} />
          </View>
          <Text style={s.brand}>EventBook</Text>
          <Text style={s.tagline}>Резервации и събития в едно приложение</Text>
        </View>

        {/* Форма */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Добре дошли</Text>
          <Text style={s.cardSub}>Влезте в акаунта си, за да продължите</Text>

          <InputField
            label="Имейл"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <InputField
            label="Парола"
            icon="lock-closed-outline"
            rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPw(v => !v)}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPw}
            placeholder="Въведете парола"
          />

          <Button
            label="Влез"
            onPress={submit}
            loading={busy}
            size="lg"
            style={{ marginTop: spacing.sm }}
          />
        </View>

        {/* Линк за регистрация */}
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

const s = StyleSheet.create({
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

  footerLink: { marginTop: spacing.lg, alignItems: 'center' },
  footerText: { color: colors.textSecondary, fontSize: font.size.md },
  footerCta:  { color: colors.primary, fontWeight: font.semibold },
});
