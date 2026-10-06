import * as Notifications from 'expo-notifications';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { parsePrayerTimeToDate, calculateTahajudWindow, getEstimatedHijriDate } from '../utils/calculations';
import { TodayPrayerTimes } from './api';

export type PrayerAlarmMode = 'azan' | 'beep' | 'vibrate' | 'off';

export type AzanCategory = 'subuh' | 'general' | 'beep' | 'others' | 'custom';

export interface AzanAudioTrack {
  id: string;
  name: string;
  reciter: string;
  category: AzanCategory;
  localAsset?: any;
  customUri?: string;
  remoteUrl?: string;
  durationLabel: string;
}

export const AZAN_SUBUH_LIBRARY: AzanAudioTrack[] = [
  // --- EDISI KHUSUS SUBUH (Dengan As-Salatu Khairum Minan Nawm) ---
  {
    id: 'subuh_alafasy',
    name: 'Azan Subuh - Mishary Rashid Al-Afasy',
    reciter: 'Mishary Rashid Al-Afasy (Kuwait)',
    category: 'subuh',
    localAsset: require('../../assets/audio/subuh_alafasy.mp3'),
    durationLabel: '4:15',
  },
  {
    id: 'subuh_rtm1',
    name: 'Azan Subuh - RTM 1 Malaysia',
    reciter: 'Radio Televisyen Malaysia (TV1 & Klasik)',
    category: 'subuh',
    localAsset: require('../../assets/audio/subuh_rtm1.mp3'),
    durationLabel: '3:45',
  },
  {
    id: 'subuh_ustaz_fahmi',
    name: 'Azan Subuh - Ustaz Fahmi Asyraf',
    reciter: 'Ustaz Fahmi Asyraf (Malaysia)',
    category: 'subuh',
    localAsset: require('../../assets/audio/subuh_ustaz_fahmi.mp3'),
    durationLabel: '4:00',
  },
];

export const AZAN_GENERAL_LIBRARY: AzanAudioTrack[] = [
  // --- ALUNAN SOLAT LAIN (Zohor, Asar, Maghrib, Isyak - Seruan Solat Sahaja) ---
  {
    id: 'azan_alafasy',
    name: 'Azan - Mishary Rashid Al-Afasy',
    reciter: 'Mishary Rashid Al-Afasy (Global)',
    category: 'general',
    localAsset: require('../../assets/audio/azan_alafasy.mp3'),
    durationLabel: '3:50',
  },
  {
    id: 'azan_abdul_basit',
    name: 'Azan - Sheikh Abdul Basit',
    reciter: 'Sheikh Abdul Basit Abdul Samad (Mesir)',
    category: 'general',
    localAsset: require('../../assets/audio/azan_abdul_basit.mp3'),
    durationLabel: '4:10',
  },
  {
    id: 'azan_makkah',
    name: 'Azan - Masjidil Haram Makkah',
    reciter: 'Sheikh Ali Ahmad Mulla (Muazzin Makkah)',
    category: 'general',
    localAsset: require('../../assets/audio/azan_makkah.mp3'),
    durationLabel: '4:20',
  },
  {
    id: 'azan_ustaz_fahmi',
    name: 'Azan - Ustaz Fahmi Asyraf',
    reciter: 'Ustaz Fahmi Asyraf (Malaysia)',
    category: 'general',
    localAsset: require('../../assets/audio/azan_ustaz_fahmi.mp3'),
    durationLabel: '3:40',
  },
  {
    id: 'azan_tv3',
    name: 'Azan TV3 Malaysia',
    reciter: 'Alunan Klasik TV3 Malaysia',
    category: 'general',
    localAsset: require('../../assets/audio/azan_tv3.mp3'),
    durationLabel: '3:45',
  },
  {
    id: 'azan_rtm',
    name: 'Azan RTM Malaysia',
    reciter: 'Radio Televisyen Malaysia & IKIM',
    category: 'general',
    localAsset: require('../../assets/audio/azan_rtm.mp3'),
    durationLabel: '3:30',
  },
  {
    id: 'azan_masjid_negara',
    name: 'Azan Masjid Negara KL',
    reciter: 'Muazzin Masjid Negara Kuala Lumpur',
    category: 'general',
    localAsset: require('../../assets/audio/azan_masjid_negara.mp3'),
    durationLabel: '3:50',
  },
  {
    id: 'azan_masjid_putra',
    name: 'Azan Masjid Putra Putrajaya',
    reciter: 'Muazzin Masjid Putra Putrajaya',
    category: 'general',
    localAsset: require('../../assets/audio/azan_masjid_putra.mp3'),
    durationLabel: '3:40',
  },
];

export const AZAN_OTHERS_LIBRARY: AzanAudioTrack[] = [
  // --- ALUNAN LAIN / KHAS (Bukan Seruan Azan - Takbir Hari Raya & Alunan Khas) ---
  {
    id: 'takbir_raya',
    name: 'Alunan Takbir Hari Raya',
    reciter: 'Takbir Aidilfitri & Aidiladha (Sunnah Hari Raya)',
    category: 'others',
    localAsset: require('../../assets/audio/takbir_raya.mp3'),
    durationLabel: '4:30',
  },
];

