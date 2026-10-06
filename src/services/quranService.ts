import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_114_SURAHS, QuranSurahMetadata } from '../constants/quranSurahsList';
import { BUNDLED_QURAN_SURAHS, BundledSurahData } from '../constants/quranData';

export interface QuranVerseItem {
  verseNumber: number;
  arabic: string;
  rumi?: string;
  translationMalay: string;
  translationEn: string;
}

export interface FullSurahDetails {
  metadata: QuranSurahMetadata;
  verses: QuranVerseItem[];
  isFromOfflineCache: boolean;
}

const CACHE_PREFIX = '@opensolat_quran_surah_';

/**
 * Fetch full verses for any of the 114 Surahs.
 * Checks bundled offline data first, then local AsyncStorage cache, and finally the verified API.
 */
export async function getSurahWithVerses(
  surahNumber: number
): Promise<FullSurahDetails> {
  const metadata =
    ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];

  // 1. Check if we have complete offline bundled data
  const bundled = BUNDLED_QURAN_SURAHS[surahNumber];
  if (bundled && bundled.isComplete) {
    return {
      metadata,
      verses: bundled.verses,
      isFromOfflineCache: true,
    };
  }

  // 2. Check local AsyncStorage cache
  const cacheKey = `${CACHE_PREFIX}${surahNumber}`;
  try {
    const cachedStr = await AsyncStorage.getItem(cacheKey);
    if (cachedStr) {
      const parsedVerses: QuranVerseItem[] = JSON.parse(cachedStr);
      if (Array.isArray(parsedVerses) && parsedVerses.length > 0) {
        return {
          metadata,
          verses: parsedVerses,
          isFromOfflineCache: true,
        };
      }
    }
  } catch (err) {
    console.warn('AsyncStorage read error for surah cache:', err);
  }

  // 3. Fetch from verified Quran API (Uthmani Arabic text, Sahih International English, Basmeih Malay)
  const apiUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,ms.basmeih`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && json.data && Array.isArray(json.data) && json.data.length >= 3) {
        const arabicVerses = json.data[0].ayahs || [];
        const englishVerses = json.data[1].ayahs || [];
        const malayVerses = json.data[2].ayahs || [];

        const mergedVerses: QuranVerseItem[] = arabicVerses.map(
          (item: any, idx: number) => {
            const enText = englishVerses[idx]?.text || '';
            const msText = malayVerses[idx]?.text || '';
            return {
              verseNumber: item.numberInSurah,
              arabic: item.text,
              translationMalay: msText,
              translationEn: enText,
            };
          }
        );

        // Save to cache for instant offline access in future
        await AsyncStorage.setItem(cacheKey, JSON.stringify(mergedVerses));

        return {
          metadata,
          verses: mergedVerses,
          isFromOfflineCache: false,
        };
      }
    }
  } catch (netErr) {
    console.log(`Quran API fetch error for surah ${surahNumber}:`, netErr);
  }

  // 4. If offline and not in cache, fallback to bundled verses (even if partial) or placeholder
  if (bundled && bundled.verses.length > 0) {
    return {
      metadata,
      verses: bundled.verses,
      isFromOfflineCache: true,
    };
  }

  return {
    metadata,
    verses: [
      {
        verseNumber: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translationMalay: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      },
    ],
    isFromOfflineCache: false,
  };
}
