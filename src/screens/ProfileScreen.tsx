import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius, depth, rgba } from '../theme';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
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

      {/* Информация */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Данни за акаунта</Text>
        <InfoRow icon="mail-outline"      label="Имейл" value={user.email} />
        <View style={s.divider} />
        <InfoRow icon="shield-checkmark-outline" label="Роля" value={isOrganizer ? 'Организатор' : 'Потребител'} />
        <View style={s.divider} />
        <InfoRow icon="finger-print-outline" label="Идентификатор" value={`#${user.id}`} />
      </View>

      {/* Бранд карта */}
      <View style={[s.card, s.brandCard]}>
        <View style={s.brandRow}>
          <View style={s.brandLogo}>
            <Ionicons name="ticket" size={20} color={colors.textOnPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.brandTitle}>EventBook</Text>
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

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
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

const s = StyleSheet.create({
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
