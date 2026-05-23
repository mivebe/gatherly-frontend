import { useEffect, useRef } from 'react';
import { Platform, TouchableOpacity, StyleSheet, View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, depth } from '../theme';

const RELEASE_BASE = 'https://github.com/mivebe/gatherly-frontend/releases/latest';
const APK_URL = `${RELEASE_BASE}/download/gatherly.apk`;
const IPA_URL = `${RELEASE_BASE}/download/gatherly.ipa`;
const SIZE = 44;

type DownloadTarget = { url: string; filename?: string; openInNewTab: boolean };

function resolveDownloadTarget(): DownloadTarget {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  if (/android/i.test(ua)) {
    return { url: APK_URL, filename: 'gatherly.apk', openInNewTab: false };
  }
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') && typeof document !== 'undefined' && 'ontouchend' in document);
  if (isIOS) {
    return { url: IPA_URL, filename: 'gatherly.ipa', openInNewTab: false };
  }
  return { url: RELEASE_BASE, openInNewTab: true };
}

export default function GetTheAppButton() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS !== 'web' || !user) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, user]);

  if (Platform.OS !== 'web' || !user) return null;

  const handlePress = () => {
    const { url, filename, openInNewTab } = resolveDownloadTarget();
    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <View pointerEvents="box-none" style={styles.anchor}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          accessibilityLabel="Свали приложението"
          style={[
            styles.btn,
            { backgroundColor: colors.secondary },
            depth.level2,
          ]}
        >
          <Ionicons name="download-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: ('fixed' as any),
    top: spacing.sm,
    right: spacing.md,
    zIndex: 9999,
  },
  btn: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
