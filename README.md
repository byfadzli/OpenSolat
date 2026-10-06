# OpenSolat: Waktu Solat & Azan Malaysia 🕌

A high-performance, ad-free, completely unrestricted Islamic prayer times and lifestyle mobile app for Malaysia built with React Native and Expo (SDK 57+).

OpenSolat replaces commercial paywalled solutions by providing all core and advanced utilities natively: official JAKIM e-Solat schedule synchronization, full offline caching, automatic prayer zone detection via GPS, persistent alarms, fasting reminders, animated Qibla compass, Hijri Takwim (Calendar) with Malaysian important dates, a digital Zikir calculator, and authenticated Hadith sourced strictly from official Malaysian religious authorities.

---

## ✨ Key Features

### 1. 🕒 Times (Waktu Solat)
* **Official JAKIM Integration:** Synced directly with `e-solat.gov.my` for all official Malaysian zones (`WLY01`, `SGR01-03`, `JHR01-04`, `KDH01-07`, `KTN01-02`, `MLK01`, `NGS01-02`, `PHG01-06`, `PLS01`, `PNG01`, `PRK01-07`, `SBH01-09`, `SWK01-09`, `TRG01-04`).
* **Automatic GPS Zone Detection:** Pinpoints the user's nearest JAKIM prayer zone using Haversine distance.
* **100% Offline Resilient:** Automatically caches full-year takwim data locally with mathematical astronomical fallback calculations according to JAKIM parameters (Fajr 20°, Isha 18°, +2min Ihtiyat).
* **Hero Countdown Card:** Real-time second-by-second countdown clock to the next prayer with an animated progress bar.
* **8-Prayer Detailed Timeline:** Imsak, Subuh, Syuruk, Dhuha, Zohor, Asar, Maghrib, Isyak.
* **One-Tap Share:** Easily share today's prayer schedule with family and friends via WhatsApp, Telegram, etc.

### 2. 🔔 Alarms & Notifications (Malaysian Edition)
* **Azan Mode Matrix:** Configure `Azan` | `Getar (Vibrate)` | `Batal (Off)` individually per prayer.
* **Local Malaysian Azan Audio Library:**
  * *Azan TV3 (Malaysia)*
  * *Azan RTM (Radio Televisyen Malaysia)*
  * *Azan Masjid Negara Kuala Lumpur*
  * *Azan Masjid Putra Putrajaya*
  * *Azan Makkah / Madinah (Global)*
  * *Alunan Takbir Hari Raya*
* **Persistent Subuh Alarm:** High-priority loud alarm designed to require manual interaction to dismiss.
* **Automatic Tahajud Alarm:** Automatically calculated for the last third of the night between Maghrib and Subuh for Qiamullail.
* **Sunnah Fasting Reminders:** Scheduled alerts on Sunday and Wednesday evenings for Monday and Thursday fasting, as well as Ayyamul Bidh (13-15 Hijri).
* **Pre-Azan Alerts:** Advance notice (5 or 10 minutes) before the prayer time begins.

### 3. 🧭 Qibla Direction (Arah Kiblat)
* **Real-Time Magnetic Compass:** Live rotating compass dial with smooth low-pass filtering.
* **Kaaba Beacon & Deviation:** Visual beacon at Holy Kaaba coordinates ($21.4225^\circ\text{ N}, 39.8262^\circ\text{ E}$) with real-time numeric readout of azimuth and current heading.
* **Precision Alignment Indicator:** Changes to glowing green and triggers haptic feedback when aligned within $\pm 3.5^\circ$.
* **Distance to Makkah:** Calculated live in kilometers (e.g. ~7,135 km from Malaysia).
* **Magnetic Interference & Calibration Guide:** Automated detection of magnetic disturbances and figure-8 recalibration instructions.

### 4. 📅 Takwim (Islamic Calendar & Events)
* **Interactive Dual-View Calendar:** Unified Hijri and Gregorian calendar grid with day selector.
* **Malaysian Islamic Important Dates (Tarikh Penting):** Complete catalog of national & state Islamic public holidays (Awal Muharram, Maulidur Rasul, Israk Mikraj, Awal Ramadan, Nuzul Al-Quran, Hari Raya Aidilfitri, Hari Wukuf, Hari Raya Aidiladha, Hari Tasyrik).
* **Takbir Raya Player & Reader:** Integrated audio player with full Arabic calligraphy, Malay Rumi transliteration, Bahasa Melayu translation, and sunnah etiquettes.

