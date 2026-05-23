import React from 'react';
import { Platform, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, font, radius, depth } from '../theme';

const BASE_URL = (process.env.EXPO_BASE_URL ?? '').replace(/\/$/, '');
const APK_URL = `${BASE_URL}/gatherly.apk`;
const APK_FILENAME = 'gatherly.apk';

export default function GetTheAppButton() {
  const { colors } = useTheme();

  if (Platform.OS !== 'web') return null;

  const handlePress = () => {
    const a = document.createElement('a');
    a.href = APK_URL;
    a.download = APK_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <View pointerEvents="box-none" style={styles.anchor}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.btn,
          { backgroundColor: colors.secondary },
          depth.level2,
        ]}
      >
        <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: spacing.sm - 2 }} />
        <Text style={styles.label}>Свали приложението</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: ('fixed' as any),
    top: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: font.semibold,
    fontSize: font.size.sm,
    letterSpacing: 0.2,
  },
});
