import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius, depth, rgba } from '../theme';
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
                : e.message === 'ALREADY_RESERVED'   ? 'Вече имате резервация за това събитие.'
                : e.message;
      Alert.alert('Грешка', msg);
    } finally { setReserving(false); }
  };

  if (!event) return <View style={s.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const isFull     = event.available_seats === 0;
  const cancelled  = event.status === 'cancelled';
  const eventDate  = new Date(event.start_at);
  const heroAccent = cancelled ? colors.danger : isFull ? colors.warning : colors.primary;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.wrap}>
      {/* Hero */}
      <View style={[s.hero, { backgroundColor: heroAccent }]}>
        <View style={s.heroOverlay} />
        <View style={s.heroContent}>
          <View style={s.heroDateBlock}>
            <Text style={s.heroMonth}>
              {eventDate.toLocaleString('bg-BG', { month: 'short' }).toUpperCase().replace('.', '')}
            </Text>
            <Text style={s.heroDay}>{eventDate.getDate()}</Text>
            <Text style={s.heroYear}>{eventDate.getFullYear()}</Text>
          </View>
          <View style={s.heroText}>
            <View style={s.heroBadgeRow}>
              {cancelled
                ? <Badge label="Отменено"  variant="danger"  icon="close-circle"     soft={false} />
                : isFull
                  ? <Badge label="Запълнено" variant="warning" icon="alert-circle"    soft={false} />
                  : <Badge label="Активно"   variant="success" icon="checkmark-circle" soft={false} />}
            </View>
            <Text style={s.heroTitle}>{event.title}</Text>
            <Text style={s.heroOrganizer}>от {event.organizer_name}</Text>
          </View>
        </View>
      </View>

      {/* Информационна карта */}
      <View style={s.infoCard}>
        <View style={s.gridRow}>
          <InfoChip
            label="Дата"
            value={eventDate.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
            icon="calendar"
            color={colors.primary}
          />
          <InfoChip
            label="Час"
            value={eventDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}
            icon="time"
            color={colors.info}
          />
        </View>

        {event.location ? (
          <View style={s.locationRow}>
            <View style={[s.iconChip, { backgroundColor: rgba(colors.secondary, 0.12) }]}>
              <Ionicons name="location" size={18} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.metaLabel}>Локация</Text>
              <Text style={s.metaValue}>{event.location}</Text>
            </View>
          </View>
        ) : null}

        <View style={s.divider} />
        <CapacityBar available={event.available_seats} capacity={event.capacity} />
      </View>

      {/* Описание */}
      {event.description ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>За събитието</Text>
          <View style={s.descCard}>
            <Text style={s.desc}>{event.description}</Text>
          </View>
        </View>
      ) : null}

      {/* Действия */}
      <View style={s.actions}>
        {user?.role === 'user' && !isFull && !cancelled && (
          <Button label="Резервирай място" onPress={reserve} loading={reserving} size="lg" icon="ticket" />
        )}
        {user?.role === 'organizer' && event.organizer_id === user.id && (
          <Button
            label="Виж резервациите"
            variant="outline"
            size="lg"
            icon="people-outline"
            onPress={() => navigation.navigate('EventReservations', { id: event.id, title: event.title })}
          />
        )}
      </View>
    </ScrollView>
  );
}

function InfoChip({ label, value, icon, color }:
  { label: string; value: string; icon: any; color: string }) {
  return (
    <View style={s.infoChip}>
      <View style={[s.iconChip, { backgroundColor: rgba(color, 0.12) }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={s.metaLabel}>{label}</Text>
      <Text style={s.metaValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  wrap:    { paddingBottom: spacing.xxl },

  hero: {
    margin: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...depth.level3,
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  heroContent: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroDateBlock: {
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  heroMonth: { fontSize: 11, fontWeight: font.bold, color: '#FFFFFF', letterSpacing: 1, opacity: 0.85 },
  heroDay:   { fontSize: 30, fontWeight: font.bold, color: '#FFFFFF', lineHeight: 32, marginTop: 2 },
  heroYear:  { fontSize: 11, fontWeight: font.medium, color: '#FFFFFF', opacity: 0.75, marginTop: 2 },
  heroText:  { flex: 1 },
  heroBadgeRow: { marginBottom: spacing.sm },
  heroTitle:    { fontSize: font.size.xl, fontWeight: font.bold, color: '#FFFFFF', lineHeight: 26 },
  heroOrganizer:{ fontSize: font.size.sm, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderWidth: 1, borderColor: colors.borderLight,
    ...depth.level1,
  },
  gridRow:  { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  infoChip: {
    flex: 1, padding: spacing.md,
    borderRadius: radius.md, backgroundColor: colors.surfaceAlt,
  },
  iconChip: {
    width: 32, height: 32, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md, marginBottom: spacing.sm,
    gap: spacing.md,
  },
  metaLabel: { fontSize: font.size.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: font.size.md, fontWeight: font.semibold, color: colors.text },

  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },

  section:      { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: { fontSize: font.size.xs, fontWeight: font.bold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  descCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  desc: { fontSize: font.size.md, lineHeight: font.size.md * font.leading.loose, color: colors.textSecondary },

  actions: { paddingHorizontal: spacing.md, marginTop: spacing.lg, gap: spacing.md },
});
