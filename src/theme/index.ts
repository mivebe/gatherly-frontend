/**
 * ─────────────────────────────────────────────────────────────────────
 * ДИЗАЙН СИСТЕМА  ·  EventBook
 * ─────────────────────────────────────────────────────────────────────
 *
 * Архитектура, вдъхновена от bekar-frontend:
 *   • BRAND секция за бърза промяна на палитрата
 *   • Отделни dark/light палитри (готови за бъдещ toggle)
 *   • 5-степенна дълбочина на сенки (level0 – level4)
 *   • Spacing на 8px grid (xs 4, sm 8, md 16, lg 24 …)
 *   • borderRadius скала с full = 9999
 *
 * ░░░  BRAND – ПРОМЕНЯЙТЕ САМО ТУК  ░░░
 * ─────────────────────────────────────────────────────────────────────
 *   Синя  (по подразбиране):  hue '#1F3864', accent '#3B82F6'
 *   Тийл:                     hue '#00796B', accent '#26A69A'
 *   Индиго:                   hue '#283593', accent '#5C6BC0'
 *   Зелена:                   hue '#1B5E20', accent '#43A047'
 *   Кехлибар:                 hue '#5D4037', accent '#F4A623'
 * ─────────────────────────────────────────────────────────────────────
 */

const BRAND = {
  hue:    '#1F3864',
  accent: '#3B82F6',
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
  primaryDark:   BRAND.hue,
  primaryLight:  BRAND.accent,
  primaryFaded:  fade(BRAND.hue, 0.90),

  secondary:     '#F59E0B',
  secondaryFaded:'#FEF3C7',

  background:          '#F5F6FA',
  backgroundSecondary: '#EDEEF3',
  backgroundTertiary:  '#E2E4EA',

  surface:       '#FFFFFF',
  surfaceLight:  '#FAFAFC',

  text:          '#1A1D26',
  textSecondary: '#5A6275',
  textMuted:     '#9CA3B4',
  textOnPrimary: '#FFFFFF',

  success:       '#16A34A',
  successFaded:  '#DCFCE7',
  warning:       '#D97706',
  warningFaded:  '#FEF3C7',
  danger:        '#DC2626',
  dangerFaded:   '#FEE2E2',
  info:          BRAND.accent,
  infoFaded:     fade(BRAND.accent, 0.90),

  border:        '#D4D8E1',
  borderLight:   '#EBEDF2',

  overlay:       'rgba(0,0,0,0.35)',
  shimmer:       '#E8EAF0',
};

// ─── DARK THEME (готов за бъдещо превключване) ──────────────────────
export const darkColors = {
  primary:       '#3B82F6',
  primaryDark:   '#2563EB',
  primaryLight:  '#60A5FA',
  primaryFaded:  '#1E293B',

  secondary:     '#F59E0B',
  secondaryFaded:'#422006',

  background:          '#0F1117',
  backgroundSecondary: '#181B24',
  backgroundTertiary:  '#232730',

  surface:       '#1E2130',
  surfaceLight:  '#282C3A',

  text:          '#F1F2F6',
  textSecondary: '#9CA3B4',
  textMuted:     '#5A6275',
  textOnPrimary: '#FFFFFF',

  success:       '#4ADE80',
  successFaded:  '#14291D',
  warning:       '#FBBF24',
  warningFaded:  '#3B2A08',
  danger:        '#F87171',
  dangerFaded:   '#3B1414',
  info:          '#60A5FA',
  infoFaded:     '#1C2A4A',

  border:        '#2D3344',
  borderLight:   '#3A4055',

  overlay:       'rgba(0,0,0,0.55)',
  shimmer:       '#2D3344',
};

// ─── Активна палитра ────────────────────────────────────────────────
export const colors = lightColors;

// ─── SPACING (8px grid, като bekar) ─────────────────────────────────
export const spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
};

// ─── ЗАКРЪГЛЕНИЯ ─────────────────────────────────────────────────────
export const radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 9999,
};

// ─── ТИПОГРАФИЯ ──────────────────────────────────────────────────────
export const font = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,

  size: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   17,
    xl:   20,
    xxl:  26,
    hero: 32,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  /** Low – леко повдигнати карти */
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  /** Medium – стандартни карти */
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  /** High – плаващи елементи (FAB, модали) */
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  /** Highest – CTA, hero банери */
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
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
  tabBarHeight:  64,
};

// ─── АНИМАЦИЯ (timing стойности) ─────────────────────────────────────
export const animation = {
  fast:    150,
  normal:  300,
  slow:    500,
  stagger: 80,
};
