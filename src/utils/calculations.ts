export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

/**
 * Calculates the forward azimuth / bearing from user coordinates to the Holy Kaaba in Makkah.
 * Returns degree [0, 360).
 */
export const calculateQiblaBearing = (userLat: number, userLng: number): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(userLat);
  const lat2 = toRad(KAABA_COORDINATES.latitude);
  const deltaLng = toRad(KAABA_COORDINATES.longitude - userLng);

  const y = Math.sin(deltaLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);

  let qibla = toDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;

  return Math.round(qibla * 10) / 10;
};

/**
 * Calculates the distance to Makkah in kilometers.
 */
export const calculateDistanceToMakkah = (userLat: number, userLng: number): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(KAABA_COORDINATES.latitude - userLat);
  const dLng = toRad(KAABA_COORDINATES.longitude - userLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) * Math.cos(toRad(KAABA_COORDINATES.latitude)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

export const getCardinalDirection = (degree: number): string => {
  const directions = ['U', 'UTL', 'TL', 'TTL', 'T', 'TTG', 'TG', 'STG', 'S', 'SBD', 'BD', 'BBD', 'B', 'BBL', 'BL', 'UBL'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

/**
 * Convert Date object and prayer "HH:mm" / "HH:mm:ss" string to a Date object.
 */
export const parsePrayerTimeToDate = (timeStr: string, baseDate: Date = new Date()): Date => {
  const parts = timeStr.trim().split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parts[2] ? parseInt(parts[2], 10) || 0 : 0;

  const d = new Date(baseDate);
  d.setHours(hours, minutes, seconds, 0);
  return d;
};

/**
 * Format 24h "HH:mm" or Date into 12h "hh:mm am/pm" or 24h based on user preference.
 */
export const formatPrayerTime = (timeStr: string, is24Hour: boolean = false): string => {
  if (!timeStr) return '--:--';
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';

  if (is24Hour) {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
};

/**
 * Formats seconds into HH:mm:ss or mm:ss.
 */
export const formatDurationCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');

  return `${hStr}:${mStr}:${sStr}`;
};

/**
 * Astronomical Calculation for Malaysian Solat times (JAKIM Standard: Fajr 20°, Isha 18°).
 * Used as reliable offline mathematical fallback when network is unavailable and cache is empty.
 */
export interface CalculatedDailyPrayerTimes {
  imsak: string;
  subuh: string;
  syuruk: string;
  dhuha: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
}

export const calculateAstronomicalPrayerTimes = (
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffsetHours: number = 8
): CalculatedDailyPrayerTimes => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const d = jd - 2451545.0; // days since J2000.0

  // Mean anomaly of the Sun
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g))) % 360;

  // Obliquity of the ecliptic
  const e = 23.439 - 0.00000036 * d;

  // Declination of Sun
  const sinDecl = Math.sin(toRad(e)) * Math.sin(toRad(L));
  const decl = toDeg(Math.asin(sinDecl));

  // Equation of Time (in minutes)
  const RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15;
  const eqt = (q / 15 - RA) * 60;

  // Solar Noon (transit time) in hours local time
  const noon = 12 + timezoneOffsetHours - longitude / 15 - eqt / 60;

  // Hour Angle computation for given solar altitude angle
  const getHourAngle = (altitudeAngle: number): number => {
    const cosHA =
      (Math.sin(toRad(altitudeAngle)) - Math.sin(toRad(latitude)) * Math.sin(toRad(decl))) /
      (Math.cos(toRad(latitude)) * Math.cos(toRad(decl)));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return toDeg(Math.acos(cosHA));
  };

  // JAKIM Solat Parameters:
  // Fajr: Sun altitude -20°
  // Sunrise (Syuruk): Sun altitude -0.833°
  // Isha: Sun altitude -18°
  // Asr: Shadow length = 1 + tan(|lat - decl|) -> angle = arccot(1 + tan)
  const fajrHA = getHourAngle(-20);
  const sunriseHA = getHourAngle(-0.833);
  const ishaHA = getHourAngle(-18);

  const asrAltitude = toDeg(Math.atan(1 / (1 + Math.tan(toRad(Math.abs(latitude - decl))))));
  const asrHA = getHourAngle(asrAltitude);

  const hoursToTimeStr = (h: number): string => {
    let normalized = (h + 24) % 24;
    const hours = Math.floor(normalized);
    const minutes = Math.floor((normalized - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Ihtiyat (safety margin) according to JAKIM: +2 to +3 minutes
  const ihtiyatHours = 2.5 / 60;

  const fajrTime = noon - fajrHA / 15 + ihtiyatHours;
  const imsakTime = fajrTime - 10 / 60;
  const sunriseTime = noon - sunriseHA / 15;
  const dhuhaTime = sunriseTime + 28 / 60; // Dhuha ~28 mins after sunrise in Malaysia
  const dhuhrTime = noon + ihtiyatHours;
  const asrTime = noon + asrHA / 15 + ihtiyatHours;
  const maghribTime = noon + sunriseHA / 15 + ihtiyatHours;
  const ishaTime = noon + ishaHA / 15 + ihtiyatHours;

  return {
    imsak: hoursToTimeStr(imsakTime),
    subuh: hoursToTimeStr(fajrTime),
    syuruk: hoursToTimeStr(sunriseTime),
    dhuha: hoursToTimeStr(dhuhaTime),
    zohor: hoursToTimeStr(dhuhrTime),
    asar: hoursToTimeStr(asrTime),
    maghrib: hoursToTimeStr(maghribTime),
    isyak: hoursToTimeStr(ishaTime),
  };
};

/**
 * Calculates the last third of the night (Waktu Afdal Tahajud)
 * from Maghrib to Subuh.
 */
export const calculateTahajudWindow = (maghribStr: string, subuhStr: string): { start: string; end: string } => {
  const now = new Date();
  const maghrib = parsePrayerTimeToDate(maghribStr, now);
  const subuh = parsePrayerTimeToDate(subuhStr, now);

  // If subuh is smaller than maghrib, it means Subuh is the next morning
  let subuhTimeMs = subuh.getTime();
  if (subuhTimeMs < maghrib.getTime()) {
    subuhTimeMs += 24 * 60 * 60 * 1000;
  }

  const nightDurationMs = subuhTimeMs - maghrib.getTime();
  const oneThirdMs = nightDurationMs / 3;
  const tahajudStart = new Date(subuhTimeMs - oneThirdMs);

  const formatHHMM = (d: Date) =>
    `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

  return {
    start: formatHHMM(tahajudStart),
    end: subuhStr,
  };
};

/**
 * Convert Gregorian date to Hijri representation synchronized with Malaysian Islamic Calendar.
 */
export const getEstimatedHijriDate = (gregorianDate: Date = new Date()): { day: number; month: number; year: number; formatted: string } => {
  // Astronomical Julian day algorithm with Malaysia adjustment
  const gDay = gregorianDate.getDate();
  const gMonth = gregorianDate.getMonth() + 1;
  const gYear = gregorianDate.getFullYear();

  let m = gMonth;
  let y = gYear;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + gDay + b - 1524;

  const z = jd - 1948439;
  const cyc = Math.floor(z / 10631);
  const rem = z - cyc * 10631;
  const j = Math.floor((rem * 30 + 15) / 10631);
  const hYear = cyc * 30 + j;
  const hDayOfYear = rem - Math.floor((j * 10631 + 14) / 30);
  const hMonth = Math.min(12, Math.floor((hDayOfYear * 11 + 330) / 325));
  const hDay = Math.max(1, Math.min(30, hDayOfYear - Math.floor((hMonth * 325 - 320) / 11) + 1));

  const monthNames = [
    'Muharram',
    'Safar',
    'Rabiulawal',
    'Rabiulakhir',
    'Jamadilawal',
    'Jamadilakhir',
    'Rejab',
    'Syaaban',
    'Ramadan',
    'Syawal',
    'Zulkaedah',
    'Zulhijjah',
  ];

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    formatted: `${hDay} ${monthNames[hMonth - 1] || 'Ramadan'} ${hYear}H`,
  };
};