export const AZAN_BEEP_LIBRARY: AzanAudioTrack[] = [
  // --- NADA BIP & NOTIFIKASI RINGKAS (Pilihan Nada Selain Azan) ---
  {
    id: 'bip_ringkas',
    name: 'Bip Ringkas (Short Beep)',
    reciter: 'Nada Bip Notifikasi Lembut',
    category: 'beep',
    localAsset: require('../../assets/audio/bip_ringkas.mp3'),
    durationLabel: '0:01',
  },
  {
    id: 'chime_lembut',
    name: 'Chime Lembut (Soft Harmonic Chime)',
    reciter: 'Alunan Lonceng Tenang',
    category: 'beep',
    localAsset: require('../../assets/audio/chime_lembut.mp3'),
    durationLabel: '0:02',
  },
];

export const AZAN_AUDIO_LIBRARY: AzanAudioTrack[] = [
  ...AZAN_SUBUH_LIBRARY,
  ...AZAN_GENERAL_LIBRARY,
  ...AZAN_OTHERS_LIBRARY,
  ...AZAN_BEEP_LIBRARY,
];

export type PrayerKey = 'subuh' | 'zohor' | 'asar' | 'maghrib' | 'isyak';

export interface AlarmPreferences {
  subuh: PrayerAlarmMode;
  zohor: PrayerAlarmMode;
  asar: PrayerAlarmMode;
  maghrib: PrayerAlarmMode;
  isyak: PrayerAlarmMode;
  // Per-Prayer Azan selections:
  selectedSubuhAzanId: string;
  selectedZohorAzanId: string;
  selectedAsarAzanId: string;
  selectedMaghribAzanId: string;
  selectedIsyakAzanId: string;
  selectedAzanId: string; // for backward-compatibility fallback
  selectedBeepId: string; // specialized for bip/notification mode
  persistentSubuhAlarm: boolean;
  tahajudAlarm: boolean;
  sunnahFastingReminder: boolean;
  preAzanReminderMinutes: number; // 0 = off, 5, 10, 15
  showOngoingWidget: boolean; // Paparan terus waktu solat pada skrin kunci & bar notifikasi (Widget)
  // --- EID TAKBIR SETTINGS ---
  eidTakbirEnabled: boolean; // Aktifkan Takbir Pagi Hari Raya
  eidTakbirIntervalMinutes: number; // 0 = sekali (5 min lepas Subuh), 10, 15, 20
  eidTakbirOccasion: 'all_eid' | 'aidilfitri_only' | 'aidiladha_only';
}

export const DEFAULT_ALARM_PREFERENCES: AlarmPreferences = {
  subuh: 'azan',
  zohor: 'azan',
  asar: 'azan',
  maghrib: 'azan',
  isyak: 'azan',
  selectedSubuhAzanId: 'subuh_alafasy',
  selectedZohorAzanId: 'azan_tv3',
  selectedAsarAzanId: 'azan_makkah',
  selectedMaghribAzanId: 'azan_masjid_negara',
  selectedIsyakAzanId: 'azan_alafasy',
  selectedAzanId: 'azan_tv3',
  selectedBeepId: 'bip_ringkas',
  persistentSubuhAlarm: true,
  tahajudAlarm: false,
  sunnahFastingReminder: true,
  preAzanReminderMinutes: 10,
  showOngoingWidget: true,
  eidTakbirEnabled: true,
  eidTakbirIntervalMinutes: 10,
  eidTakbirOccasion: 'all_eid',
};

export const getAzanPrefKeyForPrayer = (prayerKey: PrayerKey): keyof AlarmPreferences => {
  switch (prayerKey) {
    case 'subuh':
      return 'selectedSubuhAzanId';
    case 'zohor':
      return 'selectedZohorAzanId';
    case 'asar':
      return 'selectedAsarAzanId';
    case 'maghrib':
      return 'selectedMaghribAzanId';
    case 'isyak':
      return 'selectedIsyakAzanId';
  }
};

export const getSelectedAzanIdForPrayer = (prefs: AlarmPreferences, prayerKey: PrayerKey): string => {
  switch (prayerKey) {
    case 'subuh':
      return prefs.selectedSubuhAzanId || 'subuh_alafasy';
    case 'zohor':
      return prefs.selectedZohorAzanId || prefs.selectedAzanId || 'azan_tv3';
    case 'asar':
      return prefs.selectedAsarAzanId || prefs.selectedAzanId || 'azan_makkah';
    case 'maghrib':
      return prefs.selectedMaghribAzanId || prefs.selectedAzanId || 'azan_masjid_negara';
    case 'isyak':
      return prefs.selectedIsyakAzanId || prefs.selectedAzanId || 'azan_alafasy';
  }
};

