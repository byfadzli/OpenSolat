import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCENT_COLORS, ColorPalette, getThemeColors, AccentOption } from '../constants/themeColors';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (val: boolean) => void;
  accentKey: string;
  setAccentKey: (key: string) => void;
  colors: ColorPalette;
  accent: AccentOption;
  isReady: boolean;
}

const THEME_STORAGE_KEY = '@opensolat_theme_mode';
const ACCENT_STORAGE_KEY = '@opensolat_accent_key';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(true); // Default to True Dark
  const [accentKey, setAccentKeyState] = useState<string>('teal');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const storedAccent = await AsyncStorage.getItem(ACCENT_STORAGE_KEY);

        if (storedTheme !== null) {
          setIsDark(storedTheme === 'dark');
        } else if (systemColorScheme) {
          setIsDark(systemColorScheme === 'dark');
        }

        if (storedAccent !== null && ACCENT_COLORS.some(a => a.key === storedAccent)) {
          setAccentKeyState(storedAccent);
        }
      } catch (err) {
        console.warn('Failed to load theme settings from storage:', err);
      } finally {
        setIsReady(true);
      }
    };

    loadSettings();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  };

  const setDarkMode = async (val: boolean) => {
    setIsDark(val);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, val ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  };

  const setAccentKey = async (key: string) => {
    if (ACCENT_COLORS.some(a => a.key === key)) {
      setAccentKeyState(key);
      try {
        await AsyncStorage.setItem(ACCENT_STORAGE_KEY, key);
      } catch (e) {
        console.warn('Failed to save accent:', e);
      }
    }
  };

  const colors = useMemo(() => getThemeColors(isDark, accentKey), [isDark, accentKey]);
  const accent = useMemo(
    () => ACCENT_COLORS.find(a => a.key === accentKey) || ACCENT_COLORS[0],
    [accentKey]
  );

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        setDarkMode,
        accentKey,
        setAccentKey,
        colors,
        accent,
        isReady,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
