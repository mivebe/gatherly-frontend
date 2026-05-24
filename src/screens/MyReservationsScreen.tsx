import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, ThemeColors } from '../theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import MetaRow from '../components/MetaRow';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import DateBadge from '../components/DateBadge';
import { SkeletonList } from '../components/Skeleton';
import ConfirmModal from '../components/ConfirmModal';
import SegmentedControl from '../components/SegmentedControl';

type Filter = 'active' | 'past' | 'cancelled';

const EMPTY_MESSAGES: Record<Filter, string> = {
  active:    'Нямате активни резервации.',
  past:      'Нямате минали резервации.',
  cancelled: 'Нямате отказани резервации.',
};

export default function MyReservationsScreen() {
  const { colors } = useTheme();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pending, setPending] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [filter, setFilter] = useState<Filter>('active');
  const s = useMemo(() => createStyles(colors), [colors]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.myReservations()); }
    finally { setLoading(false); setInitialLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const cancel = async () => {
    if (!pending) return;
    setCancelling(true);
    try {
      await api.cancelReservation(pending.id);
      setPending(null);
      await load();
    } catch (e: any) {
      Alert.alert('Грешка', e.message);
    } finally {
      setCancelling(false);
    }
  };

  const { active, past, cancelled } = useMemo(() => {
    const now = Date.now();
    const buckets = { active: [] as any[], past: [] as any[], cancelled: [] as any[] };
    for (const r of rows) {
      if (r.status === 'cancelled') buckets.cancelled.push(r);
      else if (new Date(r.start_at).getTime() < now) buckets.past.push(r);
      else buckets.active.push(r);
    }
    return buckets;
  }, [rows]);

  const visible =
    filter === 'active'    ? active :
    filter === 'past'      ? past   :
                             cancelled;

  if (initialLoading) {
    return (
      <View style={[s.skeletonWrap, { backgroundColor: colors.background }]}>
        <View style={s.headerSkeleton}>
          <Text style={s.headerTitle}>Моите резервации</Text>
        </View>
        <SkeletonList count={4} />
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={s.list}
        data={visible}
        keyExtractor={(r) => String(r.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
        ListHeaderComponent={
          rows.length ? (
            <View style={s.header}>
              <Text style={s.headerTitle}>Моите резервации</Text>
              <Text style={s.headerSub}>{active.length} активни, {past.length} минали, {cancelled.length} отказани</Text>
              <View style={s.segmentWrap}>
                <SegmentedControl<Filter>
                  segments={[
                    { value: 'active',    label: 'Активни',  count: active.length },
                    { value: 'past',      label: 'Минали',   count: past.length },
                    { value: 'cancelled', label: 'Отказани', count: cancelled.length },
                  ]}
                  value={filter}
                  onChange={setFilter}
                />
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            message={rows.length ? EMPTY_MESSAGES[filter] : 'Все още нямате резервации.'}
          />
        }
        renderItem={({ item }) => {
          const isCancelled = item.status === 'cancelled';
          const start       = new Date(item.start_at);
          const isPast      = !isCancelled && start.getTime() < Date.now();
          const dimmed      = isCancelled || isPast;
          const accent      = dimmed ? colors.textMuted : colors.primary;

          return (
            <Card disabled={dimmed} accentColor={accent} level={dimmed ? 0 : 1}>
              <View style={s.row}>
                <DateBadge date={start} color={accent} />
                <View style={s.body}>
                  <View style={s.titleRow}>
                    <Text style={s.title} numberOfLines={2}>{item.title}</Text>
                    <Badge
                      label={isCancelled ? 'Отказана' : isPast ? 'Приключила' : 'Потвърдена'}
                      variant={isCancelled ? 'muted' : isPast ? 'muted' : 'success'}
                      icon={isCancelled ? 'close-circle' : isPast ? 'time-outline' : 'checkmark-circle'}
                    />
                  </View>
                  <MetaRow icon="time-outline" text={start.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} dense />
                  {item.location ? <MetaRow icon="location-outline" text={item.location} dense /> : null}
                  <MetaRow icon="people-outline" text={`${item.seats} ${item.seats === 1 ? 'място' : 'места'}`} dense />
                </View>
              </View>

              {!dimmed && (
                <Button
                  label="Откажи резервация"
                  variant="outline"
                  onPress={() => setPending(item)}
                  size="sm"
                  style={{ marginTop: spacing.sm + 4, alignSelf: 'flex-start' }}
                />
              )}
            </Card>
          );
        }}
      />

      <ConfirmModal
        visible={!!pending}
        title="Отказ на резервация"
        message={pending ? `Сигурни ли сте, че желаете да откажете „${pending.title}"?` : undefined}
        icon="close-circle-outline"
        confirmLabel="Да, откажи"
        cancelLabel="Не"
        destructive
        loading={cancelling}
        onConfirm={cancel}
        onCancel={() => (cancelling ? null : setPending(null))}
      />
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list:   { padding: spacing.md, paddingBottom: spacing.xxl },
    header: { marginTop: spacing.sm, marginBottom: spacing.md },
    headerSkeleton: { marginTop: spacing.sm, marginBottom: spacing.md },
    skeletonWrap:   { flex: 1, padding: spacing.md },
    headerTitle: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.text },
    headerSub:   { fontSize: font.size.sm,  color: colors.textMuted, marginTop: 2 },
    segmentWrap: { marginTop: spacing.md },

    row:      { flexDirection: 'row', alignItems: 'flex-start' },
    body:     { flex: 1, marginLeft: spacing.md },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.xs + 2, gap: spacing.sm },
    title:    { fontSize: font.size.lg, fontWeight: font.bold, color: colors.text, flex: 1, lineHeight: 22 },
  });
}