/**
 * Check if a date falls on Hari Raya Aidilfitri (1 Syawal) or Aidiladha (10 Zulhijjah)
 */
export const checkIsEidDay = (
  todayTimes?: TodayPrayerTimes,
  date: Date = new Date(),
  occasion: 'all_eid' | 'aidilfitri_only' | 'aidiladha_only' = 'all_eid'
): { isEid: boolean; eidName: string } => {
  const hijri = getEstimatedHijriDate(date);
  const hijriStr = (todayTimes?.hijri || '').toLowerCase();

  // 1 Syawal or 2 Syawal (Aidilfitri)
  const isAidilfitri =
    (hijri.month === 10 && (hijri.day === 1 || hijri.day === 2)) ||
    hijriStr.includes('syawal') ||
    hijriStr.includes('shawwal');

  // 10 Zulhijjah (Aidiladha)
  const isAidiladha =
    (hijri.month === 12 && hijri.day === 10) ||
    (hijriStr.includes('zulhijjah') && (hijriStr.includes('10') || hijriStr.includes('10 ')));

  if (isAidilfitri && occasion !== 'aidiladha_only') {
    return { isEid: true, eidName: 'Hari Raya Aidilfitri' };
  }
  if (isAidiladha && occasion !== 'aidilfitri_only') {
    return { isEid: true, eidName: 'Hari Raya Aidiladha' };
  }
  return { isEid: false, eidName: '' };
};

const CUSTOM_TRACKS_STORAGE_KEY = '@opensolat_custom_audio_tracks';

export const loadCustomTracks = async (): Promise<AzanAudioTrack[]> => {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load custom audio tracks:', e);
  }
  return [];
};

export const saveCustomTrack = async (
  name: string,
  uri: string,
  fileSizeStr?: string
): Promise<AzanAudioTrack> => {
  const newTrack: AzanAudioTrack = {
    id: `custom_${Date.now()}`,
    name,
    reciter: 'Fail Audio Pengguna',
    category: 'custom',
    customUri: uri,
    durationLabel: fileSizeStr || 'Audio Peranti',
  };
  const existing = await loadCustomTracks();
  const updated = [newTrack, ...existing];
  await AsyncStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(updated));
  return newTrack;
};

export const deleteCustomTrack = async (trackId: string): Promise<void> => {
  const existing = await loadCustomTracks();
  const filtered = existing.filter(t => t.id !== trackId);
  await AsyncStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(filtered));
};

export const getTrackById = async (trackId: string): Promise<AzanAudioTrack | undefined> => {
  const builtIn = AZAN_AUDIO_LIBRARY.find(t => t.id === trackId);
  if (builtIn) return builtIn;
  const custom = await loadCustomTracks();
  return custom.find(t => t.id === trackId);
};

const ALARM_STORAGE_KEY = '@opensolat_alarm_preferences';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isWidget = notification.request.identifier === ONGOING_WIDGET_NOTIFICATION_ID || 
                     notification.request.content.data?.isWidget;
    return {
      shouldShowAlert: !isWidget,
      shouldPlaySound: !isWidget,
      shouldSetBadge: false,
      shouldShowBanner: !isWidget,
      shouldShowList: !isWidget,
    };
  },
});

let currentAudioPlayer: AudioPlayer | null = null;
let currentSubscription: any = null;
let currentHtmlAudio: any = null;
let webAudioCtx: any = null;
let webAudioTimer: any = null;
let isPlaybackIntentionallyStopped = false;

const playWebMelody = (trackId: string, onEnd?: () => void): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;

    if (webAudioCtx) {
      try {
        webAudioCtx.close();
      } catch (e) {}
    }
    webAudioCtx = new AudioContextClass();

    const isTakbir = trackId === 'takbir_raya';
    const isBip = trackId === 'bip_ringkas';
    const isChime = trackId === 'chime_lembut';

    if (isBip) {
      const startTime = webAudioCtx.currentTime + 0.05;
      const osc1 = webAudioCtx.createOscillator();
      const gain1 = webAudioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, startTime);
      gain1.gain.setValueAtTime(0.2, startTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(webAudioCtx.destination);
      osc1.start(startTime);
      osc1.stop(startTime + 0.12);

      const osc2 = webAudioCtx.createOscillator();
      const gain2 = webAudioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, startTime + 0.16);
      gain2.gain.setValueAtTime(0.2, startTime + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
      osc2.connect(gain2);
      gain2.connect(webAudioCtx.destination);
      osc2.start(startTime + 0.16);
      osc2.stop(startTime + 0.28);

      if (webAudioTimer) clearTimeout(webAudioTimer);
      webAudioTimer = setTimeout(() => {
        if (onEnd) onEnd();
      }, 400);
      return true;
    }

    if (isChime) {
      const startTime = webAudioCtx.currentTime + 0.05;
      [523.25, 659.25, 783.99].forEach(freq => {
        const osc = webAudioCtx.createOscillator();
        const gain = webAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
        osc.connect(gain);
        gain.connect(webAudioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });
      if (webAudioTimer) clearTimeout(webAudioTimer);
      webAudioTimer = setTimeout(() => {
        if (onEnd) onEnd();
      }, 1300);
      return true;
    }

    const notes = isTakbir
      ? [392.0, 523.25, 587.33, 523.25, 392.0, 440.0, 349.23]
      : [293.66, 349.23, 392.0, 440.0, 392.0, 349.23, 293.66];
    const noteDuration = 0.85;
    const startTime = webAudioCtx.currentTime + 0.05;

    notes.forEach((freq, idx) => {
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * noteDuration);

      gain.gain.setValueAtTime(0.001, startTime + idx * noteDuration);
      gain.gain.linearRampToValueAtTime(0.3, startTime + idx * noteDuration + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + (idx + 1) * noteDuration);

      osc.connect(gain);
      gain.connect(webAudioCtx.destination);

      osc.start(startTime + idx * noteDuration);
      osc.stop(startTime + (idx + 1) * noteDuration);
    });

    const totalDurationMs = (notes.length * noteDuration + 0.2) * 1000;
    if (webAudioTimer) clearTimeout(webAudioTimer);
    webAudioTimer = setTimeout(() => {
      if (onEnd) onEnd();
    }, totalDurationMs);

    return true;
  } catch (err) {
    console.warn('Web Audio playback error:', err);
    return false;
  }
};

