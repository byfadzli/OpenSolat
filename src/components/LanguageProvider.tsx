import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, TRANSLATIONS, TranslationKey } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  isReady: boolean;
}

const LANGUAGE_STORAGE_KEY = '@opensolat_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bm');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'bm' || stored === 'en') {
          setLanguageState(stored);
        }
      } catch (e) {
        console.warn('Failed to load language preference:', e);
      } finally {
        setIsReady(true);
      }
    };

    loadStoredLanguage();
  }, []);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  };

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.bm;
      return dict[key] || TRANSLATIONS.bm[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
