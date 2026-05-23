import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, ThemeColors } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import MetaRow from '../components/MetaRow';
import CapacityBar from '../components/CapacityBar';
import EmptyState from '../components/EmptyState';
import DateBadge from '../components/DateBadge';

export default function MyEventsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const s = useMemo(() => createStyles(colors), [colors]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.myEvents()); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const active = rows.filter(r => r.status === 'active');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        contentContainerStyle={s.list}
        data={rows}
        keyExtractor={(e) => String(e.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
        ListHeaderComponent={
          rows.length ? (
            <View style={s.header}>
              <Text style={s.headerTitle}>Моите събития</Text>
              <Text style={s.headerSub}>{active.length} активни, {rows.length} общо</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState icon="briefcase-outline" message="Все още нямате създадени събития." />
        }
        renderItem={({ item }) => {
          const start     = new Date(item.start_at);
          const cancelled = item.status !== 'active';
          const accent    = cancelled ? colors.textMuted : colors.primary;

          return (
            <Card
              onPress={() => navigation.navigate('EventDetails', { id: item.id })}
              accentColor={accent}
              level={cancelled ? 0 : 1}
            >
              <View style={s.row}>
                <DateBadge date={start} color={accent} />
                <View style={s.body}>
                  <View style={s.titleRow}>
                    <Text style={[s.title, cancelled && { color: colors.textMuted }]} numberOfLines={2}>{item.title}</Text>
                    <Badge
                      label={cancelled ? 'Отменено' : 'Активно'}
                      variant={cancelled ? 'muted' : 'success'}
                      icon={cancelled ? 'close-circle' : 'checkmark-circle'}
                    />
                  </View>
                  <MetaRow icon="time-outline" text={start.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} dense />
                  <MetaRow icon="people-outline" text={`${item.reservations_count} резервации`} dense />
                </View>
              </View>
              <CapacityBar available={item.capacity - item.reservations_count} capacity={item.capacity} />
            </Card>
          );
        }}
      />
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('CreateEvent')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list:   { padding: spacing.md, paddingBottom: 110 },
    header: { marginTop: spacing.sm, marginBottom: spacing.md },
    headerTitle: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.text },
    headerSub:   { fontSize: font.size.sm, color: colors.textMuted, marginTop: 2 },

    row:      { flexDirection: 'row', alignItems: 'flex-start' },
    body:     { flex: 1, marginLeft: spacing.md },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.xs + 2, gap: spacing.sm },
    title:    { fontSize: font.size.lg, fontWeight: font.bold, color: colors.text, flex: 1, lineHeight: 22 },

    fab: {
      position: 'absolute', right: spacing.lg, bottom: spacing.xl,
      backgroundColor: colors.primary,
      width: 60, height: 60, borderRadius: radius.full,
      alignItems: 'center', justifyContent: 'center',
      ...depth.level3,
      shadowColor: colors.primary, shadowOpacity: 0.35,
    },
  });
}