const stopWebMelody = () => {
  if (webAudioTimer) {
    clearTimeout(webAudioTimer);
    webAudioTimer = null;
  }
  if (webAudioCtx) {
    try {
      webAudioCtx.close();
    } catch (e) {}
    webAudioCtx = null;
  }
};

export const loadAlarmPreferences = async (): Promise<AlarmPreferences> => {
  try {
    const raw = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const fallbackGeneral = parsed.selectedAzanId || DEFAULT_ALARM_PREFERENCES.selectedAzanId;
      return {
        ...DEFAULT_ALARM_PREFERENCES,
        ...parsed,
        selectedSubuhAzanId: parsed.selectedSubuhAzanId || DEFAULT_ALARM_PREFERENCES.selectedSubuhAzanId,
        selectedZohorAzanId: parsed.selectedZohorAzanId || fallbackGeneral,
        selectedAsarAzanId: parsed.selectedAsarAzanId || fallbackGeneral,
        selectedMaghribAzanId: parsed.selectedMaghribAzanId || fallbackGeneral,
        selectedIsyakAzanId: parsed.selectedIsyakAzanId || fallbackGeneral,
        showOngoingWidget: parsed.showOngoingWidget !== undefined ? parsed.showOngoingWidget : true,
      };
    }
  } catch (e) {
    console.warn('Failed to load alarm preferences:', e);
  }
  return DEFAULT_ALARM_PREFERENCES;
};

export const saveAlarmPreferences = async (prefs: AlarmPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save alarm preferences:', e);
  }
};

/**
 * Resolve URI for an audio track across Web and Native
 */
export const getTrackAudioUri = (track: AzanAudioTrack): string | null => {
  if (track.customUri) return track.customUri;
  if (!track.localAsset) return null;

  try {
    if (typeof track.localAsset === 'string') return track.localAsset;
    if (typeof track.localAsset === 'object') {
      if (track.localAsset.uri) return track.localAsset.uri;
      if (track.localAsset.default) return track.localAsset.default;
    }
    const asset = Asset.fromModule(track.localAsset);
    return asset.uri || asset.localUri || null;
  } catch (e) {
    if (typeof track.localAsset === 'string') return track.localAsset;
    if (typeof track.localAsset === 'object' && track.localAsset?.uri) return track.localAsset.uri;
    return null;
  }
};

/**
 * Prime audio session with ducking support.
 * 'duckOthers' instructs the OS audio manager (Android AudioManager & iOS AVAudioSession)
 * to duck (lower volume to 50%) when incoming notifications, SMS, or WhatsApp tones arrive,
 * and automatically restore to 100% volume without stopping or pausing playback.
 */
export const configureAudioModeAsync = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
      allowsRecording: false,
      shouldRouteThroughEarpiece: false,
    });
  } catch (modeErr) {
    console.warn('configureAudioModeAsync error:', modeErr);
  }
};

/**
 * Audio playback helpers for Azan and Takbir preview
 */
