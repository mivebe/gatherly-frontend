import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { colors, spacing, font, radius, shadow } from '../theme';
import Card from '../components/Card';
import MetaRow from '../components/MetaRow';

// Кратка българска локализация за календара
LocaleConfig.locales['bg'] = {
  monthNames: ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'],
  monthNamesShort: ['Яну','Фев','Мар','Апр','Май','Юни','Юли','Авг','Сеп','Окт','Ное','Дек'],
  dayNames: ['Неделя','Понеделник','Вторник','Сряда','Четвъртък','Петък','Събота'],
  dayNamesShort: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
  today: 'Днес',
};
LocaleConfig.defaultLocale = 'bg';

export default function CalendarScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');

  const load = useCallback(async () => {
    setEvents(await api.listEvents());
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Подготовка на маркираните дати
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
      selectedTextColor: '#fff',
    };
  }

  const dayEvents = events.filter(e => new Date(e.start_at).toISOString().slice(0, 10) === selected);

  return (
    <View style={s.wrap}>
      <Calendar
        markedDates={marked}
        markingType="multi-dot"
        onDayPress={(d: any) => setSelected(d.dateString)}
        theme={{
          calendarBackground: colors.surface,
          todayTextColor: colors.primary,
          todayBackgroundColor: colors.primaryFaded,
          arrowColor: colors.primary,
          dotColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          textDayFontSize: font.size.sm,
          textMonthFontSize: font.size.lg,
          textMonthFontWeight: font.bold,
          textDayHeaderFontSize: font.size.xs,
          textDayHeaderFontWeight: font.semibold,
          textSectionTitleColor: colors.textMuted,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textMuted,
          monthTextColor: colors.textPrimary,
        }}
        style={s.calendar}
      />

      <ScrollView contentContainerStyle={s.list}>
        {selected ? (
          dayEvents.length ? (
            <>
              <Text style={s.dayLabel}>
                {new Date(selected + 'T00:00').toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
              {dayEvents.map(e => (
                <Card key={e.id} onPress={() => navigation.navigate('EventDetails', { id: e.id })}>
                  <Text style={s.cardTitle}>{e.title}</Text>
                  <MetaRow icon="time-outline" text={new Date(e.start_at).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })} />
                  {e.location ? <MetaRow icon="location-outline" text={e.location} /> : null}
                </Card>
              ))}
            </>
          ) : (
            <View style={s.emptyWrap}>
              <Text style={s.emptyText}>Няма събития на тази дата.</Text>
            </View>
          )
        ) : (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>Изберете дата от календара.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  calendar: { ...shadow.sm, marginBottom: spacing.xs },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  dayLabel: { fontSize: font.size.xs, fontWeight: font.semibold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md },
  cardTitle: { fontSize: font.size.md, fontWeight: font.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  emptyWrap: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: font.size.md },
});
