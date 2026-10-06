import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodayPrayerTimes } from '../services/api';
import { NextPrayerInfo } from '../hooks/usePrayerTimes';
import { OpenSolatWidgetData, WidgetStyleType } from './OpenSolatWidget';

export const WIDGET_DATA_STORAGE_KEY = '@opensolat_home_widget_data';
export const WIDGET_STYLE_STORAGE_KEY = '@opensolat_widget_style';

export const getFallbackWidgetData = (): OpenSolatWidgetData => {
  return {
    style: 'classic_capsule',
    zoneCode: 'SGR01',
    zoneLocation: 'Shah Alam, Petaling Jaya',
    hijriDate: '14 Rabiulakhir 1448',
    gregorianDate: 'Ahad, 4 Okt 2026',
    nextPrayerName: 'Maghrib',
    nextPrayerTime: '19:18',
    countdown: '1j 24m',
    imsakTime: '05:38',
    prayers: [
      { name: 'Subuh', time: '05:58', isNext: false },
      { name: 'Syuruk', time: '07:05', isNext: false },
      { name: 'Zohor', time: '13:12', isNext: false },
      { name: 'Asar', time: '16:24', isNext: false },
      { name: 'Maghrib', time: '19:18', isNext: true },
      { name: 'Isyak', time: '20:27', isNext: false },
    ],
    lastUpdated: '20:00',
  };
};

/**
 * Get the saved widget style preference
 */
export const getSavedWidgetStyle = async (): Promise<WidgetStyleType> => {
  try {
    const saved = await AsyncStorage.getItem(WIDGET_STYLE_STORAGE_KEY);
    if (saved && (saved === 'classic_capsule' || saved === 'bold_banner' || saved === 'mysolat_green')) {
      return saved as WidgetStyleType;
    }
  } catch (e) {}
  return 'classic_capsule';
};

/**
 * Save widget style preference
 */
export const saveWidgetStyle = async (style: WidgetStyleType): Promise<void> => {
  try {
    await AsyncStorage.setItem(WIDGET_STYLE_STORAGE_KEY, style);
    // Also update current cached widget payload style
    const raw = await AsyncStorage.getItem(WIDGET_DATA_STORAGE_KEY);
    if (raw) {
      const data: OpenSolatWidgetData = JSON.parse(raw);
      data.style = style;
      await AsyncStorage.setItem(WIDGET_DATA_STORAGE_KEY, JSON.stringify(data));

      if (Platform.OS === 'android') {
        const { requestWidgetUpdate } = require('react-native-android-widget');
        const React = require('react');
        const { OpenSolatWidget } = require('./OpenSolatWidget');

        await requestWidgetUpdate({
          widgetName: 'OpenSolatWidget',
          renderWidget: () => React.createElement(OpenSolatWidget, { data }),
        });
      }
    }
  } catch (e) {
    console.warn('Error saving widget style:', e);
  }
};

/**
 * Format today's prayer times & next prayer into widget data structure
 */
export const buildWidgetData = (
  todayTimes: TodayPrayerTimes,
  nextPrayer: NextPrayerInfo | null,
  style: WidgetStyleType = 'classic_capsule'
): OpenSolatWidgetData => {
  const nextName = nextPrayer?.name || 'Solat';
  const nextTime = nextPrayer?.time || '';
  const countdown = nextPrayer?.formattedCountdown || '';

  const prayers = [
    { name: 'Subuh', time: todayTimes.subuh, isNext: nextName.toLowerCase() === 'subuh' },
    { name: 'Syuruk', time: todayTimes.syuruk, isNext: nextName.toLowerCase() === 'syuruk' },
    { name: 'Zohor', time: todayTimes.zohor, isNext: nextName.toLowerCase() === 'zohor' },
    { name: 'Asar', time: todayTimes.asar, isNext: nextName.toLowerCase() === 'asar' },
    { name: 'Maghrib', time: todayTimes.maghrib, isNext: nextName.toLowerCase() === 'maghrib' },
    { name: 'Isyak', time: todayTimes.isyak, isNext: nextName.toLowerCase() === 'isyak' },
  ];

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    style,
    zoneCode: todayTimes.zone.code,
    zoneLocation: todayTimes.zone.locations || todayTimes.zone.state || 'Malaysia',
    hijriDate: todayTimes.hijri || '',
    gregorianDate: `${todayTimes.day}, ${todayTimes.date}`,
    nextPrayerName: nextName,
    nextPrayerTime: nextTime,
    countdown,
    imsakTime: todayTimes.imsak || '05:38',
    prayers,
    lastUpdated: timeStr,
  };
};

/**
 * Save prayer data to cache and request an immediate Android home widget update
 */
export const syncAppToWidget = async (
  todayTimes: TodayPrayerTimes,
  nextPrayer: NextPrayerInfo | null
): Promise<void> => {
  try {
    const style = await getSavedWidgetStyle();
    const data = buildWidgetData(todayTimes, nextPrayer, style);
    await AsyncStorage.setItem(WIDGET_DATA_STORAGE_KEY, JSON.stringify(data));

    if (Platform.OS === 'android') {
      try {
        const { requestWidgetUpdate } = require('react-native-android-widget');
        const React = require('react');
        const { OpenSolatWidget } = require('./OpenSolatWidget');

        await requestWidgetUpdate({
          widgetName: 'OpenSolatWidget',
          renderWidget: () => React.createElement(OpenSolatWidget, { data }),
        });
      } catch (widgetUpdateErr) {
        // Safe to ignore if widget is not placed on home screen yet
      }
    }
  } catch (err) {
    console.warn('Failed to sync widget data:', err);
  }
};

/**
 * Trigger launcher prompt to pin the OpenSolat widget to home screen (Android 8.0+)
 */
export const pinOpenSolatWidget = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  try {
    const { requestPinWidget } = require('react-native-android-widget');
    return await requestPinWidget({
      widgetName: 'OpenSolatWidget',
    });
  } catch (err) {
    console.warn('requestPinWidget error:', err);
    return false;
  }
};
