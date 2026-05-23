import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius, shadow } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('../../assets/logo.png');

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('user@demo.bg');
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await login(email, password); }
    catch (e: any) { Alert.alert('Грешка', e.message); }
    finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.inner}>
        {/* Лого */}
        <View style={s.logoWrap}>
          <Image source={logo} style={s.logo} />
          <Text style={s.brand}>EventBook</Text>
          <Text style={s.tagline}>Управление на резервации и събития</Text>
        </View>

        {/* Форма карта */}
        <View style={s.formCard}>
          <Text style={s.formTitle}>Добре дошли</Text>
          <InputField label="Имейл" value={email} onChangeText={setEmail}
            autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
          <InputField label="Парола" value={password} onChangeText={setPassword}
            secureTextEntry placeholder="Въведете парола" />
          <Button label="Влез" onPress={submit} loading={busy} style={{ marginTop: spacing.sm }} />
        </View>

        <Text style={s.link} onPress={() => navigation.navigate('Register')}>
          Нямате акаунт?{' '}
          <Text style={{ fontWeight: font.semibold }}>Регистрирайте се</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },

  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: { width: 80, height: 80, marginBottom: spacing.md },
  brand: { fontSize: font.size.hero, fontWeight: font.bold, color: colors.primary, letterSpacing: -0.5 },
  tagline: { fontSize: font.size.sm, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },

  formCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.xl, ...shadow.md,
  },
  formTitle: { fontSize: font.size.xl, fontWeight: font.bold, color: colors.textPrimary, marginBottom: spacing.lg },

  link: { textAlign: 'center', marginTop: spacing.xl, color: colors.primaryLight, fontSize: font.size.md },
});
