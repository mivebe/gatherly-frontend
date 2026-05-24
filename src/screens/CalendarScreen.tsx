import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, ThemeColors } from '../theme';
import Card from '../components/Card';
import MetaRow from '../components/MetaRow';
import DateBadge from '../components/DateBadge';
import { SkeletonList } from '../components/Skeleton';

LocaleConfig.locales['bg'] = {
  monthNames: ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'],
  monthNamesShort: ['Яну','Фев','Мар','Апр','Май','Юни','Юли','Авг','Сеп','Окт','Ное','Дек'],
  dayNames: ['Неделя','Понеделник','Вторник','Сряда','Четвъртък','Петък','Събота'],
  dayNamesShort: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
  today: 'Днес',
};
LocaleConfig.defaultLocale = 'bg';

export default function CalendarScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [events, setEvents]     = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading]   = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const s = useMemo(() => createStyles(colors), [colors]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEvents(await api.listEvents()); }
    finally { setLoading(false); setInitialLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const marked: any = {};
  events.forEach(e => {
    const day = new Date(e.start_at).toISOString().slice(0, 10);
    if (!marked[day]) marked[day] = { dots: [] };
    marked[day].dots.push({ key: e.id, color: colors.primary });
  });
  if (selected) {
    marked[selected] = {
      ...(marked[selected] || {}),
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: colors.textOnPrimary,
    };
  }

  const dayEvents = events.filter(e => new Date(e.start_at).toISOString().slice(0, 10) === selected);

  return (
    <View style={s.wrap}>
      <View style={s.calendarCard}>
        <Calendar
          markedDates={marked}
          markingType="multi-dot"
          onDayPress={(d: any) => setSelected(d.dateString)}
          theme={{
            calendarBackground:   colors.surface,
            todayTextColor:       colors.primary,
            todayBackgroundColor: colors.primaryFaded,
            arrowColor:           colors.primary,
            dotColor:             colors.primary,
            selectedDayBackgroundColor: colors.primary,
            textDayFontSize:        font.size.sm,
            textMonthFontSize:      font.size.lg,
            textMonthFontWeight:    font.bold as any,
            textDayHeaderFontSize:  font.size.xs,
            textDayHeaderFontWeight:font.bold as any,
            textSectionTitleColor:  colors.textMuted,
            dayTextColor:           colors.text,
            textDisabledColor:      colors.textMuted,
            monthTextColor:         colors.text,
          }}
          style={s.calendar}
        />
      </View>

      <ScrollView
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
      >
        {initialLoading ? (
          <SkeletonList count={3} />
        ) : selected ? (
          dayEvents.length ? (
            <>
              <Text style={s.dayLabel}>
                {new Date(selected + 'T00:00').toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
              {dayEvents.map(e => {
                const d = new Date(e.start_at);
                return (
                  <Card key={e.id} onPress={() => navigation.navigate('EventDetails', { id: e.id })} accentColor={colors.primary} level={1}>
                    <View style={s.row}>
                      <DateBadge date={d} color={colors.primary} />
                      <View style={s.body}>
                        <Text style={s.cardTitle} numberOfLines={2}>{e.title}</Text>
                        <MetaRow icon="time-outline" text={d.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} dense />
                        {e.location ? <MetaRow icon="location-outline" text={e.location} dense /> : null}
                      </View>
                    </View>
                  </Card>
                );
              })}
            </>
          ) : (
            <View style={s.empty}>
              <Ionicons name="calendar-clear-outline" size={42} color={colors.textMuted} />
              <Text style={s.emptyText}>Няма събития на тази дата.</Text>
            </View>
          )
        ) : (
          <View style={s.empty}>
            <Ionicons name="calendar-outline" size={42} color={colors.textMuted} />
            <Text style={s.emptyText}>Изберете дата от календара.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.background },

    calendarCard: {
      margin: spacing.md,
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level1,
    },
    calendar: { paddingBottom: spacing.sm },

    list:     { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
    dayLabel: { fontSize: font.size.xs, fontWeight: font.bold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },

    row:       { flexDirection: 'row', alignItems: 'flex-start' },
    body:      { flex: 1, marginLeft: spacing.md },
    cardTitle: { fontSize: font.size.md, fontWeight: font.bold, color: colors.text, marginBottom: spacing.xs + 2 },

    empty:     { alignItems: 'center', paddingTop: spacing.xxl, opacity: 0.85 },
    emptyText: { color: colors.textMuted, fontSize: font.size.md, marginTop: spacing.sm + 2 },
  });
}