export const playAudioPreview = async (
  trackId: string,
  onPlaybackStatusUpdate?: (status: any) => void
): Promise<AudioPlayer | boolean | null> => {
  try {
    await stopAudioPreview();

    const track = (await getTrackById(trackId)) || AZAN_AUDIO_LIBRARY[0];

    // On Web: Attempt to play the actual audio file (custom or built-in asset)
    if (Platform.OS === 'web') {
      const audioUri = getTrackAudioUri(track);
      if (audioUri && typeof window !== 'undefined' && (window as any).Audio) {
        try {
          // Add cache-busting timestamp so updated sound files in project folder reload immediately
          const cacheBuster = audioUri.includes('?') ? `&_t=${Date.now()}` : `?_t=${Date.now()}`;
          const finalUri =
            audioUri.startsWith('data:') || audioUri.startsWith('blob:')
              ? audioUri
              : `${audioUri}${cacheBuster}`;

          const audio = new (window as any).Audio(finalUri);
          currentHtmlAudio = audio;
          audio.onended = () => {
            currentHtmlAudio = null;
            if (onPlaybackStatusUpdate) onPlaybackStatusUpdate({ didJustFinish: true });
          };
          audio.onerror = (e: any) => {
            console.warn('Real audio file playback failed on web, falling back to synthesizer:', e);
            currentHtmlAudio = null;
            playWebMelody(trackId, () => {
              if (onPlaybackStatusUpdate) onPlaybackStatusUpdate({ didJustFinish: true });
            });
          };
          await audio.play();
          return true as any;
        } catch (playErr) {
          console.warn('HTML Audio play() error on web, falling back to synthesizer:', playErr);
          currentHtmlAudio = null;
          playWebMelody(trackId, () => {
            if (onPlaybackStatusUpdate) onPlaybackStatusUpdate({ didJustFinish: true });
          });
          return true as any;
        }
      }

      // Fallback if no audio URI resolved
      const started = playWebMelody(trackId, () => {
        if (onPlaybackStatusUpdate) onPlaybackStatusUpdate({ didJustFinish: true });
      });
      if (started) {
        return true as any;
      }
    }

    // On Native: use modern expo-audio configured for high-resilience playback with audio ducking
    await configureAudioModeAsync();

    isPlaybackIntentionallyStopped = false;
    const source = track.customUri ? { uri: track.customUri } : track.localAsset;
    const player = createAudioPlayer(source);
    player.volume = 1.0;

    // Always attach status listener to track playback status, handle caller callback,
    // and provide watchdog recovery if an external interruption transiently pauses playback.
    currentSubscription = player.addListener('playbackStatusUpdate', (status) => {
      if (onPlaybackStatusUpdate) {
        onPlaybackStatusUpdate({
          didJustFinish: status.didJustFinish || (status.duration > 0 && status.currentTime >= status.duration),
          isPlaying: status.playing,
          positionMillis: status.currentTime * 1000,
          durationMillis: status.duration * 1000,
        });
      }

      // Watchdog: If playback is paused unexpectedly by OS (e.g. transient phone call or non-duck notification)
      // and user has NOT explicitly stopped it, auto-resume smoothly once focus returns!
      if (!isPlaybackIntentionallyStopped && !status.playing && !status.didJustFinish) {
        if (status.duration > 0 && status.currentTime < (status.duration - 1)) {
          setTimeout(() => {
            if (!isPlaybackIntentionallyStopped && currentAudioPlayer) {
              try {
                currentAudioPlayer.play();
              } catch (resumeErr) {
                console.warn('Auto-resumed Azan after external notification interruption:', resumeErr);
              }
            }
          }, 350);
        }
      }
    });

    player.play();
    currentAudioPlayer = player;
    return player;
  } catch (err) {
    console.warn('Audio preview playback error, attempting fallback:', err);
    if (Platform.OS === 'web') {
      const fallbackStarted = playWebMelody(trackId, () => {
        if (onPlaybackStatusUpdate) onPlaybackStatusUpdate({ didJustFinish: true });
      });
      if (fallbackStarted) return true as any;
    }
    return null;
  }
};

export const stopAudioPreview = async (): Promise<void> => {
  isPlaybackIntentionallyStopped = true;
  stopWebMelody();
  if (currentHtmlAudio) {
    try {
      currentHtmlAudio.pause();
      currentHtmlAudio.currentTime = 0;
    } catch (e) {}
    currentHtmlAudio = null;
  }
  try {
    if (currentSubscription) {
      currentSubscription.remove();
      currentSubscription = null;
    }
    if (currentAudioPlayer) {
      currentAudioPlayer.pause();
      currentAudioPlayer.remove();
      currentAudioPlayer = null;
    }
  } catch (e) {
    console.warn('Audio stop error:', e);
  }
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (err) {
    console.warn('Notification permission error:', err);
    return false;
  }
};

/**
 * Setup and configure all Android notification channels with custom sounds and MAX/ALARM priority.
 */
