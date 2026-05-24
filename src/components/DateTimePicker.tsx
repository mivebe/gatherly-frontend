import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable, TouchableOpacity,
  FlatList, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { radius, spacing, font, depth, rgba, ThemeColors } from '../theme';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

type Props = {
  visible: boolean;
  value: Date;
  minimumDate?: Date;
  onCancel: () => void;
  onConfirm: (next: Date) => void;
  title?: string;
};

const ROW_HEIGHT = 44;
const ROWS_VISIBLE = 5;
const PAD_ROWS = Math.floor(ROWS_VISIBLE / 2);
const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function pad(n: number) { return String(n).padStart(2, '0'); }
function dateOnlyKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function DateTimePicker({
  visible, value, minimumDate, onCancel, onConfirm, title = 'Изберете дата и час',
}: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);

  const [date, setDate] = useState<Date>(value);
  const [hour, setHour] = useState<number>(value.getHours());
  const [minute, setMinute] = useState<number>(Math.round(value.getMinutes() / 5) * 5 % 60);

  useEffect(() => {
    if (visible) {
      setDate(value);
      setHour(value.getHours());
      setMinute(Math.round(value.getMinutes() / 5) * 5 % 60);
    }
  }, [visible, value]);

  const hourRef   = useRef<FlatList<number>>(null);
  const minuteRef = useRef<FlatList<number>>(null);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      hourRef.current?.scrollToOffset({ offset: hour * ROW_HEIGHT, animated: false });
      const mIndex = MINUTES.indexOf(minute);
      minuteRef.current?.scrollToOffset({ offset: (mIndex < 0 ? 0 : mIndex) * ROW_HEIGHT, animated: false });
    }, 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    list: number[],
    setter: (n: number) => void,
  ) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ROW_HEIGHT);
    const clamped = Math.max(0, Math.min(list.length - 1, idx));
    setter(list[clamped]);
  };

  const confirm = () => {
    const next = new Date(date);
    next.setHours(hour, minute, 0, 0);
    onConfirm(next);
  };

  const minKey = minimumDate ? dateOnlyKey(minimumDate) : undefined;
  const selectedKey = dateOnlyKey(date);

  const marked: any = {
    [selectedKey]: {
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: colors.textOnPrimary,
    },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={s.backdrop} onPress={onCancel}>
        <Pressable style={s.cardWrap} onPress={() => {}}>
          <View style={s.card}>
            <View style={s.headerRow}>
              <View style={s.headerIcon}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
              </View>
              <Text style={s.title}>{title}</Text>
              <TouchableOpacity onPress={onCancel} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Calendar
              current={selectedKey}
              minDate={minKey}
              markedDates={marked}
              onDayPress={(d: any) => {
                const next = new Date(date);
                const [y, m, day] = d.dateString.split('-').map(Number);
                next.setFullYear(y, m - 1, day);
                setDate(next);
              }}
              theme={{
                calendarBackground:   colors.surface,
                todayTextColor:       colors.primary,
                todayBackgroundColor: colors.primaryFaded,
                arrowColor:           colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor:       colors.textOnPrimary,
                textDayFontSize:        font.size.sm,
                textMonthFontSize:      font.size.md,
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

            <Text style={s.timeLabel}>Час</Text>
            <View style={s.timeRow}>
              <Wheel
                ref={hourRef}
                values={HOURS}
                onIndexChange={(e) => handleScrollEnd(e, HOURS, setHour)}
                renderItem={(n) => pad(n)}
                colors={colors}
                styles={s}
              />
              <Text style={s.timeSep}>:</Text>
              <Wheel
                ref={minuteRef}
                values={MINUTES}
                onIndexChange={(e) => handleScrollEnd(e, MINUTES, setMinute)}
                renderItem={(n) => pad(n)}
                colors={colors}
                styles={s}
              />
            </View>

            <View style={s.preview}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={s.previewText}>
                {date.toLocaleDateString('bg-BG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} · {pad(hour)}:{pad(minute)}
              </Text>
            </View>

            <View style={s.actions}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.85}>
                  <Text style={s.cancelLabel}>Откажи</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Button label="Готово" onPress={confirm} size="md" icon="checkmark" />
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type WheelProps = {
  values: number[];
  onIndexChange: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  renderItem: (n: number) => string;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
};

const Wheel = React.forwardRef<FlatList<number>, WheelProps>(
  ({ values, onIndexChange, renderItem, colors, styles }, ref) => {
    return (
      <View style={styles.wheelWrap}>
        <View pointerEvents="none" style={styles.wheelHighlight} />
        <FlatList
          ref={ref}
          data={values}
          keyExtractor={(n) => String(n)}
          showsVerticalScrollIndicator={false}
          snapToInterval={ROW_HEIGHT}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
          onMomentumScrollEnd={onIndexChange}
          contentContainerStyle={{ paddingVertical: PAD_ROWS * ROW_HEIGHT }}
          renderItem={({ item }) => (
            <View style={styles.wheelRow}>
              <Text style={[styles.wheelText, { color: colors.text }]}>{renderItem(item)}</Text>
            </View>
          )}
        />
      </View>
    );
  },
);

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
      backgroundColor: colors.overlay, paddingHorizontal: spacing.md,
    },
    cardWrap: { width: '100%', maxWidth: 420 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level4,
    },
    headerRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.xs, marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    headerIcon: {
      width: 32, height: 32, borderRadius: radius.sm,
      backgroundColor: rgba(colors.primary, 0.12),
      alignItems: 'center', justifyContent: 'center',
    },
    title: { flex: 1, fontSize: font.size.lg, fontWeight: font.bold, color: colors.text },

    calendar: { borderRadius: radius.md, marginBottom: spacing.sm },

    timeLabel: {
      fontSize: font.size.xs, fontWeight: font.bold, color: colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 1,
      marginTop: spacing.sm, marginLeft: spacing.xs,
    },
    timeRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      marginTop: spacing.xs,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      paddingVertical: spacing.xs,
    },
    timeSep: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.text, marginHorizontal: spacing.sm },

    wheelWrap: { height: ROW_HEIGHT * ROWS_VISIBLE, width: 70, justifyContent: 'center' },
    wheelHighlight: {
      position: 'absolute',
      top: PAD_ROWS * ROW_HEIGHT,
      left: 0, right: 0,
      height: ROW_HEIGHT,
      borderTopWidth: 1, borderBottomWidth: 1,
      borderColor: rgba(colors.primary, 0.35),
      backgroundColor: rgba(colors.primary, 0.06),
    },
    wheelRow: { height: ROW_HEIGHT, alignItems: 'center', justifyContent: 'center' },
    wheelText: { fontSize: font.size.xl, fontWeight: font.semibold },

    preview: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2,
      marginTop: spacing.md,
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
      backgroundColor: rgba(colors.primary, 0.08),
      borderRadius: radius.md,
    },
    previewText: { fontSize: font.size.sm, fontWeight: font.semibold, color: colors.primary, flex: 1 },

    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
    cancelBtn: {
      paddingVertical: spacing.md - 2, paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    cancelLabel: { color: colors.text, fontWeight: font.semibold, fontSize: font.size.md, letterSpacing: 0.2 },
  });
}
