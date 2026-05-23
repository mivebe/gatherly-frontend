import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius, shadow } from '../theme';
import MetaRow from '../components/MetaRow';
import CapacityBar from '../components/CapacityBar';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function EventDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [reserving, setReserving] = useState(false);

  const load = useCallback(async () => { setEvent(await api.getEvent(id)); }, [id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const reserve = async () => {
    setReserving(true);
    try {
      await api.reserve(id, 1);
      Alert.alert('Готово', 'Резервацията е направена успешно.');
      load();
    } catch (e: any) {
      const msg = e.message === 'NO_SEATS_AVAILABLE' ? 'Няма свободни места.'
                : e.message === 'ALREADY_RESERVED' ? 'Вече имате резервация за това събитие.'
                : e.message;
      Alert.alert('Грешка', msg);
    } finally { setReserving(false); }
  };

  if (!event) return <View style={s.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const isFull = event.available_seats === 0;
  const eventDate = new Date(event.start_at);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.wrap}>
      {/* Hero банер */}
      <View style={s.hero}>
        <View style={s.heroBg}>
          <View style={s.heroDateCol}>
            <Text style={s.heroDay}>{eventDate.getDate()}</Text>
            <Text style={s.heroMonth}>{eventDate.toLocaleString('bg-BG', { month: 'short' }).toUpperCase()}</Text>
          </View>
          <View style={s.heroContent}>
            <Text style={s.heroTitle}>{event.title}</Text>
            <View style={{ marginTop: spacing.sm }}>
              {event.status === 'cancelled'
                ? <Badge label="Отменено" variant="danger" />
                : isFull
                  ? <Badge label="Запълнено" variant="warning" />
                  : <Badge label="Активно" variant="success" />}
            </View>
          </View>
        </View>
      </View>

      {/* Информационна карта */}
      <View style={s.infoCard}>
        <MetaRow icon="calendar-outline" text={eventDate.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
        <MetaRow icon="time-outline" text={eventDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} />
        {event.location ? <MetaRow icon="location-outline" text={event.location} /> : null}
        <MetaRow icon="person-outline" text={event.organizer_name} />
        <View style={s.divider} />
        <CapacityBar available={event.available_seats} capacity={event.capacity} />
      </View>

      {/* Описание */}
      {event.description ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Описание</Text>
          <Text style={s.desc}>{event.description}</Text>
        </View>
      ) : null}

      {/* Действия */}
      <View style={s.actions}>
        {user?.role === 'user' && !isFull && event.status === 'active' && (
          <Button label="Резервирай място" onPress={reserve} loading={reserving} />
        )}
        {user?.role === 'organizer' && event.organizer_id === user.id && (
          <Button label="Виж резервациите" variant="outline"
            onPress={() => navigation.navigate('EventReservations', { id: event.id, title: event.title })} />
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  wrap: { paddingBottom: spacing.xxxl },

  hero: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  heroBg: {
    flexDirection: 'row', backgroundColor: colors.primary,
    borderRadius: radius.lg, padding: spacing.xl, ...shadow.lg,
  },
  heroDateCol: {
    width: 56, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.sm,
    paddingVertical: spacing.sm, marginRight: spacing.lg,
  },
  heroDay: { fontSize: font.size.xxl, fontWeight: font.bold, color: '#fff', lineHeight: 30 },
  heroMonth: { fontSize: font.size.xs, fontWeight: font.semibold, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  heroContent: { flex: 1, justifyContent: 'center' },
  heroTitle: { fontSize: font.size.xl, fontWeight: font.bold, color: '#fff' },

  infoCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg,
    marginHorizontal: spacing.xl, marginTop: spacing.lg, ...shadow.md,
  },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },

  section: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  sectionTitle: { fontSize: font.size.xs, fontWeight: font.semibold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  desc: { fontSize: font.size.md, lineHeight: font.size.md * font.leading.loose, color: colors.textSecondary },

  actions: { paddingHorizontal: spacing.xl, marginTop: spacing.xl, gap: spacing.md },
});
