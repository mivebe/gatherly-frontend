import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { colors, spacing, font } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import MetaRow from '../components/MetaRow';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import DateBadge from '../components/DateBadge';

export default function MyReservationsScreen() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.myReservations()); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const cancel = (id: number) => {
    Alert.alert('Отказ на резервация', 'Сигурни ли сте, че желаете да откажете?', [
      { text: 'Не' },
      { text: 'Да, откажи', style: 'destructive', onPress: async () => {
          await api.cancelReservation(id); load();
      }},
    ]);
  };

  const confirmed = rows.filter(r => r.status !== 'cancelled');

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={s.list}
      data={rows}
      keyExtractor={(r) => String(r.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListHeaderComponent={
        rows.length ? (
          <View style={s.header}>
            <Text style={s.headerTitle}>Моите резервации</Text>
            <Text style={s.headerSub}>{confirmed.length} активни, {rows.length - confirmed.length} отказани</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={<EmptyState icon="bookmark-outline" message="Все още нямате резервации." />}
      renderItem={({ item }) => {
        const cancelled = item.status === 'cancelled';
        const start     = new Date(item.start_at);
        const accent    = cancelled ? colors.textMuted : colors.primary;

        return (
          <Card disabled={cancelled} accentColor={accent} level={cancelled ? 0 : 1}>
            <View style={s.row}>
              <DateBadge date={start} color={accent} />
              <View style={s.body}>
                <View style={s.titleRow}>
                  <Text style={s.title} numberOfLines={2}>{item.title}</Text>
                  <Badge
                    label={cancelled ? 'Отказана' : 'Потвърдена'}
                    variant={cancelled ? 'muted' : 'success'}
                    icon={cancelled ? 'close-circle' : 'checkmark-circle'}
                  />
                </View>
                <MetaRow
                  icon="time-outline"
                  text={start.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}
                  dense
                />
                {item.location ? <MetaRow icon="location-outline" text={item.location} dense /> : null}
                <MetaRow icon="people-outline" text={`${item.seats} ${item.seats === 1 ? 'място' : 'места'}`} dense />
              </View>
            </View>

            {!cancelled && (
              <Button
                label="Откажи резервация"
                variant="outline"
                onPress={() => cancel(item.id)}
                size="sm"
                style={{ marginTop: spacing.sm + 4, alignSelf: 'flex-start' }}
              />
            )}
          </Card>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  list:   { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginTop: spacing.sm, marginBottom: spacing.md },
  headerTitle: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.text },
  headerSub:   { fontSize: font.size.sm,  color: colors.textMuted, marginTop: 2 },

  row:      { flexDirection: 'row', alignItems: 'flex-start' },
  body:     { flex: 1, marginLeft: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.xs + 2, gap: spacing.sm },
  title:    { fontSize: font.size.lg, fontWeight: font.bold, color: colors.text, flex: 1, lineHeight: 22 },
});
