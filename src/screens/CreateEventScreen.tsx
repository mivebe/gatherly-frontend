import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { api } from '../api/client';
import { colors, spacing, font } from '../theme';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startAt, setStartAt] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [capacity, setCapacity] = useState('20');
  const [busy, setBusy] = useState(false);

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
        location: location || undefined,
        start_at: new Date(startAt).toISOString(),
        capacity: Number(capacity),
      });
      Alert.alert('Готово', 'Събитието е създадено успешно.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Грешка', e.message);
    } finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <InputField label="Заглавие" required value={title} onChangeText={setTitle}
          placeholder="Напр. Концерт в парка" />
        <InputField label="Описание" value={description} onChangeText={setDescription}
          placeholder="Кратко описание на събитието" multiline style={{ height: 90, textAlignVertical: 'top' }} />
        <InputField label="Място" value={location} onChangeText={setLocation}
          placeholder="Адрес или локация" />
        <InputField label="Начало (YYYY-MM-DDTHH:MM)" required value={startAt} onChangeText={setStartAt}
          autoCapitalize="none" placeholder="2026-06-15T18:00" />
        <InputField label="Капацитет" required value={capacity} onChangeText={setCapacity}
          keyboardType="numeric" placeholder="Макс. брой участници" />

        <Button label="Създай събитие" onPress={submit} loading={busy} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: spacing.xl, paddingBottom: spacing.xxxl },
});
