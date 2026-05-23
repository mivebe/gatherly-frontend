import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, font, radius, depth } from '../theme';
import { api } from '../api/client';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation]       = useState('');
  const [startAt, setStartAt]         = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [capacity, setCapacity]       = useState('20');
  const [busy, setBusy]               = useState(false);

  const submit = async () => {
    if (!title || !startAt || !capacity) {
      Alert.alert('Грешка', 'Моля, попълнете заглавие, дата и капацитет.');
      return;
    }
    setBusy(true);
    try {
      await api.createEvent({
        title,
        description: description || undefined,
        location:    location    || undefined,
        start_at:    new Date(startAt).toISOString(),
        capacity:    Number(capacity),
      });
      Alert.alert('Готово', 'Събитието е създадено успешно.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Грешка', e.message);
    } finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.intro}>Попълнете данните за новото събитие. Полетата маркирани с * са задължителни.</Text>

        <View style={s.card}>
          <SectionHeader title="Основни данни" />
          <InputField
            label="Заглавие" required icon="text-outline"
            value={title} onChangeText={setTitle}
            placeholder="Напр. Концерт в парка"
          />
          <InputField
            label="Описание" icon="document-text-outline"
            value={description} onChangeText={setDescription}
            placeholder="Кратко описание на събитието"
            multiline numberOfLines={4}
            style={{ minHeight: 90 }}
          />
          <InputField
            label="Място" icon="location-outline"
            value={location} onChangeText={setLocation}
            placeholder="Адрес или локация"
          />
        </View>

        <View style={s.card}>
          <SectionHeader title="Кога и колко" />
          <InputField
            label="Начало (YYYY-MM-DDTHH:MM)" required icon="calendar-outline"
            value={startAt} onChangeText={setStartAt}
            autoCapitalize="none"
            placeholder="2026-06-15T18:00"
          />
          <InputField
            label="Капацитет" required icon="people-outline"
            value={capacity} onChangeText={setCapacity}
            keyboardType="numeric"
            placeholder="Макс. брой участници"
          />
        </View>

        <Button label="Създай събитие" onPress={submit} loading={busy} size="lg" icon="checkmark-circle-outline" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap:  { padding: spacing.md, paddingBottom: spacing.xxl },
  intro: { fontSize: font.size.sm, color: colors.textMuted, marginBottom: spacing.md, lineHeight: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1, borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...depth.level1,
  },
});