### 5. 📿 More (Utiliti & Tetapan)
* **Digital Tasbih (Zikir Calculator):**
  * Subhanallah (33), Alhamdulillah (33), Allahu Akbar (34), La ilaha illallah (100), Astaghfirullah (100), Selawat Nabi (100), and custom limit modes.
  * Haptic vibration on every tap with a celebration burst when the target is completed.
  * Lifetime counter and session statistics.
* **Daily Authenticated Hadith:** Sourced strictly from official Malaysian religious authorities (JAKIM e-Maktabah, e-Hadith, Pejabat Mufti Wilayah Persekutuan). Includes Arabic text, Malay translation, narrator, Sahih status, and actionable life lessons.
* **Panduan Solat Musafir (Jamak & Qasar):** Complete offline fiqh reference based on Mazhab Syafi'i (conditions for 2 marhalah ~81km, Jamak Taqdim & Takhir, Qasar, and intention formulas).
* **Dynamic Theme Customization:**
  * True Dark (`#121212`) & Clean Light (`#F8FAFC`) modes.
  * 7 User-Selectable Accent Colors: Classic Teal, Ochre Gold, Emerald Green, Midnight Blue, Royal Purple, Rose Red, and Amber Orange.

---

## 🏗️ Project Architecture

```text
OpenSolat/
├── assets/
│   ├── audio/ 
│   │   ├── azan_tv3.mp3
│   │   ├── azan_rtm.mp3
│   │   ├── azan_masjid_negara.mp3
│   │   └── takbir_raya.mp3
│   └── icons/
├── src/
│   ├── components/
│   │   ├── CompassDial.tsx        # Animated Qibla compass dial
│   │   ├── CalendarView.tsx       # Dual Hijri/Gregorian interactive calendar
│   │   ├── TasbihCounter.tsx      # Haptic digital Zikir calculator
│   │   └── ThemeProvider.tsx      # Dynamic dark/light & accent theme context
│   ├── constants/
│   │   ├── jakimZones.ts          # Complete JAKIM Malaysian prayer zones & GPS coords
│   │   ├── themeColors.ts         # Curated color tokens & 7 accent palettes
│   │   ├── islamicEvents.ts       # Malaysian Islamic holidays & Takbir Raya text
│   │   ├── hadithData.ts          # Authenticated Hadith from JAKIM e-Hadith
│   │   └── musafirGuide.ts        # Comprehensive Syafi'i Musafir Jamak & Qasar guide
│   ├── hooks/
│   │   ├── useCompass.ts          # Magnetometer sensor & alignment logic
│   │   ├── useTheme.ts            # Theme access hook
│   │   └── usePrayerTimes.ts      # Countdown ticker, GPS auto-detect & cache
│   ├── navigation/
│   │   └── BottomTabNavigator.tsx # 5-tab navigation bar with Lucide icons
│   ├── screens/
│   │   ├── TimesScreen.tsx        # Tab 1: Prayer Times & Countdown
│   │   ├── AlarmsScreen.tsx       # Tab 2: Azan Audio Library & Matrix
│   │   ├── QiblaScreen.tsx        # Tab 3: Animated Qibla Compass
│   │   ├── TakwimScreen.tsx       # Tab 4: Takwim Calendar & Takbir Raya
│   │   └── MoreScreen.tsx         # Tab 5: Tasbih, Hadith, Musafir & Settings
│   ├── services/
│   │   ├── api.ts                 # JAKIM e-Solat API sync & offline storage
│   │   └── notificationService.ts # Expo-notifications & Expo-av audio manager
│   └── utils/
│       └── calculations.ts        # Astronomical equations, Qibla math, Hijri Takwim
├── App.tsx                        # Root container with SafeArea and ThemeProvider
└── app.json                       # App manifest and permissions configuration
```

---

## 🚀 Running the App Locally

To start the development server, run the following commands in PowerShell or Terminal:

```bash
cd OpenSolat

# Start the Expo development server
npm.cmd start
```

Press:
* `a` to open in Android Emulator / connected Android device.
* `i` to open in iOS Simulator (macOS).
* `w` to open in Web Browser.

To type-check the project:
```bash
npm.cmd run tsc -- --noEmit
```
