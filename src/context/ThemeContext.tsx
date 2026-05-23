import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveColors, ThemeColors, ThemeMode, lightColors } from '../theme';

type Ctx = {
  mode: ThemeMode;            // user choice
  setMode: (m: ThemeMode) => void;
  colors: ThemeColors;        // resolved palette
  isDark: boolean;
};

const STORAGE_KEY = 'gatherly_theme';

const ThemeContext = createContext<Ctx>({
  mode: 'system',
  setMode: () => {},
  colors: lightColors,
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);

  // Зареждане на запазена тема
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } catch {}
      setHydrated(true);
    })();
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
    // Sync с native appearance (за модали/native компоненти)
    (Appearance.setColorScheme as any)(next === 'system' ? null : next);
  };

  const value = useMemo<Ctx>(() => {
    const normalizedScheme: 'light' | 'dark' | null =
      systemScheme === 'dark' || systemScheme === 'light' ? systemScheme : null;
    const colors = resolveColors(mode, normalizedScheme);
    const effective = mode === 'system' ? (normalizedScheme ?? 'light') : mode;
    return { mode, setMode, colors, isDark: effective === 'dark' };
  }, [mode, systemScheme]);

  // Изчакваме хидрация, за да не блесне грешна тема
  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
