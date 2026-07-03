import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth, rgba, ThemeColors } from '../theme';
import { ThemeMode } from '../theme';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: IoniconName }[] = [
  { mode: 'light',  label: 'Светла',  icon: 'sunny-outline' },
  { mode: 'dark',   label: 'Тъмна',   icon: 'moon-outline' },
  { mode: 'system', label: 'Системна', icon: 'phone-portrait-outline' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, mode, setMode } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);

  if (!user) return null;
  const isOrganizer = user.role === 'organizer';

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.wrap}>
      {/* Hero блок */}
      <View style={s.hero}>
        <View style={s.heroBg} />
        <View style={s.heroContent}>
          <Avatar name={user.full_name} size="xl" color={colors.primary} />
          <Text style={s.name}>{user.full_name}</Text>
          <Text style={s.email}>{user.email}</Text>
          <View style={{ marginTop: spacing.sm + 2 }}>
            <Badge
              label={isOrganizer ? 'Организатор' : 'Потребител'}
              variant={isOrganizer ? 'secondary' : 'primary'}
              icon={isOrganizer ? 'briefcase' : 'person'}
            />
          </View>
        </View>
      </View>

      {/* Данни */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Данни за акаунта</Text>
        <InfoRow icon="mail-outline"             label="Имейл"          value={user.email} />
        <View style={s.divider} />
        <InfoRow icon="shield-checkmark-outline" label="Роля"           value={isOrganizer ? 'Организатор' : 'Потребител'} />
        <View style={s.divider} />
        <InfoRow icon="finger-print-outline"     label="Идентификатор" value={`#${user.id}`} />
      </View>

      {/* Настройки */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Настройки</Text>

        <View style={s.settingRow}>
          <View style={s.settingHeader}>
            <View style={s.settingIcon}>
              <Ionicons name="color-palette-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.settingLabel}>Тема на приложението</Text>
              <Text style={s.settingHint}>Изберете предпочитан изглед</Text>
            </View>
          </View>

          <View style={s.themeRow}>
            {THEME_OPTIONS.map(opt => {
              const active = mode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    s.themeOpt,
                    active
                      ? { borderColor: colors.primary, backgroundColor: rgba(colors.primary, 0.08) }
                      : { borderColor: colors.border, backgroundColor: colors.surface },
                  ]}
                  onPress={() => setMode(opt.mode)}
                  activeOpacity={0.85}
                >
                  <View style={[s.themeIconBox, active && { backgroundColor: colors.primary }]}>
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={active ? colors.textOnPrimary : colors.textSecondary}
                    />
                  </View>
                  <Text style={[s.themeLabel, active && { color: colors.primary }]}>{opt.label}</Text>
                  {active && (
                    <View style={s.checkBadge}>
                      <Ionicons name="checkmark" size={11} color={colors.textOnPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Бранд */}
      <View style={[s.card, s.brandCard]}>
        <View style={s.brandRow}>
          <View style={s.brandLogo}>
            <Ionicons name="ticket" size={20} color={colors.textOnPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.brandTitle}>Gatherly</Text>
            <Text style={s.brandSub}>Версия 1.0 · резервации и събития</Text>
          </View>
        </View>
      </View>

      <Button
        label="Изход от акаунта"
        variant="outline"
        icon="log-out-outline"
        onPress={logout}
        size="lg"
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={s.infoRow}>
      <View style={s.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { padding: spacing.md, paddingBottom: spacing.xxl },

    hero: {
      borderRadius: radius.xl, overflow: 'hidden',
      marginBottom: spacing.md, padding: spacing.lg,
      alignItems: 'center',
      borderWidth: 1, borderColor: colors.borderLight,
      backgroundColor: colors.surface,
      ...depth.level2,
    },
    heroBg: {
      position: 'absolute', top: 0, left: 0, right: 0,
      backgroundColor: rgba(colors.primary, 0.06),
      height: 80,
    },
    heroContent: { alignItems: 'center', paddingTop: spacing.sm },
    name:  { fontSize: font.size.xl, fontWeight: font.bold, color: colors.text, marginTop: spacing.md },
    email: { fontSize: font.size.sm, color: colors.textMuted, marginTop: 2 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1, borderColor: colors.borderLight,
      ...depth.level1,
      marginBottom: spacing.md,
    },
    cardTitle: { fontSize: font.size.xs, fontWeight: font.bold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md },

    infoRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
    infoIcon: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primaryFaded, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    infoLabel:{ fontSize: font.size.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    infoValue:{ fontSize: font.size.md, color: colors.text, fontWeight: font.medium, marginTop: 1 },
    divider:  { height: 1, backgroundColor: colors.borderLight },

    // Settings
    settingRow:    { paddingVertical: spacing.xs },
    settingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    settingIcon: {
      width: 36, height: 36, borderRadius: radius.sm,
      backgroundColor: colors.primaryFaded,
      alignItems: 'center', justifyContent: 'center',
      marginRight: spacing.md,
    },
    settingLabel: { fontSize: font.size.md, fontWeight: font.semibold, color: colors.text },
    settingHint:  { fontSize: font.size.xs, color: colors.textMuted, marginTop: 1 },

    themeRow: { flexDirection: 'row', gap: spacing.sm },
    themeOpt: {
      flex: 1, borderWidth: 1.5, borderRadius: radius.md,
      padding: spacing.sm + 4, alignItems: 'center',
      position: 'relative',
    },
    themeIconBox: {
      width: 40, height: 40, borderRadius: radius.full,
      backgroundColor: colors.surfaceAlt,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    themeLabel: { fontSize: font.size.sm, fontWeight: font.semibold, color: colors.text },
    checkBadge: {
      position: 'absolute', top: 6, right: 6,
      width: 18, height: 18, borderRadius: 9,
      backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },

    // Brand
    brandCard: { paddingVertical: spacing.md },
    brandRow:  { flexDirection: 'row', alignItems: 'center' },
    brandLogo: {
      width: 40, height: 40, borderRadius: radius.sm,
      backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
      marginRight: spacing.md,
    },
    brandTitle: { fontSize: font.size.md, fontWeight: font.bold, color: colors.text },
    brandSub:   { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },
  });
}
