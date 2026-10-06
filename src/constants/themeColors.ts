export interface AccentOption {
  key: string;
  name: string;
  color: string;
  lightVariant: string;
  softBg: string;
}

export const ACCENT_COLORS: AccentOption[] = [
  {
    key: 'teal',
    name: 'Classic Teal',
    color: '#146C7A',
    lightVariant: '#1E8A9C',
    softBg: 'rgba(20, 108, 122, 0.16)',
  },
  {
    key: 'gold',
    name: 'Ochre Gold',
    color: '#D4A373',
    lightVariant: '#E2BA91',
    softBg: 'rgba(212, 163, 115, 0.16)',
  },
  {
    key: 'emerald',
    name: 'Emerald Green',
    color: '#10B981',
    lightVariant: '#34D399',
    softBg: 'rgba(16, 185, 129, 0.16)',
  },
  {
    key: 'blue',
    name: 'Midnight Blue',
    color: '#2563EB',
    lightVariant: '#60A5FA',
    softBg: 'rgba(37, 99, 235, 0.16)',
  },
  {
    key: 'purple',
    name: 'Royal Purple',
    color: '#7C3AED',
    lightVariant: '#A78BFA',
    softBg: 'rgba(124, 58, 237, 0.16)',
  },
  {
    key: 'rose',
    name: 'Rose Red',
    color: '#E11D48',
    lightVariant: '#FB7185',
    softBg: 'rgba(225, 29, 72, 0.16)',
  },
  {
    key: 'amber',
    name: 'Amber Orange',
    color: '#F59E0B',
    lightVariant: '#FBBF24',
    softBg: 'rgba(245, 158, 11, 0.16)',
  },
];

export interface ColorPalette {
  background: string;
  card: string;
  cardElevated: string;
  surfaceSubtle: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentSoft: string;
  success: string;
  warning: string;
  danger: string;
  white: string;
  black: string;
}

export const getThemeColors = (isDark: boolean, accentKey: string): ColorPalette => {
  const accent = ACCENT_COLORS.find(a => a.key === accentKey) || ACCENT_COLORS[0];

  if (isDark) {
    return {
      background: '#121212',
      card: '#1E1E1E',
      cardElevated: '#252525',
      surfaceSubtle: '#2A2A2A',
      border: '#2E2E2E',
      borderSubtle: '#383838',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      accent: accent.color,
      accentLight: accent.lightVariant,
      accentSoft: accent.softBg,
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      white: '#FFFFFF',
      black: '#000000',
    };
  }

  return {
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardElevated: '#F1F5F9',
    surfaceSubtle: '#E2E8F0',
    border: '#E2E8F0',
    borderSubtle: '#CBD5E1',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    accent: accent.color,
    accentLight: accent.lightVariant,
    accentSoft: accent.softBg,
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    white: '#FFFFFF',
    black: '#000000',
  };
};
