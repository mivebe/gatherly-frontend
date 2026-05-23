/**
 * ─────────────────────────────────────────────────────────────────────
 * ДИЗАЙН СИСТЕМА  ·  EventBook
 * ─────────────────────────────────────────────────────────────────────
 * Архитектура вдъхновена от bekar-frontend.
 *   • BRAND секция за бърза промяна на палитрата
 *   • Отделни light/dark палитри (готови за бъдещ toggle)
 *   • 5-степенна дълбочина на сенки (level0 – level4)
 *   • 8px spacing grid, radius скала с full = 9999
 * ─────────────────────────────────────────────────────────────────────
 */

const BRAND = {
  hue:    '#0D9488', // teal-600
  accent: '#14B8A6', // teal-500
  warm:   '#F97316', // orange-500 (CTA / акценти)
};

// ─── Помощни ────────────────────────────────────────────────────────
function fade(hex: string, amount = 0.88): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const m = (c: number) => Math.round(c + (255 - c) * amount);
  return `#${[m(r), m(g), m(b)].map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Hex → rgba */
export function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── LIGHT THEME (default) ──────────────────────────────────────────
export const lightColors = {
  primary:       BRAND.hue,
  primaryDark:   '#0B7269',
  primaryLight:  BRAND.accent,
  primaryFaded:  fade(BRAND.hue, 0.90),
  primarySoft:   fade(BRAND.hue, 0.82),

  secondary:     BRAND.warm,
  secondaryDark: '#C2410C',
  secondaryFaded:'#FFEDD5',

  background:          '#F7F8FA',
  backgroundSecondary: '#EFF1F5',
  backgroundTertiary:  '#E4E7EC',

  surface:       '#FFFFFF',
  surfaceLight:  '#FAFBFC',
  surfaceAlt:    '#F4F6F8',

  text:          '#0F172A',
  textSecondary: '#475569',
  textMuted:     '#94A3B8',
  textOnPrimary: '#FFFFFF',

  success:       '#16A34A',
  successFaded:  '#DCFCE7',
  warning:       '#EA580C',
  warningFaded:  '#FFEDD5',
  danger:        '#DC2626',
  dangerFaded:   '#FEE2E2',
  info:          '#0891B2',
  infoFaded:     '#CFFAFE',

  border:        '#E2E8F0',
  borderLight:   '#EEF1F5',

  overlay:       'rgba(15,23,42,0.45)',
  shimmer:       '#EBEEF2',
};

// ─── DARK THEME (готов за бъдещо превключване) ──────────────────────
export const darkColors = {
  primary:       BRAND.accent,
  primaryDark:   BRAND.hue,
  primaryLight:  '#2DD4BF',
  primaryFaded:  '#0D2A2A',
  primarySoft:   '#103838',

  secondary:     BRAND.warm,
  secondaryDark: '#C2410C',
  secondaryFaded:'#3B1D08',

  background:          '#0B0F14',
  backgroundSecondary: '#12171F',
  backgroundTertiary:  '#1A2029',

  surface:       '#161C25',
  surfaceLight:  '#1E2530',
  surfaceAlt:    '#1A222D',

  text:          '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted:     '#64748B',
  textOnPrimary: '#0B0F14',

  success:       '#4ADE80',
  successFaded:  '#0E2A1A',
  warning:       '#FB923C',
  warningFaded:  '#2E1B0B',
  danger:        '#F87171',
  dangerFaded:   '#311414',
  info:          '#22D3EE',
  infoFaded:     '#0F2A30',

  border:        '#293340',
  borderLight:   '#1F2733',

  overlay:       'rgba(0,0,0,0.6)',
  shimmer:       '#1F2733',
};

// ─── Активна палитра + legacy aliases ──────────────────────────────
const active = lightColors;
export const colors = {
  ...active,
  // Legacy aliases (запазват backwards compatibility)
  textPrimary: active.text,
  inputBg:     active.surface,
};

// ─── SPACING (8px grid) ─────────────────────────────────────────────
export const spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
};

// ─── ЗАКРЪГЛЕНИЯ ─────────────────────────────────────────────────────
export const radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  full: 9999,
};

// ─── ТИПОГРАФИЯ ──────────────────────────────────────────────────────
export const font = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
  heavy:    '800' as const,

  size: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   17,
    xl:   20,
    xxl:  26,
    hero: 34,
  },

  leading: {
    tight:  1.2,
    normal: 1.5,
    loose:  1.7,
  },
};

// ─── 5-СТЕПЕННА ДЪЛБОЧИНА (bekar-style) ─────────────────────────────
export const depth = {
  /** Flat – минимално разделяне */
  level0: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  /** Low – леко повдигнати карти */
  level1: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  /** Medium – стандартни карти */
  level2: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  /** High – плаващи елементи (FAB, модали) */
  level3: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 8,
  },
  /** Highest – CTA, hero банери */
  level4: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 14,
  },
};

/** Backwards-compatible aliases */
export const shadow = {
  sm: depth.level0,
  md: depth.level2,
  lg: depth.level3,
};
export const cardShadow = depth.level2;

// ─── НАВИГАЦИЯ ───────────────────────────────────────────────────────
export const nav = {
  headerBg:      colors.surface,
  headerTint:    colors.text,
  tabActiveTint: colors.primary,
  tabBarHeight:  60,
};

// ─── АНИМАЦИЯ (timing стойности) ─────────────────────────────────────
export const animation = {
  fast:    150,
  normal:  300,
  slow:    500,
  stagger: 80,
};
