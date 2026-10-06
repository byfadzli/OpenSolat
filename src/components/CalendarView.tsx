import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { PrayerDayItem, formatDateKey } from '../services/api';
import { getEstimatedHijriDate, formatPrayerTime, calculateAstronomicalPrayerTimes } from '../utils/calculations';
import { MALAYSIAN_ISLAMIC_EVENTS } from '../constants/islamicEvents';
import { getZoneByCode } from '../constants/jakimZones';

interface CalendarViewProps {
  yearlyData: PrayerDayItem[];
  currentZoneCode: string;
}

const MONTHS_BM = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_BM = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<CalendarViewProps> = ({ yearlyData, currentZoneCode }) => {
  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();

  const monthList = language === 'en' ? MONTHS_EN : MONTHS_BM;
  const dayHeaders = language === 'en' ? DAYS_EN : DAYS_BM;

  const today = useMemo(() => new Date(), []);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Month navigation
  const handlePrevMonth = () => {
    let nextM = currentMonthIndex - 1;
    let nextY = currentYear;
    if (nextM < 0) {
      nextM = 11;
      nextY = currentYear - 1;
    }
    setCurrentMonthIndex(nextM);
    setCurrentYear(nextY);
    setSelectedDate(new Date(nextY, nextM, 1));
  };

  const handleNextMonth = () => {
    let nextM = currentMonthIndex + 1;
    let nextY = currentYear;
    if (nextM > 11) {
      nextM = 0;
      nextY = currentYear + 1;
    }
    setCurrentMonthIndex(nextM);
    setCurrentYear(nextY);
    setSelectedDate(new Date(nextY, nextM, 1));
  };

  // Build calendar matrix for current month
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    const cells: ({ dayNumber: number; date: Date } | null)[] = [];

    // Empty lead cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        dayNumber: d,
        date: new Date(currentYear, currentMonthIndex, d),
      });
    }

    return cells;
  }, [currentYear, currentMonthIndex]);

  // Selected date prayer times
  const selectedPrayerData = useMemo(() => {
    const key = formatDateKey(selectedDate);
    const item = yearlyData.find(d => d.date === key);
    return item || null;
  }, [selectedDate, yearlyData]);

  const selectedPrayerTimes = useMemo(() => {
    if (selectedPrayerData) {
      return selectedPrayerData;
    }
    const zone = getZoneByCode(currentZoneCode);
    const astro = calculateAstronomicalPrayerTimes(zone.latitude, zone.longitude, selectedDate);
    return {
      imsak: astro.imsak,
      subuh: astro.subuh,
      syuruk: astro.syuruk,
      dhuha: astro.dhuha,
      zohor: astro.zohor,
      asar: astro.asar,
      maghrib: astro.maghrib,
      isyak: astro.isyak,
    };
  }, [selectedPrayerData, currentZoneCode, selectedDate]);

  // Selected date Hijri calculation & Holiday check
  const selectedHijri = useMemo(() => {
    return getEstimatedHijriDate(selectedDate);
  }, [selectedDate]);

  const selectedHoliday = useMemo(() => {
    return MALAYSIAN_ISLAMIC_EVENTS.find(
      ev => ev.hijriDay === selectedHijri.day && ev.hijriMonth === selectedHijri.month
    );
  }, [selectedHijri]);

  // Check Sunnah fasting status for selected date
  const fastingInfo = useMemo(() => {
    const dayOfWeek = selectedDate.getDay(); // 1 = Isnin, 4 = Khamis
    const isIsninOrKhamis = dayOfWeek === 1 || dayOfWeek === 4;
    const isHariPutih = selectedHijri.day === 13 || selectedHijri.day === 14 || selectedHijri.day === 15;

    if (isHariPutih) {
      return t('fastingAyyamulBidh');
    }
    if (isIsninOrKhamis) {
      return dayOfWeek === 1 ? t('fastingMonday') : t('fastingThursday');
    }
    return null;
  }, [selectedDate, selectedHijri, t]);

  return (
    <View style={styles.container}>
      {/* Month Header Controller */}
      <View style={[styles.headerRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={[styles.arrowButton, { backgroundColor: colors.surfaceSubtle }]}
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.monthTitleWrapper}>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {monthList[currentMonthIndex]} {currentYear}
          </Text>
          <Text style={[styles.hijriSubheader, { color: accent.color }]}>
            {selectedHijri.formatted}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNextMonth}
          style={[styles.arrowButton, { backgroundColor: colors.surfaceSubtle }]}
        >
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Days of Week Header */}
      <View style={styles.dayNamesRow}>
        {dayHeaders.map((day, idx) => (
          <Text
            key={day}
            style={[
              styles.dayNameText,
              {
                color: idx === 5 ? accent.color : idx === 0 ? colors.danger : colors.textSecondary,
              },
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={[styles.gridContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {calendarGrid.map((cell, index) => {
          if (!cell) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isToday =
            cell.date.getDate() === today.getDate() &&
            cell.date.getMonth() === today.getMonth() &&
            cell.date.getFullYear() === today.getFullYear();

          const isSelected =
            cell.date.getDate() === selectedDate.getDate() &&
            cell.date.getMonth() === selectedDate.getMonth() &&
            cell.date.getFullYear() === selectedDate.getFullYear();

          const hijriEstimate = getEstimatedHijriDate(cell.date);
          const hasEvent = MALAYSIAN_ISLAMIC_EVENTS.some(
            ev => ev.hijriDay === hijriEstimate.day && ev.hijriMonth === hijriEstimate.month
          );
          const isFasting =
            cell.date.getDay() === 1 ||
            cell.date.getDay() === 4 ||
            hijriEstimate.day === 13 ||
            hijriEstimate.day === 14 ||
            hijriEstimate.day === 15;

          return (
            <TouchableOpacity
              key={`day-${cell.dayNumber}`}
              activeOpacity={0.7}
              onPress={() => setSelectedDate(cell.date)}
              style={[
                styles.dayCell,
                isSelected && {
                  backgroundColor: accent.color,
                  borderRadius: 10,
                },
                isToday && !isSelected && {
                  borderWidth: 1.5,
                  borderColor: accent.color,
                  borderRadius: 10,
                },
              ]}
            >
              <Text
                style={[
                  styles.gregorianNumber,
                  {
                    color: isSelected
                      ? colors.white
                      : isToday
                      ? accent.color
                      : colors.text,
                    fontWeight: isSelected || isToday ? '700' : '500',
                  },
                ]}
              >
                {cell.dayNumber}
              </Text>
              <Text
                style={[
                  styles.hijriNumber,
                  {
                    color: isSelected
                      ? 'rgba(255,255,255,0.85)'
                      : colors.textMuted,
                  },
                ]}
              >
                {hijriEstimate.day}
              </Text>

              {/* Event or Sunnah fasting indicator dot */}
              <View style={styles.dotRow}>
                {hasEvent && (
                  <View
                    style={[
                      styles.indicatorDot,
                      { backgroundColor: isSelected ? colors.white : colors.warning },
                    ]}
                  />
                )}
                {isFasting && !hasEvent && (
                  <View
                    style={[
                      styles.indicatorDot,
                      { backgroundColor: isSelected ? colors.white : colors.success },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Day Solat Schedule & Event Card */}
      <View style={[styles.solatSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sheetHeader}>
          <View>
            <Text style={[styles.sheetDateText, { color: colors.text }]}>
              {selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text style={[styles.sheetHijriText, { color: accent.color }]}>
              {selectedHijri.formatted}
            </Text>
          </View>
          <View style={[styles.zoneBadge, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.zoneBadgeText, { color: colors.textSecondary }]}>
              {currentZoneCode}
            </Text>
          </View>
        </View>

        {selectedHoliday && (
          <View style={[styles.holidayAlert, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: colors.warning }]}>
            <Sparkles size={16} color={colors.warning} />
            <Text style={[styles.holidayAlertText, { color: colors.warning }]}>
              {selectedHoliday.name}
            </Text>
          </View>
        )}

        {fastingInfo && !selectedHoliday && (
          <View style={[styles.holidayAlert, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.success }]}>
            <Sparkles size={16} color={colors.success} />
            <Text style={[styles.holidayAlertText, { color: colors.success }]}>
              {fastingInfo}
            </Text>
          </View>
        )}

        {/* 8-Prayer Grid */}
        <View style={styles.prayerTimesGrid}>
          {[
            { name: t('imsak'), time: selectedPrayerTimes.imsak },
            { name: t('subuh'), time: selectedPrayerTimes.subuh },
            { name: t('syuruk'), time: selectedPrayerTimes.syuruk },
            { name: t('dhuha'), time: selectedPrayerTimes.dhuha },
            { name: t('zohor'), time: selectedPrayerTimes.zohor },
            { name: t('asar'), time: selectedPrayerTimes.asar },
            { name: t('maghrib'), time: selectedPrayerTimes.maghrib },
            { name: t('isyak'), time: selectedPrayerTimes.isyak },
          ].map(p => (
            <View
              key={p.name}
              style={[
                styles.prayerCell,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.prayerName, { color: colors.textSecondary }]}>{p.name}</Text>
              <Text style={[styles.prayerTime, { color: colors.text }]}>{p.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleWrapper: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  hijriSubheader: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  dayNamesRow: {
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  dayNameText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '92%',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  gregorianNumber: {
    fontSize: 14,
  },
  hijriNumber: {
    fontSize: 10,
    marginTop: 1,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 2,
    height: 4,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  solatSheet: {
    width: '92%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sheetDateText: {
    fontSize: 15,
    fontWeight: '700',
  },
  sheetHijriText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  zoneBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  holidayAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginBottom: 14,
  },
  holidayAlertText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  prayerTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prayerCell: {
    width: '23%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 11,
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});
