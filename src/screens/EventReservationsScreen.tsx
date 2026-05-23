import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { colors, spacing, font, radius, shadow } from '../theme';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

export default function EventReservationsScreen({ route }: any) {
  const { id, title } = route.params;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.eventReservations(id)); } finally { setLoading(false); }
  }, [id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const confirmed = rows.filter(r => r.status === 'confirmed');
  const totalSeats = confirmed.reduce((a, r) => a + r.seats, 0);

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={s.list}
      data={rows}
      keyExtractor={(r) => String(r.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={s.summary}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{confirmed.length}</Text>
            <Text style={s.statLabel}>резервации</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statBox}>
            <Text style={s.statNum}>{totalSeats}</Text>
            <Text style={s.statLabel}>заети места</Text>
          </View>
        </View>
      }
      ListEmptyComponent={<EmptyState icon="people-outline" message="Все още няма резервации за това събитие." />}
      renderItem={({ item }) => {
        const cancelled = item.status === 'cancelled';
        return (
          <View style={[s.row, cancelled && { opacity: 0.5 }]}>
            {/* Аватар */}
            <View style={[s.avatar, cancelled && { backgroundColor: colors.borderLight }]}>
              <Ionicons name="person" size={18}
                color={cancelled ? colors.textMuted : colors.primary} />
            </View>

            {/* Информация */}
            <View style={s.info}>
              <Text style={s.name}>{item.full_name}</Text>
              <Text style={s.email}>{item.email}</Text>
              <Text style={s.dateMeta}>
                {item.seats} {item.seats === 1 ? 'място' : 'места'} · {new Date(item.created_at).toLocaleDateString('bg-BG')}
              </Text>
            </View>

            {/* Статус */}
            <Badge
              label={cancelled ? 'Отказана' : 'Потвърдена'}
              variant={cancelled ? 'muted' : 'success'}
            />
          </View>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  // Обобщителна секция
  summary: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: radius.md, padding: spacing.lg,
    marginBottom: spacing.lg, ...shadow.md,
    alignItems: 'center', justifyContent: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.primary },
  statLabel: { fontSize: font.size.xs, color: colors.textMuted, marginTop: spacing.xs },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border },
  // Ред за резервация
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadow.md,
  },
  avatar: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  name: { fontSize: font.size.md, fontWeight: font.semibold, color: colors.textPrimary },
  email: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 1 },
  dateMeta: { fontSize: font.size.xs, color: colors.textSecondary, marginTop: spacing.xs },
});