export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    // 1. Channel for every Azan track & Beep sound
    for (const track of AZAN_AUDIO_LIBRARY) {
      const channelId = `prayer-sound-${track.id}`;
      await Notifications.setNotificationChannelAsync(channelId, {
        name: `Waktu Solat: ${track.name}`,
        description: `Penggera masuk waktu solat (${track.reciter})`,
        importance: Notifications.AndroidImportance.MAX,
        sound: `${track.id}.mp3`,
        vibrationPattern: [0, 500, 250, 500],
        enableVibrate: true,
        bypassDnd: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
          flags: {
            enforceAudibility: true,
            requestHardwareAudioVideoSynchronization: false,
          },
        },
      });
    }

    // 2. Channel for Vibrate only mode
    await Notifications.setNotificationChannelAsync('prayer-vibrate', {
      name: 'Waktu Solat: Getaran Sahaja',
      description: 'Pemberitahuan waktu solat dengan getaran tanpa laungan azan',
      importance: Notifications.AndroidImportance.HIGH,
      sound: null,
      enableVibrate: true,
      vibrationPattern: [0, 500, 250, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    // 3. Channel for Pre-Azan Reminder (10 minit sebelum)
    await Notifications.setNotificationChannelAsync('prayer-reminder-channel', {
      name: 'Peringatan Sebelum Masuk Waktu',
      description: 'Peringatan awal beberapa minit sebelum azan',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'chime_lembut.mp3',
      enableVibrate: true,
      vibrationPattern: [0, 250, 150, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.NOTIFICATION,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        flags: {
          enforceAudibility: true,
          requestHardwareAudioVideoSynchronization: false,
        },
      },
    });

    // 4. Channel for Tahajud & Fasting Reminders
    await Notifications.setNotificationChannelAsync('prayer-tahajud-channel', {
      name: 'Penggera Tahajud & Puasa Sunnah',
      description: 'Saluran penggera qiamullail dan peringatan puasa sunat',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'bip_ringkas.mp3',
      enableVibrate: true,
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        flags: {
          enforceAudibility: true,
          requestHardwareAudioVideoSynchronization: false,
        },
      },
    });

    // 5. Channel for Persistent Lock Screen & Notification Widget (silent)
    await Notifications.setNotificationChannelAsync('prayer-ongoing-widget', {
      name: 'Widget Waktu Solat (Skrin Kunci & Notifikasi)',
      importance: Notifications.AndroidImportance.LOW,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      vibrationPattern: [0, 0],
      enableVibrate: false,
      showBadge: false,
      sound: null,
    });
  } catch (err) {
    console.warn('Error setting up Android notification channels:', err);
  }
};

/**
 * Schedule an instant test prayer alarm to verify sound playback on Android lock screen & background.
 */
export const scheduleTestPrayerNotification = async (
  trackId: string = 'azan_tv3',
  delaySeconds: number = 5
): Promise<string | null> => {
  if (Platform.OS === 'web') {
    playAudioPreview(trackId);
    return 'web-test';
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  await setupNotificationChannels();

  const channelId = `prayer-sound-${trackId}`;
  const track = AZAN_AUDIO_LIBRARY.find(t => t.id === trackId);
  const trackName = track ? track.name : 'Azan';

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Ujian Penggera Azan (${trackName})`,
      body: `Ujian masuk waktu solat berjaya. Hayya 'alas-Solah.`,
      sound: `${trackId}.mp3`,
      vibrate: [0, 500, 250, 500],
      data: {
        prayerName: 'Ujian Solat',
        soundTrackId: trackId,
        mode: 'azan',
        isTest: true,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, delaySeconds),
      channelId: channelId,
    },
  });

  return notificationId;
};

/**
 * Initialize app-wide notification listeners for foreground playback and channel setups.
 */
export const initNotificationListener = (): (() => void) => {
  if (Platform.OS === 'web') return () => {};

  setupNotificationChannels();
  configureAudioModeAsync();

  // Listen for incoming notifications when app is active/foreground
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    const data = notification.request.content.data;
    if (data?.soundTrackId && (data?.mode === 'azan' || data?.mode === 'beep')) {
      playAudioPreview(String(data.soundTrackId));
    }
  });

  return () => {
    subscription.remove();
  };
};

/**
 * Schedule daily prayer notifications based on user preferences and current times.
 */
