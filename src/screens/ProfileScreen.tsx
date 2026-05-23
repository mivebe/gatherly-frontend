import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, font, radius, shadow } from '../theme';
import Button from '../components/Button';

const logo = require('../../assets/logo.png');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <View style={s.wrap}>
      {/* Аватар */}
      <View style={s.avatarCircle}>
        <Text style={s.initials}>{initials}</Text>
      </View>

      <Text style={s.name}>{user.full_name}</Text>

      <View style={s.roleBadge}>
        <Ionicons name={user.role === 'organizer' ? 'briefcase' : 'person'} size={13} color={colors.primary} />
        <Text style={s.roleText}>{user.role === 'organizer' ? 'Организатор' : 'Потребител'}</Text>
      </View>

      {/* Info карта */}
      <View style={s.infoCard}>
        <InfoRow icon="mail-outline" label="Имейл" value={user.email} />
        <View style={s.divider} />
        <InfoRow icon="shield-checkmark-outline" label="Роля" value={user.role === 'organizer' ? 'Организатор' : 'Потребител'} />
      </View>

      <Button label="Изход от акаунта" variant="danger" onPress={logout} style={{ marginTop: spacing.xxl, width: '100%' }} />

      {/* Бранд */}
      <View style={s.brandWrap}>
        <Image source={logo} style={s.brandLogo} />
        <Text style={s.brandText}>EventBook v1.0</Text>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Ionicons name={icon} size={20} color={colors.textMuted} style={{ marginRight: spacing.md }} />
      <View>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.xxl, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },

  avatarCircle: {
    width: 88, height: 88, borderRadius: radius.full,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg, ...shadow.lg,
  },
  initials: { fontSize: font.size.hero, fontWeight: font.bold, color: '#fff' },

  name: { fontSize: font.size.xxl, fontWeight: font.bold, color: colors.textPrimary, marginBottom: spacing.sm },

  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2,
    backgroundColor: colors.primaryFaded, paddingHorizontal: spacing.md + 2, paddingVertical: spacing.xs + 3,
    borderRadius: radius.full, marginBottom: spacing.xxl,
  },
  roleText: { fontSize: font.size.sm, fontWeight: font.semibold, color: colors.primary },

  infoCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg,
    width: '100%', ...shadow.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  infoLabel: { fontSize: font.size.xs, color: colors.textMuted },
  infoValue: { fontSize: font.size.md, color: colors.textPrimary, fontWeight: font.medium, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },

  brandWrap: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xxxl, opacity: 0.5 },
  brandLogo: { width: 24, height: 24, marginRight: spacing.sm },
  brandText: { fontSize: font.size.xs, color: colors.textMuted },
});
