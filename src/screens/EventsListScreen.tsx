import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl, TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { colors, spacing, font, radius, depth } from '../theme';
import Card from '../components/Card';
import MetaRow from '../components/MetaRow';
import CapacityBar from '../components/CapacityBar';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';

export default function EventsListScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEvents(await api.listEvents()); }
    catch {} finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = query.trim()
    ? events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()))
    : events;

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Разделяне на "днес" и "предстоящи"
  const todayEvents = filtered.filter(e => new Date(e.start_at).toISOString().slice(0, 10) === today);
  const upcomingEvents = filtered.filter(e => new Date(e.start_at).toISOString().slice(0, 10) !== today);

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={s.list}
      data={[
        ...(todayEvents.length ? [{ _section: 'Днес' }, ...todayEvents] : []),
        ...(upcomingEvents.length ? [{ _section: 'Предстоящи' }, ...upcomingEvents] : []),
        ...(filtered.length === 0 ? [{ _empty: true }] : []),
      ]}
      keyExtractor={(item: any, i) => item._section || item._empty ? `s-${i}` : String(item.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={s.searchWrap}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
          <TextInput style={s.searchInput} placeholder="Търсене по заглавие..."
            placeholderTextColor={colors.textMuted} value={query} onChangeText={setQuery} />
          {query.length > 0 && (
            <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} />
          )}
        </View>
      }
      renderItem={({ item }: any) => {
        if (item._empty) return <EmptyState icon="ticket-outline" message="Няма предстоящи събития." />;
        if (item._section) return <SectionHeader title={item._section} />;

        const eventDate = new Date(item.start_at);
        const isToday = eventDate.toISOString().slice(0, 10) === today;
        const hoursUntil = (eventDate.getTime() - now.getTime()) / 3600000;
        const isSoon = !isToday && hoursUntil < 72 && hoursUntil > 0;

        return (
          <Card
            onPress={() => navigation.navigate('EventDetails', { id: item.id })}
            accentColor={isToday ? colors.warning : colors.primary}
            level={isToday ? 3 : 2}
          >
            <View style={s.header}>
              {/* Дата badge */}
              <View style={[s.dateBadge, isToday && { backgroundColor: colors.warningFaded }]}>
                <Text style={[s.dateDay, isToday && { color: colors.warning }]}>{eventDate.getDate()}</Text>
                <Text style={[s.dateMonth, isToday && { color: colors.warning }]}>
                  {eventDate.toLocaleString('bg-BG', { month: 'short' }).toUpperCase()}
                </Text>
              </View>
              {/* Съдържание */}
              <View style={s.body}>
                <View style={s.titleRow}>
                  <Text style={s.title} numberOfLines={2}>{item.title}</Text>
                  {isToday && <Badge label="Днес" variant="warning" />}
                  {isSoon && <Badge label="Скоро" variant="info" />}
                </View>
                <MetaRow icon="time-outline" text={eventDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} />
                {item.location ? <MetaRow icon="location-outline" text={item.location} /> : null}
                <CapacityBar available={item.available_seats} capacity={item.capacity} />
              </View>
            </View>
          </Card>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: spacing.xl },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 4, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.borderLight,
    ...depth.level0,
  },
  searchInput: { flex: 1, paddingVertical: spacing.sm + 4, fontSize: font.size.md, color: colors.text },

  header: { flexDirection: 'row' },
  dateBadge: {
    width: 48, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primaryFaded, borderRadius: radius.sm,
    paddingVertical: spacing.sm, marginRight: spacing.sm + 4,
  },
  dateDay: { fontSize: font.size.xl, fontWeight: font.bold, color: colors.primary, lineHeight: 24 },
  dateMonth: { fontSize: 10, fontWeight: font.semibold, color: colors.primaryLight, marginTop: 1 },

  body: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.xs },
  title: { fontSize: font.size.lg, fontWeight: font.bold, color: colors.text, flex: 1, marginRight: spacing.sm },
});