export const schedulePrayerNotifications = async (
  todayTimes: TodayPrayerTimes,
  prefs: AlarmPreferences
): Promise<void> => {
  if (Platform.OS === 'web') return;

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Ensure notification channels exist on Android
  await setupNotificationChannels();

  try {
    // Cancel prior scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const prayers: { key: keyof AlarmPreferences; name: string; timeStr: string }[] = [
      { key: 'subuh', name: 'Subuh', timeStr: todayTimes.subuh },
      { key: 'zohor', name: 'Zohor', timeStr: todayTimes.zohor },
      { key: 'asar', name: 'Asar', timeStr: todayTimes.asar },
      { key: 'maghrib', name: 'Maghrib', timeStr: todayTimes.maghrib },
      { key: 'isyak', name: 'Isyak', timeStr: todayTimes.isyak },
    ];

    for (const prayer of prayers) {
      const mode = prefs[prayer.key] as PrayerAlarmMode;
      if (mode === 'off') continue;

      const prayerDate = parsePrayerTimeToDate(prayer.timeStr, now);

      // If prayer already passed today, advance by 1 day so tomorrow's prayer is always scheduled!
      if (prayerDate.getTime() <= now.getTime()) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      const diffSeconds = Math.max(1, Math.floor((prayerDate.getTime() - now.getTime()) / 1000));
      let soundTrackId: string | undefined;
      let channelId = 'prayer-sound-azan_tv3';
      let soundFilename: string | boolean = 'azan_tv3.mp3';

      if (mode === 'azan') {
        soundTrackId = getSelectedAzanIdForPrayer(prefs, prayer.key as PrayerKey);
        channelId = `prayer-sound-${soundTrackId}`;
        soundFilename = `${soundTrackId}.mp3`;
      } else if (mode === 'beep') {
        soundTrackId = prefs.selectedBeepId || 'bip_ringkas';
        channelId = `prayer-sound-${soundTrackId}`;
        soundFilename = `${soundTrackId}.mp3`;
      } else if (mode === 'vibrate') {
        channelId = 'prayer-vibrate';
        soundFilename = false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Waktu Solat ${prayer.name} (${todayTimes.zone.code})`,
          body: `Telah masuk waktu ${prayer.name} bagi kawasan ${todayTimes.zone.locations}. Hayya 'alas-Solah.`,
          sound: soundFilename,
          vibrate: mode === 'vibrate' ? [0, 500, 200, 500] : undefined,
          data: {
            prayerName: prayer.name,
            zoneCode: todayTimes.zone.code,
            soundTrackId,
            mode,
            isPrayerAlarm: true,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: diffSeconds,
          channelId: channelId,
        },
      });

      // Pre-Azan Reminder (e.g., 10 minutes before)
      if (prefs.preAzanReminderMinutes > 0) {
        const preDate = new Date(prayerDate.getTime() - prefs.preAzanReminderMinutes * 60 * 1000);
        if (preDate.getTime() > now.getTime()) {
          const preDiff = Math.max(1, Math.floor((preDate.getTime() - now.getTime()) / 1000));
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prefs.preAzanReminderMinutes} Minit Sebelum ${prayer.name}`,
              body: `Waktu ${prayer.name} bakal masuk jam ${prayer.timeStr}. Bersedia untuk mengambil wudhu.`,
              sound: 'chime_lembut.mp3',
              data: { isPreReminder: true },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: preDiff,
              channelId: 'prayer-reminder-channel',
            },
          });
        }
      }
    }

    // Tahajud Alarm
    if (prefs.tahajudAlarm) {
      const tahajud = calculateTahajudWindow(todayTimes.maghrib, todayTimes.subuh);
      const tahajudDate = parsePrayerTimeToDate(tahajud.start, now);
      if (tahajudDate.getTime() <= now.getTime()) {
        tahajudDate.setDate(tahajudDate.getDate() + 1);
      }
      const tahajudDiff = Math.max(1, Math.floor((tahajudDate.getTime() - now.getTime()) / 1000));
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Waktu Sepertiga Malam (Tahajud)',
          body: `Waktu afdhal untuk Qiamullail dan Solat Tahajud telah bermula (${tahajud.start}).`,
          sound: 'bip_ringkas.mp3',
          data: { isTahajud: true },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: tahajudDiff,
          channelId: 'prayer-tahajud-channel',
        },
      });
    }

    // Sunnah Fasting Reminder
    if (prefs.sunnahFastingReminder) {
      const dayOfWeek = now.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 3) {
        const reminderTime = new Date(now);
        reminderTime.setHours(20, 30, 0, 0);
        if (reminderTime.getTime() > now.getTime()) {
          const fastingDiff = Math.max(1, Math.floor((reminderTime.getTime() - now.getTime()) / 1000));
          const fastingDay = dayOfWeek === 0 ? 'Isnin' : 'Khamis';
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Peringatan Puasa Sunat ${fastingDay}`,
              body: `Esok adalah hari ${fastingDay}, hari yang disunatkan berpuasa menurut Sunnah Baginda Nabi SAW. Jangan lupa bersahur.`,
              sound: 'chime_lembut.mp3',
              data: { isFastingReminder: true },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: fastingDiff,
              channelId: 'prayer-reminder-channel',
            },
          });
        }
      }
    }

    // Eid Takbir Schedule
    if (prefs.eidTakbirEnabled && todayTimes.subuh && todayTimes.syuruk) {
      const eidCheck = checkIsEidDay(todayTimes, now, prefs.eidTakbirOccasion);
      if (eidCheck.isEid) {
        const subuhDate = parsePrayerTimeToDate(todayTimes.subuh, now);
        const syurukDate = parsePrayerTimeToDate(todayTimes.syuruk, now);

        if (prefs.eidTakbirIntervalMinutes === 0) {
          const onceDate = new Date(subuhDate.getTime() + 5 * 60 * 1000);
          if (onceDate.getTime() > now.getTime()) {
            const diffSec = Math.max(1, Math.floor((onceDate.getTime() - now.getTime()) / 1000));
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `Takbir Pagi ${eidCheck.eidName}`,
                body: "Allahu Akbar, Allahu Akbar, Allahu Akbar, La ilaha illallah, Wallahu Akbar... Alunan Takbir Sunnah pagi Hari Raya sehingga Solat Hari Raya.",
                sound: 'takbir_raya.mp3',
                data: { isEidTakbir: true, soundTrackId: 'takbir_raya' },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: diffSec,
                channelId: 'prayer-sound-takbir_raya',
              },
            });
          }
        } else {
          const intervalMs = prefs.eidTakbirIntervalMinutes * 60 * 1000;
          let triggerTime = subuhDate.getTime() + intervalMs;
          let counter = 1;

          while (triggerTime < syurukDate.getTime()) {
            if (triggerTime > now.getTime()) {
              const diffSec = Math.max(1, Math.floor((triggerTime - now.getTime()) / 1000));
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `Takbir Pagi ${eidCheck.eidName} (#${counter})`,
                  body: "Allahu Akbar, Allahu Akbar, Allahu Akbar, La ilaha illallah, Wallahu Akbar... Alunan Takbir Sunnah pagi Hari Raya menjelang Solat Sunat.",
                  sound: 'takbir_raya.mp3',
                  data: { isEidTakbir: true, soundTrackId: 'takbir_raya' },
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                  seconds: diffSec,
                  channelId: 'prayer-sound-takbir_raya',
                },
              });
            }
            triggerTime += intervalMs;
            counter++;
          }
        }
      }
    }

    // Update persistent lock screen & notification center widget banner
    await updateOngoingPrayerWidget(todayTimes, prefs);
  } catch (err) {
    console.warn('Error scheduling prayer notifications:', err);
  }
};

