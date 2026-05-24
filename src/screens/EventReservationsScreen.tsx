import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, ThemeColors } from '../theme';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import { SkeletonList } from '../components/Skeleton';

export default function EventReservationsScreen({ route }: any) {
  const { colors } = useTheme();
  const { id } = route.params;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const s = useMemo(() => createStyles(colors), [colors]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.eventReservations(id)); }
    finally { setLoading(false); setInitialLoading(false); }
  }, [id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const confirmed  = rows.filter(r => r.status === 'confirmed');
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
            <Text style={[s.statNum, { color: colors.primary }]}>{confirmed.length}</Text>
            <Text style={s.statLabel}>Резервации</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statBox}>
            <Text style={[s.statNum, { color: colors.secondary }]}>{totalSeats}</Text>
            <Text style={s.statLabel}>Заети места</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        initialLoading
          ? <SkeletonList count={3} />
          : <EmptyState icon="people-outline" message="Все още няма резервации за това събитие." />
      }
      renderItem={({ item }) => {
        const cancelled = item.status === 'cancelled';
        return (
          <View style={[s.row, cancelled && { opacity: 0.5 }]}>
            <Avatar
              name={item.full_name}
              size="md"
              color={cancelled ? colors.textMuted : colors.primary}
            />
            <View style={s.info}>
              <Text style={s.name} numberOfLines={1}>{item.full_name}</Text>
              <Text style={s.email} numberOfLines={1}>{item.email}</Text>
              <Text style={s.dateMeta}>
                {item.seats} {item.seats === 1 ? 'място' : 'места'} · {new Date(item.created_at).toLocaleDateString('bg-BG')}
              </Text>
            </View>
            <Badge
              label={cancelled ? 'Отказана' : 'Потвърдена'}
              variant={cancelled ? 'muted' : 'success'}
              icon={cancelled ? 'close-circle' : 'checkmark-circle'}
            />
          </View>
        );
      }}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: { padding: spacing.md, paddingBottom: spacing.xxl },

    summary: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level1,
      alignItems: 'center', justifyContent: 'center',
    },
    statBox:     { flex: 1, alignItems: 'center' },
    statNum:     { fontSize: 32, fontWeight: font.bold, lineHeight: 36 },
    statLabel:   { fontSize: font.size.xs, color: colors.textMuted, marginTop: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
    statDivider: { width: 1, height: 40, backgroundColor: colors.borderLight },

    row: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.lg,
      padding: spacing.md, marginBottom: spacing.sm,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level0,
      gap: spacing.md,
    },
    info:     { flex: 1, minWidth: 0 },
    name:     { fontSize: font.size.md, fontWeight: font.semibold, color: colors.text },
    email:    { fontSize: font.size.xs, color: colors.textMuted, marginTop: 1 },
    dateMeta: { fontSize: font.size.xs, color: colors.textSecondary, marginTop: spacing.xs },
  });
}
