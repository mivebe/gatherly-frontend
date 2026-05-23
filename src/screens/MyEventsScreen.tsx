import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { colors, spacing, font, radius, shadow } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import MetaRow from '../components/MetaRow';
import CapacityBar from '../components/CapacityBar';
import EmptyState from '../components/EmptyState';

export default function MyEventsScreen({ navigation }: any) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.myEvents()); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        contentContainerStyle={s.list}
        data={rows}
        keyExtractor={(e) => String(e.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
        ListEmptyComponent={<EmptyState icon="briefcase-outline" message="Все още нямате създадени събития." />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('EventDetails', { id: item.id })}>
            <View style={s.header}>
              <Text style={s.title}>{item.title}</Text>
              <Badge
                label={item.status === 'active' ? 'Активно' : 'Отменено'}
                variant={item.status === 'active' ? 'success' : 'danger'}
              />
            </View>
            <MetaRow icon="calendar-outline" text={new Date(item.start_at).toLocaleString('bg-BG')} />
            <MetaRow icon="people-outline" text={`${item.reservations_count} резервации`} />
            <CapacityBar available={item.capacity - item.reservations_count} capacity={item.capacity} />
          </Card>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('CreateEvent')} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  title: { fontSize: font.size.lg, fontWeight: font.bold, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  fab: {
    position: 'absolute', right: spacing.xl, bottom: spacing.xxl,
    backgroundColor: colors.primary, width: 56, height: 56, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center', ...shadow.lg,
  },
});
