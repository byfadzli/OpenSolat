import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import {
  Volume2,
  VolumeX,
  Vibrate,
  Bell,
  Play,
  Square,
  Clock,
  Moon,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Plus,
  Trash2,
  Music,
  Check,
  FileAudio,
  X,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { AzanDiagnosticModal } from '../components/AzanDiagnosticModal';
import {
  AzanAudioTrack,
  AZAN_AUDIO_LIBRARY,
  AZAN_SUBUH_LIBRARY,
  AZAN_GENERAL_LIBRARY,
  AZAN_OTHERS_LIBRARY,
  AZAN_BEEP_LIBRARY,
  PrayerAlarmMode,
  PrayerKey,
  AlarmPreferences,
  DEFAULT_ALARM_PREFERENCES,
  loadAlarmPreferences,
  saveAlarmPreferences,
  loadCustomTracks,
  saveCustomTrack,
  deleteCustomTrack,
  playAudioPreview,
  stopAudioPreview,
  schedulePrayerNotifications,
  getAzanPrefKeyForPrayer,
  getSelectedAzanIdForPrayer,
} from '../services/notificationService';
import { calculateTahajudWindow } from '../utils/calculations';
import { pinOpenSolatWidget } from '../widgets/widgetDataHelper';
import { WidgetPreviewCard } from '../components/WidgetPreviewCard';

type AudioLibraryTab = 'all' | 'subuh' | 'beep' | 'others' | 'custom';

export const AlarmsScreen: React.FC = () => {
  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();
  const { todayTimes } = usePrayerTimes();

  const [prefs, setPrefs] = useState<AlarmPreferences>(DEFAULT_ALARM_PREFERENCES);
  const [customTracks, setCustomTracks] = useState<AzanAudioTrack[]>([]);
  const [activeTab, setActiveTab] = useState<AudioLibraryTab>('all');
  const [pickerPrayer, setPickerPrayer] = useState<PrayerKey | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [saveBannerVisible, setSaveBannerVisible] = useState(false);
  const [isDiagnosticVisible, setIsDiagnosticVisible] = useState(false);
  const [isPinningWidget, setIsPinningWidget] = useState(false);

  const handlePinWidget = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Widget Android',
        'Ciri widget skrin hadapan (Home Screen) disokong pada peranti Android.'
      );
      return;
    }

    try {
      setIsPinningWidget(true);
      const success = await pinOpenSolatWidget();
      if (success) {
        Alert.alert(
          'Widget Skrin Depan',
          'Kotak dialog sistem telah dipaparkan. Sila tekan "Tambah" (Add) untuk meletakkan widget di skrin hadapan telefon anda.'
        );
      } else {
        Alert.alert(
          'Pasang Widget Skrin Depan',
          'Sila tekan lama (long-press) pada mana-mana ruang kosong di skrin utama telefon Samsung anda > Pilih "Widget" > Cari "OpenSolat" > Tarik widget ke skrin hadapan.'
        );
      }
    } catch (e) {
      Alert.alert(
        'Pasang Widget Skrin Depan',
        'Sila tekan lama (long-press) pada mana-mana ruang kosong di skrin utama telefon Samsung anda > Pilih "Widget" > Cari "OpenSolat" > Tarik widget ke skrin hadapan.'
      );
    } finally {
      setIsPinningWidget(false);
    }
  };

  useEffect(() => {
    loadAlarmPreferences().then(loaded => {
      setPrefs(loaded);
    });
    loadCustomTracks().then(custom => {
      setCustomTracks(custom);
    });

    return () => {
      stopAudioPreview();
    };
  }, []);

  const updatePreference = async <K extends keyof AlarmPreferences>(key: K, value: AlarmPreferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await saveAlarmPreferences(updated);

    if (todayTimes) {
      schedulePrayerNotifications(todayTimes, updated);
    }

    setSaveBannerVisible(true);
    setTimeout(() => setSaveBannerVisible(false), 2000);
  };

  const getTrackByIdLocal = (trackId: string): AzanAudioTrack | undefined => {
    return (
      AZAN_AUDIO_LIBRARY.find(t => t.id === trackId) ||
      customTracks.find(t => t.id === trackId)
    );
  };

  const getTrackName = (trackId: string): string => {
    const track = getTrackByIdLocal(trackId);
    return track ? track.name : trackId;
  };

  const applyTrackToAllPrayers = async (trackId: string) => {
    const updated: AlarmPreferences = {
      ...prefs,
      selectedSubuhAzanId: trackId,
      selectedZohorAzanId: trackId,
      selectedAsarAzanId: trackId,
      selectedMaghribAzanId: trackId,
      selectedIsyakAzanId: trackId,
      selectedAzanId: trackId,
    };
    setPrefs(updated);
    await saveAlarmPreferences(updated);
    if (todayTimes) {
      schedulePrayerNotifications(todayTimes, updated);
    }
    setSaveBannerVisible(true);
    setTimeout(() => setSaveBannerVisible(false), 2000);
  };

  const handleAudioPreviewToggle = async (trackId: string) => {
    if (playingTrackId === trackId) {
      await stopAudioPreview();
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
      const sound = await playAudioPreview(trackId, status => {
        if (status.didJustFinish) {
          setPlayingTrackId(null);
        }
      });
      if (!sound) {
        setPlayingTrackId(null);
      }
    }
  };

  const handlePickCustomAudio = async (
    preferredCategory?: 'subuh' | 'general' | 'others' | 'beep'
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/aac'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const cleanName = asset.name ? asset.name.replace(/\.[^/.]+$/, '') : 'Audio Telefon';
        const sizeStr = asset.size ? `${(asset.size / (1024 * 1024)).toFixed(2)} MB` : 'Audio Peranti';

        let finalUri = asset.uri;
        if (Platform.OS === 'web' && (asset as any).file) {
          try {
            const dataUri = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL((asset as any).file);
            });
            finalUri = dataUri;
          } catch (e) {
            finalUri = asset.uri;
          }
        }

        const newTrack = await saveCustomTrack(cleanName, finalUri, sizeStr);
        const updated = await loadCustomTracks();
        setCustomTracks(updated);

        // If user picked sound while on a specific tab, auto-assign it
        if (preferredCategory === 'beep') {
          await updatePreference('selectedBeepId', newTrack.id);
        } else if (preferredCategory === 'subuh') {
          await updatePreference('selectedSubuhAzanId', newTrack.id);
        } else if (preferredCategory === 'general') {
          await updatePreference('selectedAzanId', newTrack.id);
        }

        setActiveTab('custom');
        setSaveBannerVisible(true);
        setTimeout(() => setSaveBannerVisible(false), 2500);
      }
    } catch (err) {
      console.warn('Document picker error:', err);
      if (Platform.OS === 'web') {
        window.alert(t('pickAudioError'));
      } else {
        Alert.alert(t('error'), t('pickAudioError'));
      }
    }
  };

  const handleDeleteCustomTrack = async (trackId: string, trackName: string) => {
    const executeDelete = async () => {
      if (playingTrackId === trackId) {
        await stopAudioPreview();
        setPlayingTrackId(null);
      }
      await deleteCustomTrack(trackId);
      const updated = await loadCustomTracks();
      setCustomTracks(updated);

      if (prefs.selectedAzanId === trackId) {
        updatePreference('selectedAzanId', 'azan_tv3');
      }
      if (prefs.selectedSubuhAzanId === trackId) {
        updatePreference('selectedSubuhAzanId', 'subuh_alafasy');
      }
      if (prefs.selectedZohorAzanId === trackId) {
        updatePreference('selectedZohorAzanId', 'azan_tv3');
      }
      if (prefs.selectedAsarAzanId === trackId) {
        updatePreference('selectedAsarAzanId', 'azan_makkah');
      }
      if (prefs.selectedMaghribAzanId === trackId) {
        updatePreference('selectedMaghribAzanId', 'azan_masjid_negara');
      }
      if (prefs.selectedIsyakAzanId === trackId) {
        updatePreference('selectedIsyakAzanId', 'azan_alafasy');
      }
      if (prefs.selectedBeepId === trackId) {
        updatePreference('selectedBeepId', 'bip_ringkas');
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`${t('deleteConfirmMsg')} "${trackName}"?`)) {
        await executeDelete();
      }
    } else {
      Alert.alert(t('deleteConfirmTitle'), `${t('deleteConfirmMsg')} "${trackName}"?`, [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: executeDelete },
      ]);
    }
  };

  const tahajudWindow = todayTimes
    ? calculateTahajudWindow(todayTimes.maghrib, todayTimes.subuh)
    : { start: '03:45', end: '05:48' };

  const prayers: { key: keyof AlarmPreferences; name: string; time: string }[] = [
    { key: 'subuh', name: t('subuh'), time: todayTimes?.subuh || '05:48' },
    { key: 'zohor', name: t('zohor'), time: todayTimes?.zohor || '13:14' },
    { key: 'asar', name: t('asar'), time: todayTimes?.asar || '16:25' },
    { key: 'maghrib', name: t('maghrib'), time: todayTimes?.maghrib || '19:18' },
    { key: 'isyak', name: t('isyak'), time: todayTimes?.isyak || '20:28' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('alarmsTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('alarmsSubtitle')}
          </Text>
        </View>

        {/* Save confirmation toast */}
        {saveBannerVisible && (
          <View style={[styles.toastBanner, { backgroundColor: colors.success }]}>
            <CheckCircle size={16} color={colors.white} />
            <Text style={styles.toastText}>{t('saveSuccessToast')}</Text>
          </View>
        )}

        {/* Diagnostic Banner ("Azan Check") */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsDiagnosticVisible(true)}
          style={[
            styles.diagnosticBanner,
            { backgroundColor: colors.card, borderColor: accent.color },
          ]}
        >
          <View style={styles.diagnosticBannerLeft}>
            <View style={[styles.diagnosticBadge, { backgroundColor: accent.softBg }]}>
              <ShieldCheck size={20} color={accent.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.diagnosticTitle, { color: colors.text }]}>
                  {t('diagnosticBannerTitle')}
                </Text>
                <View style={[styles.activeDot, { backgroundColor: colors.success }]} />
              </View>
              <Text style={[styles.diagnosticSub, { color: colors.textSecondary }]}>
                {t('diagnosticBannerSub')}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={accent.color} />
        </TouchableOpacity>

        {/* 1. Prayer Mode Matrix (4 Options: Azan, Bip, Getar, Batal) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>{t('matrixHeading')}</Text>
          <Text style={[styles.sectionTag, { color: colors.textMuted }]}>{t('matrixSub')}</Text>
        </View>

        <View style={[styles.matrixCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {prayers.map((prayer, index) => {
            const currentMode = prefs[prayer.key] as PrayerAlarmMode;
            const prayerKey = prayer.key as PrayerKey;
            const currentAzanId = getSelectedAzanIdForPrayer(prefs, prayerKey);
            const currentAzanName = getTrackName(currentAzanId);
            const currentBeepName = getTrackName(prefs.selectedBeepId || 'bip_ringkas');

            return (
              <View
                key={prayer.key}
                style={[
                  styles.matrixRow,
                  {
                    borderBottomColor: index === prayers.length - 1 ? 'transparent' : colors.border,
                  },
                ]}
              >
                <View style={styles.matrixRowTop}>
                  <View style={styles.prayerInfo}>
                    <Text style={[styles.prayerName, { color: colors.text }]}>{prayer.name}</Text>
                    <Text style={[styles.prayerTime, { color: accent.color }]}>{prayer.time}</Text>
                  </View>

                  {/* 4-State Segmented Control */}
                  <View style={[styles.segmentedControl, { backgroundColor: colors.surfaceSubtle }]}>
                    {/* 1. Azan Penuh */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updatePreference(prayer.key, 'azan')}
                      style={[
                        styles.segmentButton,
                        currentMode === 'azan' && {
                          backgroundColor: accent.color,
                        },
                      ]}
                    >
                      <Volume2
                        size={13}
                        color={currentMode === 'azan' ? colors.white : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          { color: currentMode === 'azan' ? colors.white : colors.textSecondary },
                        ]}
                      >
                        {t('modeAzan')}
                      </Text>
                    </TouchableOpacity>

                    {/* 2. Bip / Nada Notifikasi Ringkas */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updatePreference(prayer.key, 'beep')}
                      style={[
                        styles.segmentButton,
                        currentMode === 'beep' && {
                          backgroundColor: '#0284C7', // Sky Blue
                        },
                      ]}
                    >
                      <Bell
                        size={13}
                        color={currentMode === 'beep' ? colors.white : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          { color: currentMode === 'beep' ? colors.white : colors.textSecondary },
                        ]}
                      >
                        {t('modeBeep')}
                      </Text>
                    </TouchableOpacity>

                    {/* 3. Getar Sahaja */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updatePreference(prayer.key, 'vibrate')}
                      style={[
                        styles.segmentButton,
                        currentMode === 'vibrate' && {
                          backgroundColor: colors.warning,
                        },
                      ]}
                    >
                      <Vibrate
                        size={13}
                        color={currentMode === 'vibrate' ? colors.white : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          { color: currentMode === 'vibrate' ? colors.white : colors.textSecondary },
                        ]}
                      >
                        {t('modeVibrate')}
                      </Text>
                    </TouchableOpacity>

                    {/* 4. Batal / Tutup */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updatePreference(prayer.key, 'off')}
                      style={[
                        styles.segmentButton,
                        currentMode === 'off' && {
                          backgroundColor: colors.surfaceSubtle,
                          borderWidth: 1,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <VolumeX
                        size={13}
                        color={currentMode === 'off' ? colors.danger : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.segmentText,
                          { color: currentMode === 'off' ? colors.danger : colors.textMuted },
                        ]}
                      >
                        {t('modeOff')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Individual Azan Selector Chip */}
                {currentMode === 'azan' && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setPickerPrayer(prayerKey);
                    }}
                    style={[
                      styles.prayerAzanChip,
                      {
                        backgroundColor: accent.softBg,
                        borderColor: accent.color,
                      },
                    ]}
                  >
                    <View style={styles.prayerAzanChipLeft}>
                      <Music size={13} color={accent.color} />
                      <Text style={[styles.prayerAzanChipLabel, { color: colors.textSecondary }]}>
                        {t('selectedAzanLabel')}
                      </Text>
                      <Text numberOfLines={1} style={[styles.prayerAzanChipName, { color: colors.text }]}>
                        {currentAzanName}
                      </Text>
                    </View>
                    <View style={styles.prayerAzanChipRight}>
                      <Text style={[styles.prayerAzanChipChange, { color: accent.color }]}>
                        {t('changeAzan')}
                      </Text>
                      <ChevronRight size={13} color={accent.color} />
                    </View>
                  </TouchableOpacity>
                )}

                {/* Individual Beep Selector Chip */}
                {currentMode === 'beep' && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('beep')}
                    style={[
                      styles.prayerAzanChip,
                      {
                        backgroundColor: 'rgba(2, 132, 199, 0.08)',
                        borderColor: '#0284C7',
                      },
                    ]}
                  >
                    <View style={styles.prayerAzanChipLeft}>
                      <Bell size={13} color="#0284C7" />
                      <Text style={[styles.prayerAzanChipLabel, { color: colors.textSecondary }]}>
                        {t('beepToneLabel')}
                      </Text>
                      <Text numberOfLines={1} style={[styles.prayerAzanChipName, { color: colors.text }]}>
                        {currentBeepName}
                      </Text>
                    </View>
                    <View style={styles.prayerAzanChipRight}>
                      <Text style={[styles.prayerAzanChipChange, { color: '#0284C7' }]}>
                        {t('changeAzan')}
                      </Text>
                      <ChevronRight size={13} color="#0284C7" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* 2. Audio Library: File list with Bip and Custom Sound options */}
        <View style={styles.libraryHeaderRow}>
          <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 24, marginBottom: 0 }]}>
            {t('audioLibraryHeading')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handlePickCustomAudio()}
            style={[styles.addSoundQuickBtn, { backgroundColor: accent.softBg, borderColor: accent.color }]}
          >
            <Plus size={14} color={accent.color} />
            <Text style={[styles.addSoundQuickText, { color: accent.color }]}>{t('addSoundBtn')}</Text>
          </TouchableOpacity>
        </View>

        {/* Segmented Filter Tabs: Semua | Khas Subuh | Bip & Nada | Lain-lain / Takbir | Fail Sendiri */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.libraryTabsContainer, { backgroundColor: colors.surfaceSubtle }]}
          style={styles.libraryTabsScrollWrapper}
        >
          {(
            [
              { key: 'all', label: t('tabAll') },
              { key: 'subuh', label: t('tabSubuh') },
              { key: 'beep', label: `${t('tabBeep')} (${AZAN_BEEP_LIBRARY.length})` },
              { key: 'others', label: t('tabOthers') },
              { key: 'custom', label: `${t('tabCustom')} (${customTracks.length})` },
            ] as const
          ).map(tabItem => (
            <TouchableOpacity
              key={tabItem.key}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tabItem.key as AudioLibraryTab)}
              style={[
                styles.libraryTabBtn,
                activeTab === tabItem.key && [styles.libraryTabBtnActive, { backgroundColor: colors.card }],
              ]}
            >
              <Text
                style={[
                  styles.libraryTabText,
                  {
                    color:
                      activeTab === tabItem.key
                        ? tabItem.key === 'beep'
                          ? '#0284C7'
                          : tabItem.key === 'others'
                          ? '#D97706'
                          : accent.color
                        : colors.textSecondary,
                  },
                  activeTab === tabItem.key && styles.libraryTabTextActive,
                ]}
              >
                {tabItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Audio Tracks Content */}
        <View style={[styles.audioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* TABS: SEMUA AZAN & KHAS SUBUH */}
          {(activeTab === 'all' || activeTab === 'subuh') && (
            <View>
              <View style={[styles.tabSubHeader, { backgroundColor: accent.softBg }]}>
                <Text style={[styles.tabSubHeaderText, { color: accent.color, fontWeight: '700' }]}>
                  {activeTab === 'all' ? t('allAzanNote') : t('subuhNote')}
                </Text>
              </View>

              {(activeTab === 'all'
                ? [...AZAN_GENERAL_LIBRARY, ...AZAN_SUBUH_LIBRARY]
                : AZAN_SUBUH_LIBRARY
              ).map((track, idx, arr) => {
                const isPlaying = playingTrackId === track.id;

                return (
                  <View
                    key={track.id}
                    style={[
                      styles.audioRow,
                      {
                        borderBottomColor: idx === arr.length - 1 ? 'transparent' : colors.border,
                      },
                    ]}
                  >
                    <View style={{ marginRight: 12 }}>
                      <View
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          backgroundColor: isPlaying ? colors.danger : accent.softBg,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {isPlaying ? (
                          <Square size={16} color={colors.white} />
                        ) : (
                          <Music size={16} color={accent.color} />
                        )}
                      </View>
                    </View>

                    <View style={styles.trackDetails}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text numberOfLines={1} style={[styles.trackName, { color: colors.text, flex: 1 }]}>
                          {track.name}
                        </Text>
                        <View style={[styles.formatBadge, { backgroundColor: colors.surfaceSubtle }]}>
                          <Text style={[styles.formatBadgeText, { color: colors.textSecondary }]}>
                            {track.durationLabel}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={[styles.trackSubtitle, { color: colors.textSecondary }]}>
                        {track.reciter}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleAudioPreviewToggle(track.id)}
                      style={[
                        styles.playButton,
                        {
                          backgroundColor: isPlaying ? colors.danger : colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {isPlaying ? (
                        <Square size={15} color={colors.white} />
                      ) : (
                        <Play size={15} color={accent.color} />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          {/* TAB 3: BEEP & NOTIFICATION TONES */}
          {activeTab === 'beep' && (
            <View>
              <View style={[styles.tabSubHeader, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.tabSubHeaderText, { color: '#0369A1' }]}>
                  {t('beepNote')}
                </Text>
              </View>

              {AZAN_BEEP_LIBRARY.map((track, idx) => {
                const isPlaying = playingTrackId === track.id;

                return (
                  <View
                    key={track.id}
                    style={[
                      styles.audioRow,
                      {
                        borderBottomColor:
                          idx === AZAN_BEEP_LIBRARY.length - 1 ? 'transparent' : colors.border,
                      },
                    ]}
                  >
                    <View style={{ marginRight: 12 }}>
                      <View
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          backgroundColor: isPlaying ? colors.danger : '#E0F2FE',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {isPlaying ? (
                          <Square size={16} color={colors.white} />
                        ) : (
                          <Bell size={16} color="#0284C7" />
                        )}
                      </View>
                    </View>

                    <View style={styles.trackDetails}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text numberOfLines={1} style={[styles.trackName, { color: colors.text, flex: 1 }]}>
                          {track.name}
                        </Text>
                        <View style={[styles.formatBadge, { backgroundColor: colors.surfaceSubtle }]}>
                          <Text style={[styles.formatBadgeText, { color: colors.textSecondary }]}>
                            {track.durationLabel}
                          </Text>
                        </View>
                      </View>
                      <Text numberOfLines={1} style={[styles.trackSubtitle, { color: colors.textSecondary }]}>
                        {track.reciter}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleAudioPreviewToggle(track.id)}
                      style={[
                        styles.playButton,
                        {
                          backgroundColor: isPlaying ? colors.danger : colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {isPlaying ? (
                        <Square size={15} color={colors.white} />
                      ) : (
                        <Play size={15} color="#0284C7" />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* TAB 4: CUSTOM SOUNDS (FROM PHONE) */}
          {activeTab === 'custom' && (
            <View style={{ padding: 14 }}>
              {/* Upload Card */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePickCustomAudio()}
                style={[
                  styles.uploadBox,
                  { borderColor: accent.color, backgroundColor: accent.softBg },
                ]}
              >
                <View style={[styles.uploadIconWrap, { backgroundColor: accent.color }]}>
                  <Plus size={20} color={colors.white} />
                </View>
                <Text style={[styles.uploadTitle, { color: colors.text }]}>
                  {t('uploadFromPhone')}
                </Text>
                <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
                  {t('uploadFromPhoneSub')}
                </Text>
              </TouchableOpacity>

              {customTracks.length === 0 ? (
                <View style={styles.emptyCustomBox}>
                  <FileAudio size={36} color={colors.textMuted} />
                  <Text style={[styles.emptyCustomTitle, { color: colors.textSecondary }]}>
                    {t('noCustomSounds')}
                  </Text>
                  <Text style={[styles.emptyCustomSub, { color: colors.textMuted }]}>
                    {t('noCustomSoundsSub')}
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: 14 }}>
                  <Text style={[styles.customListHeader, { color: colors.text }]}>
                    {t('customAudioYourFiles')} ({customTracks.length})
                  </Text>
                  {customTracks.map((track, idx) => {
                    const isPlaying = playingTrackId === track.id;

                    return (
                      <View
                        key={track.id}
                        style={[
                          styles.customTrackCard,
                          {
                            backgroundColor: colors.surfaceSubtle,
                            borderColor: colors.border,
                            marginTop: idx === 0 ? 8 : 10,
                          },
                        ]}
                      >
                        <View style={styles.customTrackTop}>
                          <View style={styles.customTrackLeft}>
                            <View style={[styles.fileIconWrap, { backgroundColor: colors.card }]}>
                              <Music size={16} color={accent.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.customTrackTitle, { color: colors.text }]} numberOfLines={1}>
                                {track.name}
                              </Text>
                              <Text style={[styles.customTrackMeta, { color: colors.textSecondary }]}>
                                {track.durationLabel} • {t('customBadge')}
                              </Text>
                            </View>
                          </View>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {/* Play / Stop */}
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => handleAudioPreviewToggle(track.id)}
                              style={[
                                styles.smallActionBtn,
                                {
                                  backgroundColor: isPlaying ? colors.danger : colors.card,
                                  borderColor: colors.border,
                                },
                              ]}
                            >
                              {isPlaying ? (
                                <Square size={14} color={colors.white} />
                              ) : (
                                <Play size={14} color={accent.color} />
                              )}
                            </TouchableOpacity>

                            {/* Delete */}
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => handleDeleteCustomTrack(track.id, track.name)}
                              style={[
                                styles.smallActionBtn,
                                { backgroundColor: colors.card, borderColor: colors.border },
                              ]}
                            >
                              <Trash2 size={14} color={colors.danger} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Quick upload footer in all, subuh, others, and beep tabs */}
          {activeTab !== 'custom' && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePickCustomAudio(activeTab === 'beep' ? 'beep' : 'general')}
              style={[styles.libraryFooterAdd, { borderTopColor: colors.border, backgroundColor: colors.surfaceSubtle }]}
            >
              <Plus size={16} color={accent.color} />
              <Text style={[styles.libraryFooterAddText, { color: accent.color }]}>
                {activeTab === 'beep' ? t('addCustomBeepPrompt') : t('addCustomAzanPrompt')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. Advanced Alarms & Widget */}
        <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 24 }]}>
          {t('advancedAlarmsHeading')}
        </Text>

        {/* Interactive Home Screen Widget Customizer & Live Preview (3 Options matching reference) */}
        <WidgetPreviewCard />

        <View style={[styles.advancedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Ongoing Lock Screen & Notification Center Prayer Widget */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIconWrap, { backgroundColor: accent.softBg }]}>
                <Sparkles size={18} color={accent.color} />
              </View>
              <View style={styles.toggleTextWrap}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.toggleTitle, { color: colors.text }]}>
                    {t('widgetTitle')}
                  </Text>
                  <View style={[styles.activeTagBadge, { backgroundColor: accent.color }]}>
                    <Text style={styles.activeTagBadgeText}>Widget</Text>
                  </View>
                </View>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  {t('widgetDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={prefs.showOngoingWidget}
              onValueChange={val => updatePreference('showOngoingWidget', val)}
              thumbColor={prefs.showOngoingWidget ? accent.color : colors.cardElevated}
              trackColor={{ false: colors.surfaceSubtle, true: accent.softBg }}
            />
          </View>

          {/* Persistent Subuh Alarm */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Clock size={18} color={colors.danger} />
              </View>
              <View style={styles.toggleTextWrap}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>
                  {t('persistentSubuhTitle')}
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  {t('persistentSubuhDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={prefs.persistentSubuhAlarm}
              onValueChange={val => updatePreference('persistentSubuhAlarm', val)}
              thumbColor={prefs.persistentSubuhAlarm ? accent.color : colors.cardElevated}
              trackColor={{ false: colors.surfaceSubtle, true: accent.softBg }}
            />
          </View>

          {/* Automatic Tahajud Alarm */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIconWrap, { backgroundColor: 'rgba(124, 58, 237, 0.15)' }]}>
                <Moon size={18} color={colors.accent} />
              </View>
              <View style={styles.toggleTextWrap}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>
                  {t('tahajudTitle')}
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  {language === 'en'
                    ? `Triggered during the last third of the night (${tahajudWindow.start} - ${tahajudWindow.end}) for Qiyamullail.`
                    : `Digerakkan pada sepertiga malam terakhir (${tahajudWindow.start} - ${tahajudWindow.end}) untuk Qiamullail.`}
                </Text>
              </View>
            </View>
            <Switch
              value={prefs.tahajudAlarm}
              onValueChange={val => updatePreference('tahajudAlarm', val)}
              thumbColor={prefs.tahajudAlarm ? accent.color : colors.cardElevated}
              trackColor={{ false: colors.surfaceSubtle, true: accent.softBg }}
            />
          </View>

          {/* Sunnah Fasting Reminder */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Sparkles size={18} color={colors.success} />
              </View>
              <View style={styles.toggleTextWrap}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>
                  {t('sunnahFastingTitle')}
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  {t('sunnahFastingDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={prefs.sunnahFastingReminder}
              onValueChange={val => updatePreference('sunnahFastingReminder', val)}
              thumbColor={prefs.sunnahFastingReminder ? accent.color : colors.cardElevated}
              trackColor={{ false: colors.surfaceSubtle, true: accent.softBg }}
            />
          </View>

          {/* Pre-Azan Reminder */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={[styles.toggleIconWrap, { backgroundColor: accent.softBg }]}>
                <ShieldCheck size={18} color={accent.color} />
              </View>
              <View style={styles.toggleTextWrap}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>
                  {t('preAzanTitle')}
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  {prefs.preAzanReminderMinutes > 0
                    ? (language === 'en'
                      ? `Notification ${prefs.preAzanReminderMinutes} minutes before prayer time to prepare.`
                      : `Pemberitahuan ${prefs.preAzanReminderMinutes} minit sebelum masuk waktu untuk bersiap.`)
                    : t('preAzanDisabled')}
                </Text>
              </View>
            </View>
            <View style={styles.minutePills}>
              {[0, 5, 10].map(mins => (
                <TouchableOpacity
                  key={mins}
                  onPress={() => updatePreference('preAzanReminderMinutes', mins)}
                  style={[
                    styles.minutePill,
                    {
                      backgroundColor:
                        prefs.preAzanReminderMinutes === mins ? accent.color : colors.surfaceSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.minutePillText,
                      {
                        color:
                          prefs.preAzanReminderMinutes === mins ? colors.white : colors.textSecondary,
                      },
                    ]}
                  >
                    {mins === 0 ? t('preAzanDisabled') : `${mins}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* EID TAKBIR CARD (FESTIVE EID SPECIAL) */}
          <View style={[styles.toggleRow, { borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'column', alignItems: 'stretch' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Sparkles size={18} color="#D97706" />
                </View>
                <View style={styles.toggleTextWrap}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.toggleTitle, { color: colors.text }]}>
                      {t('eidTakbirSectionTitle')}
                    </Text>
                    <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#B45309' }}>
                        {t('eidTakbirActiveBadge')}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.toggleDesc, { color: colors.textSecondary, marginTop: 2 }]}>
                    {t('eidTakbirSectionDesc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={prefs.eidTakbirEnabled}
                onValueChange={val => updatePreference('eidTakbirEnabled', val)}
                thumbColor={prefs.eidTakbirEnabled ? '#D97706' : colors.cardElevated}
                trackColor={{ false: colors.surfaceSubtle, true: '#FDE68A' }}
              />
            </View>

            {prefs.eidTakbirEnabled && (
              <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                {/* Interval selection */}
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
                  {t('eidTakbirIntervalLabel')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {[
                    { val: 10, label: t('eidTakbirInterval10') },
                    { val: 15, label: t('eidTakbirInterval15') },
                    { val: 20, label: t('eidTakbirInterval20') },
                    { val: 0, label: t('eidTakbirIntervalOnce') },
                  ].map(item => {
                    const isSelected = prefs.eidTakbirIntervalMinutes === item.val;
                    return (
                      <TouchableOpacity
                        key={item.val}
                        activeOpacity={0.7}
                        onPress={() => updatePreference('eidTakbirIntervalMinutes', item.val)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 7,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: isSelected ? '#D97706' : colors.border,
                          backgroundColor: isSelected ? '#FEF3C7' : colors.surfaceSubtle,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: isSelected ? '700' : '500',
                            color: isSelected ? '#92400E' : colors.textSecondary,
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Occasion selection */}
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
                  {t('eidTakbirOccasionLabel')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {[
                    { val: 'all_eid' as const, label: t('eidTakbirOccasionAll') },
                    { val: 'aidilfitri_only' as const, label: t('eidTakbirOccasionFitri') },
                    { val: 'aidiladha_only' as const, label: t('eidTakbirOccasionAdha') },
                  ].map(occ => {
                    const isSelected = (prefs.eidTakbirOccasion || 'all_eid') === occ.val;
                    return (
                      <TouchableOpacity
                        key={occ.val}
                        activeOpacity={0.7}
                        onPress={() => updatePreference('eidTakbirOccasion', occ.val)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: isSelected ? '#D97706' : colors.border,
                          backgroundColor: isSelected ? '#FEF3C7' : colors.surfaceSubtle,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: isSelected ? '700' : '500',
                            color: isSelected ? '#92400E' : colors.textSecondary,
                          }}
                        >
                          {occ.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Test simulation button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleAudioPreviewToggle('takbir_raya')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: playingTrackId === 'takbir_raya' ? colors.danger : '#F59E0B18',
                    borderWidth: 1,
                    borderColor: playingTrackId === 'takbir_raya' ? colors.danger : '#D97706',
                  }}
                >
                  {playingTrackId === 'takbir_raya' ? (
                    <>
                      <Square size={16} color={colors.white} />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.white }}>
                        {t('eidTakbirStopTestBtn')}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Play size={16} color="#D97706" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#B45309' }}>
                        {t('eidTakbirTestBtn')}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 6, fontStyle: 'italic' }}>
                  {t('eidTakbirScheduleInfo')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <AzanDiagnosticModal
        visible={isDiagnosticVisible}
        onClose={() => setIsDiagnosticVisible(false)}
      />

      {/* 5. Per-Prayer Azan Picker Modal */}
      {pickerPrayer && (
        <Modal
          visible={pickerPrayer !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            stopAudioPreview();
            setPlayingTrackId(null);
            setPickerPrayer(null);
          }}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {/* Modal Drag Handle */}
              <View style={[styles.modalHandle, { backgroundColor: colors.borderSubtle }]} />

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <View style={[styles.prayerBadge, { backgroundColor: accent.softBg }]}>
                      <Text style={[styles.prayerBadgeText, { color: accent.color }]}>
                        SOLAT {t(pickerPrayer).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {t('assignToPrayerTitle')} {t(pickerPrayer)}
                    </Text>
                  </View>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    {t('azanPickerSub')}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    stopAudioPreview();
                    setPlayingTrackId(null);
                    setPickerPrayer(null);
                  }}
                  style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceSubtle }]}
                >
                  <X size={18} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Quick Actions Row */}
              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    const currentTrackId = getSelectedAzanIdForPrayer(prefs, pickerPrayer);
                    applyTrackToAllPrayers(currentTrackId);
                  }}
                  style={[styles.modalActionPill, { backgroundColor: accent.softBg, borderColor: accent.color }]}
                >
                  <Sparkles size={12} color={accent.color} />
                  <Text style={[styles.modalActionPillText, { color: accent.color }]}>
                    {t('applyToAllPrayers')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handlePickCustomAudio(pickerPrayer === 'subuh' ? 'subuh' : 'general')}
                  style={[styles.modalActionPill, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
                >
                  <Plus size={12} color={colors.textSecondary} />
                  <Text style={[styles.modalActionPillText, { color: colors.textSecondary }]}>
                    {t('addSoundBtn')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Scrollable Tracks List */}
              <ScrollView style={styles.modalScrollList} contentContainerStyle={{ paddingBottom: 24 }}>
                {(pickerPrayer === 'subuh'
                  ? [...AZAN_SUBUH_LIBRARY, ...AZAN_GENERAL_LIBRARY, ...customTracks]
                  : [...AZAN_GENERAL_LIBRARY, ...AZAN_SUBUH_LIBRARY, ...customTracks]
                ).map((track, idx, arr) => {
                  const isSelected = getSelectedAzanIdForPrayer(prefs, pickerPrayer) === track.id;
                  const isPlaying = playingTrackId === track.id;

                  return (
                    <View
                      key={track.id}
                      style={[
                        styles.audioRow,
                        {
                          borderBottomColor: idx === arr.length - 1 ? 'transparent' : colors.border,
                          backgroundColor: isSelected ? accent.softBg : 'transparent',
                        },
                      ]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => updatePreference(getAzanPrefKeyForPrayer(pickerPrayer), track.id)}
                        style={styles.audioInfoTouch}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            { borderColor: isSelected ? accent.color : colors.borderSubtle },
                          ]}
                        >
                          {isSelected && (
                            <View style={[styles.radioFill, { backgroundColor: accent.color }]} />
                          )}
                        </View>

                        <View style={styles.trackDetails}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.trackName, { color: colors.text }]}>
                              {track.name}
                            </Text>
                            <View style={[styles.formatBadge, { backgroundColor: colors.surfaceSubtle }]}>
                              <Text style={[styles.formatBadgeText, { color: colors.textSecondary }]}>
                                {track.durationLabel}
                              </Text>
                            </View>
                            {isSelected && (
                              <View style={[styles.activeTagBadge, { backgroundColor: accent.color }]}>
                                <Text style={styles.activeTagBadgeText}>Dipilih</Text>
                              </View>
                            )}
                          </View>
                          <Text style={[styles.trackSubtitle, { color: colors.textSecondary }]}>
                            {track.reciter}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleAudioPreviewToggle(track.id)}
                        style={[
                          styles.playButton,
                          {
                            backgroundColor: isPlaying ? colors.danger : colors.surfaceSubtle,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        {isPlaying ? (
                          <Square size={15} color={colors.white} />
                        ) : (
                          <Play size={15} color={accent.color} />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>

              {/* Bottom Done Button */}
              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    stopAudioPreview();
                    setPlayingTrackId(null);
                    setPickerPrayer(null);
                  }}
                  style={[styles.modalDoneBtn, { backgroundColor: accent.color }]}
                >
                  <Text style={styles.modalDoneBtnText}>{t('close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  matrixCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  matrixRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  matrixRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerAzanChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  prayerAzanChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  prayerAzanChipLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  prayerAzanChipName: {
    fontSize: 11.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  prayerAzanChipRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  prayerAzanChipChange: {
    fontSize: 11,
    fontWeight: '700',
  },
  prayerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prayerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  activeTagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  activeTagBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  applyAllQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  applyAllQuickText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 640,
    maxHeight: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.12)',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 16,
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  modalActionPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalScrollList: {
    flexGrow: 1,
  },
  modalFooter: {
    padding: 14,
    borderTopWidth: 1,
  },
  modalDoneBtn: {
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  prayerInfo: {
    flex: 0.9,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  prayerTime: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2.5,
    gap: 3,
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5.5,
    borderRadius: 7,
    gap: 3,
  },
  segmentText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  libraryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  addSoundQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  addSoundQuickText: {
    fontSize: 12,
    fontWeight: '700',
  },
  libraryTabsScrollWrapper: {
    marginBottom: 10,
  },
  libraryTabsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    gap: 4,
    alignItems: 'center',
  },
  libraryTabBtn: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  libraryTabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  libraryTabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  libraryTabTextActive: {
    fontWeight: '700',
  },
  audioCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabSubHeader: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabSubHeaderText: {
    fontSize: 11,
    fontWeight: '600',
  },
  audioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  audioInfoTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  trackDetails: {
    flex: 1,
  },
  trackName: {
    fontSize: 13,
    fontWeight: '700',
  },
  formatBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  formatBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  customBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  trackSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  customDividerRow: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  customDividerText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  uploadSub: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 3,
  },
  emptyCustomBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyCustomTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyCustomSub: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  customListHeader: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  customTrackCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  customTrackTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customTrackLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 8,
  },
  fileIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTrackTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  customTrackMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  smallActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customAssignRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  assignBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    gap: 3,
  },
  assignBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  libraryFooterAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 6,
  },
  libraryFooterAddText: {
    fontSize: 12,
    fontWeight: '700',
  },
  advancedCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  toggleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingRight: 10,
  },
  toggleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  toggleTextWrap: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  toggleDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  minutePills: {
    flexDirection: 'row',
    gap: 4,
  },
  minutePill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  minutePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  diagnosticBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  diagnosticBannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 8,
  },
  diagnosticBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagnosticTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  diagnosticSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
