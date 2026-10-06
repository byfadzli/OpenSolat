import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { JakimZone, DEFAULT_ZONE, getZoneByCode, findNearestZone } from '../constants/jakimZones';
import {
  fetchYearlyPrayerTimes,
  getTodayPrayerTimes,
  TodayPrayerTimes,
  PrayerDayItem,
  formatDateKey,
} from '../services/api';
import {
  parsePrayerTimeToDate,
  formatDurationCountdown,
} from '../utils/calculations';
import { loadAlarmPreferences, schedulePrayerNotifications } from '../services/notificationService';
import { syncAppToWidget } from '../widgets/widgetDataHelper';

export interface NextPrayerInfo {
  name: string;
  nameMalay: string;
  time: string;
  remainingSeconds: number;
  formattedCountdown: string;
  progress: number;
  currentPrayerName: string;
}

const ZONE_STORAGE_KEY = '@opensolat_selected_zone';
const AUTO_GPS_KEY = '@opensolat_auto_gps';

export const usePrayerTimes = () => {
  const [currentZone, setCurrentZone] = useState<JakimZone>(DEFAULT_ZONE);
  const [isAutoLocation, setIsAutoLocationState] = useState<boolean>(true);
  const [todayTimes, setTodayTimes] = useState<TodayPrayerTimes | null>(null);
  const [yearlyData, setYearlyData] = useState<PrayerDayItem[]>([]);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Compute Next Prayer and Progress
  const computeNextPrayer = useCallback((times: TodayPrayerTimes | null): NextPrayerInfo | null => {
    if (!times) return null;

    const now = new Date();
    const prayerList = [
      { name: 'Imsak', timeStr: times.imsak },
      { name: 'Subuh', timeStr: times.subuh },
      { name: 'Syuruk', timeStr: times.syuruk },
      { name: 'Dhuha', timeStr: times.dhuha },
      { name: 'Zohor', timeStr: times.zohor },
      { name: 'Asar', timeStr: times.asar },
      { name: 'Maghrib', timeStr: times.maghrib },
      { name: 'Isyak', timeStr: times.isyak },
    ];

    const parsedPrayers = prayerList.map(p => ({
      name: p.name,
      timeStr: p.timeStr,
      date: parsePrayerTimeToDate(p.timeStr, now),
    }));

    let nextIndex = -1;
    for (let i = 0; i < parsedPrayers.length; i++) {
      if (parsedPrayers[i].date.getTime() > now.getTime()) {
        nextIndex = i;
        break;
      }
    }

    // If all prayers have passed today, the next prayer is tomorrow's Imsak / Subuh
    if (nextIndex === -1) {
      const tomorrowImsak = new Date(parsedPrayers[0].date);
      tomorrowImsak.setDate(tomorrowImsak.getDate() + 1);

      const isyakTime = parsedPrayers[parsedPrayers.length - 1].date.getTime();
      const totalSpan = tomorrowImsak.getTime() - isyakTime;
      const elapsed = now.getTime() - isyakTime;
      const progress = Math.min(1, Math.max(0, elapsed / totalSpan));
      const remainingSeconds = Math.max(0, Math.floor((tomorrowImsak.getTime() - now.getTime()) / 1000));

      return {
        name: 'Imsak',
        nameMalay: 'Waktu Imsak (Esok)',
        time: times.imsak,
        remainingSeconds,
        formattedCountdown: formatDurationCountdown(remainingSeconds),
        progress,
        currentPrayerName: 'Isyak',
      };
    }

    const nextTarget = parsedPrayers[nextIndex];
    const prevTarget = nextIndex > 0 ? parsedPrayers[nextIndex - 1] : null;

    const remainingSeconds = Math.max(0, Math.floor((nextTarget.date.getTime() - now.getTime()) / 1000));

    let progress = 0;
    if (prevTarget) {
      const totalSpan = nextTarget.date.getTime() - prevTarget.date.getTime();
      const elapsed = now.getTime() - prevTarget.date.getTime();
      progress = Math.min(1, Math.max(0, elapsed / totalSpan));
    } else {
      progress = 0.5;
    }

    const currentPrayerName = prevTarget ? prevTarget.name : 'Malam';

    return {
      name: nextTarget.name,
      nameMalay: `Waktu ${nextTarget.name}`,
      time: nextTarget.timeStr,
      remainingSeconds,
      formattedCountdown: formatDurationCountdown(remainingSeconds),
      progress,
      currentPrayerName,
    };
  }, []);

  // Load Prayer Data for Zone
  const loadDataForZone = useCallback(async (zone: JakimZone) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const today = await getTodayPrayerTimes(zone.code, now);
      setTodayTimes(today);

      const next = computeNextPrayer(today);
      setNextPrayer(next);

      // Background load full year Takwim
      fetchYearlyPrayerTimes(zone.code, now.getFullYear()).then(result => {
        setYearlyData(result.data);
      });

      // Reschedule notifications for the new times
      loadAlarmPreferences().then(prefs => {
        schedulePrayerNotifications(today, prefs);
      });

      // Sync data to Android Home Screen Widget
      syncAppToWidget(today, next);
    } catch (err) {
      console.warn('Error loading prayer times for zone:', err);
    } finally {
      setIsLoading(false);
    }
  }, [computeNextPrayer]);

  // Auto detect zone using device GPS
  const autoDetectZone = useCallback(async () => {
    try {
      setLocationError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Kebenaran lokasi tidak diberikan. Menggunakan zon lalai.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const detected = findNearestZone(loc.coords.latitude, loc.coords.longitude);
      setCurrentZone(detected);
      setIsAutoLocationState(true);

      await AsyncStorage.setItem(ZONE_STORAGE_KEY, detected.code);
      await AsyncStorage.setItem(AUTO_GPS_KEY, 'true');

      await loadDataForZone(detected);
    } catch (err) {
      console.warn('GPS detection failed:', err);
      setLocationError('Gagal mengesan lokasi GPS. Sila pilih zon secara manual.');
    }
  }, [loadDataForZone]);

  // Set Manual Zone
  const setZone = useCallback(
    async (zoneCode: string) => {
      const zone = getZoneByCode(zoneCode);
      setCurrentZone(zone);
      setIsAutoLocationState(false);
      try {
        await AsyncStorage.setItem(ZONE_STORAGE_KEY, zone.code);
        await AsyncStorage.setItem(AUTO_GPS_KEY, 'false');
      } catch (e) {
        console.warn('Error saving zone preference:', e);
      }
      await loadDataForZone(zone);
    },
    [loadDataForZone]
  );

  const setIsAutoLocation = useCallback(
    async (val: boolean) => {
      setIsAutoLocationState(val);
      await AsyncStorage.setItem(AUTO_GPS_KEY, val ? 'true' : 'false');
      if (val) {
        await autoDetectZone();
      }
    },
    [autoDetectZone]
  );

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedZone = await AsyncStorage.getItem(ZONE_STORAGE_KEY);
        const storedAutoGps = await AsyncStorage.getItem(AUTO_GPS_KEY);

        const useAuto = storedAutoGps === null ? true : storedAutoGps === 'true';
        setIsAutoLocationState(useAuto);

        if (useAuto) {
          await autoDetectZone();
        } else if (storedZone) {
          const zone = getZoneByCode(storedZone);
          setCurrentZone(zone);
          await loadDataForZone(zone);
        } else {
          await loadDataForZone(DEFAULT_ZONE);
        }
      } catch (err) {
        console.warn('Initialization error in usePrayerTimes:', err);
        await loadDataForZone(DEFAULT_ZONE);
      }
    };

    initialize();
  }, [autoDetectZone, loadDataForZone]);

  // Real-time 1-second countdown ticker
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      if (todayTimes) {
        setNextPrayer(computeNextPrayer(todayTimes));
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [todayTimes, computeNextPrayer]);

  const refresh = useCallback(async () => {
    if (isAutoLocation) {
      await autoDetectZone();
    } else {
      await loadDataForZone(currentZone);
    }
  }, [isAutoLocation, autoDetectZone, loadDataForZone, currentZone]);

  return {
    currentZone,
    setZone,
    isAutoLocation,
    setIsAutoLocation,
    autoDetectZone,
    todayTimes,
    nextPrayer,
    yearlyData,
    isLoading,
    locationError,
    refresh,
  };
};
