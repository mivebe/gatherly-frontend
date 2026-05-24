import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, ThemeColors } from '../theme';
import Card from '../components/Card';
import MetaRow from '../components/MetaRow';
import CapacityBar from '../components/CapacityBar';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';
import DateBadge from '../components/DateBadge';
import { SkeletonList } from '../components/Skeleton';

export default function EventsListScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const s = useMemo(() => createStyles(colors), [colors]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEvents(await api.listEvents()); }
    catch {} finally { setLoading(false); setInitialLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = query.trim()
    ? events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()))
    : events;

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const todayEvents    = filtered.filter(e => new Date(e.start_at).toISOString().slice(0, 10) === today);
  const upcomingEvents = filtered.filter(e => new Date(e.start_at).toISOString().slice(0, 10) !== today);

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={s.list}
      data={
        initialLoading
          ? [{ _skeleton: true }]
          : [
              ...(todayEvents.length    ? [{ _section: 'Днес' },        ...todayEvents]    : []),
              ...(upcomingEvents.length ? [{ _section: 'Предстоящи' }, ...upcomingEvents] : []),
              ...(filtered.length === 0 ? [{ _empty: true }]                              : []),
            ]
      }
      keyExtractor={(item: any, i) => item._section || item._empty || item._skeleton ? `s-${i}` : String(item.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View>
          <Text style={s.headerTitle}>Открийте събития</Text>
          <Text style={s.headerSub}>
            {initialLoading
              ? 'Зареждане…'
              : `${filtered.length} ${filtered.length === 1 ? 'събитие' : 'събития'} налични`}
          </Text>

          <View style={s.searchWrap}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput
              style={s.searchInput}
              placeholder="Търсене по заглавие..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
      renderItem={({ item }: any) => {
        if (item._skeleton) return <SkeletonList count={4} />;
        if (item._empty)   return <EmptyState icon="ticket-outline" message="Няма предстоящи събития." />;
        if (item._section) return <SectionHeader title={item._section} />;

        const eventDate = new Date(item.start_at);
        const isToday   = eventDate.toISOString().slice(0, 10) === today;
        const hoursTo   = (eventDate.getTime() - now.getTime()) / 3600000;
        const isSoon    = !isToday && hoursTo < 72 && hoursTo > 0;
        const accent    = isToday ? colors.secondary : colors.primary;

        return (
          <Card
            onPress={() => navigation.navigate('EventDetails', { id: item.id })}
            accentColor={accent}
            level={isToday ? 3 : 1}
          >
            <View style={s.cardHeader}>
              <DateBadge date={eventDate} color={accent} />
              <View style={s.body}>
                <View style={s.titleRow}>
                  <Text style={s.title} numberOfLines={2}>{item.title}</Text>
                </View>
                <MetaRow icon="time-outline" text={eventDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} dense />
                {item.location ? <MetaRow icon="location-outline" text={item.location} dense /> : null}
              </View>
            </View>

            {(isToday || isSoon) && (
              <View style={s.badgeRow}>
                {isToday && <Badge label="Днес" variant="warning" icon="flame" />}
                {isSoon  && <Badge label="Скоро" variant="info"    icon="time" />}
              </View>
            )}

            <CapacityBar available={item.available_seats} capacity={item.capacity} />
          </Card>
        );
      }}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: { padding: spacing.md, paddingBottom: spacing.xl },

    headerTitle: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.text, marginTop: spacing.sm, marginBottom: 2 },
    headerSub:   { fontSize: font.size.sm,  color: colors.textMuted, marginBottom: spacing.md },

    searchWrap: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.md,
      paddingHorizontal: spacing.md, marginBottom: spacing.sm,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level0,
    },
    searchInput: { flex: 1, paddingVertical: spacing.sm + 4, fontSize: font.size.md, color: colors.text },

    cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
    body:       { flex: 1, marginLeft: spacing.md },
    titleRow:   { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.xs + 2 },
    title:      { fontSize: font.size.lg, fontWeight: font.bold, color: colors.text, flex: 1, marginRight: spacing.sm, lineHeight: 22 },

    badgeRow: { flexDirection: 'row', gap: spacing.xs + 2, marginTop: spacing.xs + 2, flexWrap: 'wrap' },
  });
}
