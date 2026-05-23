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
      }}
    ]);
  };

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={s.list}
      data={rows}
      keyExtractor={(r) => String(r.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      ListEmptyComponent={<EmptyState icon="bookmark-outline" message="Все още нямате резервации." />}
      renderItem={({ item }) => {
        const cancelled = item.status === 'cancelled';
        return (
          <Card disabled={cancelled}>
            <View style={s.header}>
              <Text style={s.title}>{item.title}</Text>
              <Badge label={cancelled ? 'Отказана' : 'Потвърдена'} variant={cancelled ? 'muted' : 'success'} />
            </View>
            <MetaRow icon="calendar-outline" text={new Date(item.start_at).toLocaleString('bg-BG')} />
            {item.location ? <MetaRow icon="location-outline" text={item.location} /> : null}
            <MetaRow icon="people-outline" text={`${item.seats} ${item.seats === 1 ? 'място' : 'места'}`} />
            {!cancelled && (
              <Button label="Откажи резервация" variant="danger" onPress={() => cancel(item.id)}
                style={{ marginTop: spacing.md }} />
            )}
          </Card>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  title: { fontSize: font.size.lg, fontWeight: font.bold, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
});
