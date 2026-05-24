import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, rgba, ThemeColors } from '../theme';
import { api } from '../api/client';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import DateTimePicker from '../components/DateTimePicker';

type Errors = {
  title?: string;
  startAt?: string;
  capacity?: string;
};

const TITLE_MAX = 120;
const DESC_MAX  = 600;
const CAP_MAX   = 100000;

function validate(values: { title: string; startAt: Date; capacity: string }): Errors {
  const errs: Errors = {};
  const title = values.title.trim();
  if (!title) errs.title = 'Заглавието е задължително.';
  else if (title.length < 3) errs.title = 'Заглавието трябва да е поне 3 символа.';
  else if (title.length > TITLE_MAX) errs.title = `Заглавието трябва да е до ${TITLE_MAX} символа.`;

  const now = new Date();
  if (!values.startAt || isNaN(values.startAt.getTime())) {
    errs.startAt = 'Изберете валидна дата и час.';
  } else if (values.startAt.getTime() <= now.getTime()) {
    errs.startAt = 'Началото трябва да е в бъдещето.';
  }

  const cap = Number(values.capacity);
  if (!values.capacity) errs.capacity = 'Капацитетът е задължителен.';
  else if (!Number.isInteger(cap) || cap <= 0) errs.capacity = 'Въведете цяло положително число.';
  else if (cap > CAP_MAX) errs.capacity = `Максимум ${CAP_MAX} места.`;

  return errs;
}

export default function CreateEventScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation]       = useState('');
  const [startAt, setStartAt]         = useState<Date>(() => {
    const d = new Date(Date.now() + 86400000);
    d.setMinutes(Math.round(d.getMinutes() / 5) * 5, 0, 0);
    return d;
  });
  const [capacity, setCapacity]       = useState('20');
  const [busy, setBusy]               = useState(false);
  const [pickerOpen, setPickerOpen]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [errors, setErrors]           = useState<Errors>({});

  const s = useMemo(() => createStyles(colors), [colors]);

  const runValidation = (): Errors => {
    const e = validate({ title, startAt, capacity });
    setErrors(e);
    return e;
  };

  const fieldError = (key: keyof Errors): string | undefined => {
    if (!submitted) return undefined;
    return errors[key];
  };

  const submit = async () => {
    setSubmitted(true);
    const e = runValidation();
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      await api.createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        location:    location.trim()    || undefined,
        start_at:    startAt.toISOString(),
        capacity:    Number(capacity),
      });
      Alert.alert('Готово', 'Събитието е създадено успешно.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Грешка', e.message);
    } finally { setBusy(false); }
  };

  const formattedDate = startAt.toLocaleDateString('bg-BG', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
  const formattedTime = startAt.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
  const dateError = fieldError('startAt');

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
            value={title}
            onChangeText={(v) => { setTitle(v); if (submitted) setErrors(validate({ title: v, startAt, capacity })); }}
            placeholder="Напр. Концерт в парка"
            error={fieldError('title')}
            maxLength={TITLE_MAX}
          />
          <InputField
            label="Описание" icon="document-text-outline"
            value={description}
            onChangeText={setDescription}
            placeholder="Кратко описание на събитието"
            multiline numberOfLines={4}
            style={{ minHeight: 90 }}
            maxLength={DESC_MAX}
            hint={`${description.length}/${DESC_MAX}`}
          />
          <InputField
            label="Място" icon="location-outline"
            value={location} onChangeText={setLocation}
            placeholder="Адрес или локация"
          />
        </View>

        <View style={s.card}>
          <SectionHeader title="Кога и колко" />

          <View style={s.dateFieldWrap}>
            <Text style={s.dateLabel}>
              Начало <Text style={{ color: colors.danger }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setPickerOpen(true)}
              activeOpacity={0.85}
              style={[
                s.dateButton,
                dateError && { borderColor: colors.danger, backgroundColor: rgba(colors.danger, 0.04) },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={dateError ? colors.danger : colors.primary}
                style={{ marginRight: spacing.sm }}
              />
              <View style={{ flex: 1 }}>
                <Text style={s.dateValue}>{formattedDate}</Text>
                <Text style={s.dateTime}>{formattedTime} ч.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            {dateError ? (
              <View style={s.errorRow}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={[s.errorText, { color: colors.danger }]}>{dateError}</Text>
              </View>
            ) : (
              <Text style={s.dateHint}>Изберете дата и час чрез календара.</Text>
            )}
          </View>

          <InputField
            label="Капацитет" required icon="people-outline"
            value={capacity}
            onChangeText={(v) => {
              const clean = v.replace(/[^0-9]/g, '');
              setCapacity(clean);
              if (submitted) setErrors(validate({ title, startAt, capacity: clean }));
            }}
            keyboardType="numeric"
            placeholder="Макс. брой участници"
            error={fieldError('capacity')}
          />
        </View>

        <Button label="Създай събитие" onPress={submit} loading={busy} size="lg" icon="checkmark-circle-outline" />
      </ScrollView>

      <DateTimePicker
        visible={pickerOpen}
        value={startAt}
        minimumDate={new Date()}
        onCancel={() => setPickerOpen(false)}
        onConfirm={(next) => {
          setStartAt(next);
          setPickerOpen(false);
          if (submitted) setErrors(validate({ title, startAt: next, capacity }));
        }}
      />
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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

    dateFieldWrap: { marginBottom: spacing.md },
    dateLabel: {
      fontSize: font.size.sm, fontWeight: font.medium,
      color: colors.textSecondary, marginBottom: spacing.xs + 2,
    },
    dateButton: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
      minHeight: 50,
    },
    dateValue: { fontSize: font.size.md, fontWeight: font.semibold, color: colors.text },
    dateTime:  { fontSize: font.size.sm, color: colors.textMuted, marginTop: 2 },
    dateHint:  { fontSize: font.size.xs, color: colors.textMuted, marginTop: spacing.xs + 2 },

    errorRow:   { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs + 2 },
    errorText:  { fontSize: font.size.xs, fontWeight: font.medium },
  });
}
