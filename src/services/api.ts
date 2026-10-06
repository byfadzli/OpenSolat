import AsyncStorage from '@react-native-async-storage/async-storage';
import { JakimZone, getZoneByCode, findNearestZone } from '../constants/jakimZones';
import {
  calculateAstronomicalPrayerTimes,
  getEstimatedHijriDate,
} from '../utils/calculations';

export interface PrayerDayItem {
  date: string; // ISO date 'YYYY-MM-DD' or 'DD-MMM-YYYY'
  day: string;
  hijri: string;
  imsak: string;
  subuh: string;
  syuruk: string;
  dhuha: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
}

export interface TodayPrayerTimes {
  date: string;
  day: string;
  hijri: string;
  zone: JakimZone;
  imsak: string;
  subuh: string;
  syuruk: string;
  dhuha: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
  isOfflineFallback: boolean;
}

const CACHE_PREFIX = '@opensolat_cache_year_';

/**
 * Format Date to YYYY-MM-DD
 */
export const formatDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse any date string like "04-Oct-2026", "2026-10-04", "04/10/2026" into "YYYY-MM-DD"
 */
const normalizeDateStringToKey = (dateStr: string): string => {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return formatDateKey(parsed);
  }

  // Handle "04-Oct-2026"
  const parts = dateStr.split(/[-/\s]/);
  if (parts.length === 3) {
    const monthMap: Record<string, string> = {
      jan: '01',
      feb: '02',
      mar: '03',
      apr: '04',
      may: '05',
      jun: '06',
      jul: '07',
      aug: '08',
      sep: '09',
      oct: '10',
      nov: '11',
      dec: '12',
    };
    const day = parts[0].padStart(2, '0');
    const m = monthMap[parts[1].toLowerCase().slice(0, 3)] || '01';
    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    return `${year}-${m}-${day}`;
  }
  return dateStr;
};

/**
 * Clean "05:45:00" to "05:45"
 */
const trimSeconds = (timeStr: string): string => {
  if (!timeStr) return '--:--';
  const parts = timeStr.trim().split(':');
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeStr;
};

/**
 * Generates an entire year of prayer times mathematically if completely offline on first launch.
 */
export const generateYearlyMathematicalFallback = (
  zone: JakimZone,
  year: number
): PrayerDayItem[] => {
  const result: PrayerDayItem[] = [];
  const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dayNames = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

  for (let m = 0; m < 12; m++) {
    const maxDays = daysInMonth[m];
    for (let d = 1; d <= maxDays; d++) {
      const date = new Date(year, m, d);
      const iso = formatDateKey(date);
      const astro = calculateAstronomicalPrayerTimes(zone.latitude, zone.longitude, date);
      const hijri = getEstimatedHijriDate(date);

      result.push({
        date: iso,
        day: dayNames[date.getDay()],
        hijri: hijri.formatted,
        imsak: astro.imsak,
        subuh: astro.subuh,
        syuruk: astro.syuruk,
        dhuha: astro.dhuha,
        zohor: astro.zohor,
        asar: astro.asar,
        maghrib: astro.maghrib,
        isyak: astro.isyak,
      });
    }
  }

  return result;
};

/**
 * Fetch full year prayer times from official JAKIM e-Solat API with local AsyncStorage caching.
 */
export const fetchYearlyPrayerTimes = async (
  zoneCode: string,
  targetYear?: number
): Promise<{ data: PrayerDayItem[]; isFromCache: boolean; isOfflineCalculated: boolean }> => {
  const zone = getZoneByCode(zoneCode);
  const year = targetYear || new Date().getFullYear();
  const cacheKey = `${CACHE_PREFIX}${zone.code}_${year}`;

  // 1. Try to read from local cache first for instant load
  let cachedPayload: string | null = null;
  try {
    cachedPayload = await AsyncStorage.getItem(cacheKey);
  } catch (err) {
    console.warn('AsyncStorage read error:', err);
  }

  // 2. Fetch fresh from JAKIM API with a 7-second timeout
  const apiUrl = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone=${encodeURIComponent(
    zone.code
  )}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'OpenSolat-Mobile/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && Array.isArray(json.prayerTime) && json.prayerTime.length > 0) {
        const parsedItems: PrayerDayItem[] = json.prayerTime.map((item: any) => ({
          date: normalizeDateStringToKey(item.date),
          day: item.day || '',
          hijri: item.hijri || '',
          imsak: trimSeconds(item.imsak),
          subuh: trimSeconds(item.fajr || item.subuh),
          syuruk: trimSeconds(item.syuruk),
          dhuha: trimSeconds(item.dhuha),
          zohor: trimSeconds(item.dhuhr || item.zohor),
          asar: trimSeconds(item.asr || item.asar),
          maghrib: trimSeconds(item.maghrib),
          isyak: trimSeconds(item.isha || item.isyak),
        }));

        // Cache full year payload locally
        await AsyncStorage.setItem(cacheKey, JSON.stringify(parsedItems));

        return {
          data: parsedItems,
          isFromCache: false,
          isOfflineCalculated: false,
        };
      }
    }
  } catch (netErr) {
    console.log('JAKIM API fetch failed or offline; using local cache/fallback:', netErr);
  }

  // If network failed but cache exists, use cache
  if (cachedPayload) {
    try {
      const parsed = JSON.parse(cachedPayload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          data: parsed,
          isFromCache: true,
          isOfflineCalculated: false,
        };
      }
    } catch (e) {
      console.warn('Error parsing cached prayer times:', e);
    }
  }

  // If no cache exists, use the robust astronomical fallback
  const calculated = generateYearlyMathematicalFallback(zone, year);
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(calculated));
  } catch (e) {
    // ignore
  }

  return {
    data: calculated,
    isFromCache: false,
    isOfflineCalculated: true,
  };
};

/**
 * Get prayer times for a specific date (defaults to today)
 */
export const getTodayPrayerTimes = async (
  zoneCode: string,
  targetDate: Date = new Date()
): Promise<TodayPrayerTimes> => {
  const zone = getZoneByCode(zoneCode);
  const targetYear = targetDate.getFullYear();
  const dateKey = formatDateKey(targetDate);

  const { data, isOfflineCalculated } = await fetchYearlyPrayerTimes(zone.code, targetYear);
  const match = data.find(item => item.date === dateKey || normalizeDateStringToKey(item.date) === dateKey);

  const dayNames = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

  if (match) {
    return {
      date: match.date,
      day: match.day || dayNames[targetDate.getDay()],
      hijri: match.hijri || getEstimatedHijriDate(targetDate).formatted,
      zone,
      imsak: match.imsak,
      subuh: match.subuh,
      syuruk: match.syuruk,
      dhuha: match.dhuha,
      zohor: match.zohor,
      asar: match.asar,
      maghrib: match.maghrib,
      isyak: match.isyak,
      isOfflineFallback: isOfflineCalculated,
    };
  }

  // Instant fallback for the day if not found
  const astro = calculateAstronomicalPrayerTimes(zone.latitude, zone.longitude, targetDate);
  const hijri = getEstimatedHijriDate(targetDate);

  return {
    date: dateKey,
    day: dayNames[targetDate.getDay()],
    hijri: hijri.formatted,
    zone,
    imsak: astro.imsak,
    subuh: astro.subuh,
    syuruk: astro.syuruk,
    dhuha: astro.dhuha,
    zohor: astro.zohor,
    asar: astro.asar,
    maghrib: astro.maghrib,
    isyak: astro.isyak,
    isOfflineFallback: true,
  };
};

export { findNearestZone };