/**
 * Ongoing Persistent Prayer Notification (Lock Screen & Notification Shade Widget)
 * Displays today's full 5 prayer times + countdown to next prayer directly on Android lock screen & notification shade
 */
export const ONGOING_WIDGET_NOTIFICATION_ID = 'opensolat-ongoing-prayer-widget';

export const updateOngoingPrayerWidget = async (
  todayTimes: TodayPrayerTimes,
  prefs?: AlarmPreferences
): Promise<void> => {
  if (Platform.OS === 'web') return;

  const currentPrefs = prefs || (await loadAlarmPreferences());
  if (!currentPrefs.showOngoingWidget) {
    try {
      await Notifications.dismissNotificationAsync(ONGOING_WIDGET_NOTIFICATION_ID);
    } catch (e) {}
    return;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-ongoing-widget', {
        name: 'Widget Waktu Solat (Skrin Kunci & Notifikasi)',
        importance: Notifications.AndroidImportance.LOW, // Silent, low intrusion
        vibrationPattern: [0],
        enableVibrate: false,
        showBadge: false,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    const now = new Date();
    const prayerList = [
      { name: 'Subuh', time: todayTimes.subuh },
      { name: 'Syuruk', time: todayTimes.syuruk },
      { name: 'Zohor', time: todayTimes.zohor },
      { name: 'Asar', time: todayTimes.asar },
      { name: 'Maghrib', time: todayTimes.maghrib },
      { name: 'Isyak', time: todayTimes.isyak },
    ];

    let nextPrayer = prayerList[0];
    let minDiffMs = Infinity;

    for (const p of prayerList) {
      const pDate = parsePrayerTimeToDate(p.time, now);
      const diff = pDate.getTime() - now.getTime();
      if (diff > 0 && diff < minDiffMs) {
        minDiffMs = diff;
        nextPrayer = p;
      }
    }

    let nextRemainingText = '';
    if (minDiffMs !== Infinity) {
      const hours = Math.floor(minDiffMs / (1000 * 60 * 60));
      const mins = Math.floor((minDiffMs % (1000 * 60 * 60)) / (1000 * 60));
      nextRemainingText = hours > 0 ? `${hours}j ${mins}m` : `${mins} minit`;
    } else {
      nextPrayer = { name: 'Subuh (Esok)', time: todayTimes.subuh };
      nextRemainingText = 'esok pagi';
    }

    const zoneName = todayTimes.zone.locations
      ? todayTimes.zone.locations.split(',')[0].trim()
      : todayTimes.zone.code;

    const title = `🕌 Waktu Solat • ${zoneName} (Seterusnya: ${nextPrayer.name} ${nextPrayer.time})`;
    const body = `Subuh ${todayTimes.subuh} • Zohor ${todayTimes.zohor} • Asar ${todayTimes.asar} • Maghrib ${todayTimes.maghrib} • Isyak ${todayTimes.isyak}\n⏳ Seterusnya: ${nextPrayer.name} (${nextPrayer.time}) dlm ${nextRemainingText}`;

    await Notifications.scheduleNotificationAsync({
      identifier: ONGOING_WIDGET_NOTIFICATION_ID,
      content: {
        title,
        body,
        priority: Notifications.AndroidNotificationPriority.LOW,
        sticky: true,
        autoDismiss: false,
        data: { isOngoingWidget: true, zoneCode: todayTimes.zone.code },
      },
      trigger: null, // show immediately on phone
    });
  } catch (err) {
    console.warn('Failed to update ongoing prayer widget notification:', err);
  }
};
