import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Play,
  Square,
  Volume2,
  Bell,
  Cpu,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Music,
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import {
  AlarmPreferences,
  loadAlarmPreferences,
  playAudioPreview,
  stopAudioPreview,
  scheduleTestPrayerNotification,
  AZAN_AUDIO_LIBRARY,
} from '../services/notificationService';

interface AzanDiagnosticModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

const LAST_TEST_STORAGE_KEY = '@opensolat_last_audio_test';
const APP_VOLUME_STORAGE_KEY = '@opensolat_app_volume';

export const AzanDiagnosticModal: React.FC<AzanDiagnosticModalProps> = ({
  visible,
  onClose,
  onOpenSettings,
}) => {
  const { colors, accent } = useTheme();
  const { language, t } = useLanguage();

  const [prefs, setPrefs] = useState<AlarmPreferences | null>(null);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(true);
  const [appVolume, setAppVolume] = useState<number>(85);
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);
  const [selectedTestTrack, setSelectedTestTrack] = useState<string>('azan_tv3');
  const [lastTestTimestamp, setLastTestTimestamp] = useState<string>('');
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      loadState();
    } else {
      stopAudioPreview();
      setIsPlayingTest(false);
    }
  }, [visible]);

  const loadState = async () => {
    const loadedPrefs = await loadAlarmPreferences();
    setPrefs(loadedPrefs);
    setSelectedTestTrack(loadedPrefs.selectedAzanId || 'azan_tv3');

    if (Platform.OS !== 'web') {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationGranted(status === 'granted');
      } catch (e) {
        setNotificationGranted(true);
      }
    }

    try {
      const storedTest = await AsyncStorage.getItem(LAST_TEST_STORAGE_KEY);
      if (storedTest) setLastTestTimestamp(storedTest);

      const storedVol = await AsyncStorage.getItem(APP_VOLUME_STORAGE_KEY);
      if (storedVol) setAppVolume(parseInt(storedVol, 10) || 85);
    } catch (e) {}
  };

  const handleSetVolume = async (vol: number) => {
    setAppVolume(vol);
    try {
      await AsyncStorage.setItem(APP_VOLUME_STORAGE_KEY, vol.toString());
    } catch (e) {}
  };

  const handleRequestNotification = async () => {
    if (Platform.OS !== 'web') {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotificationGranted(status === 'granted');
      } catch (e) {}
    }
  };

  const handleToggleSoundTest = async () => {
    if (isPlayingTest) {
      await stopAudioPreview();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      const record = `${t('todayAt')} ${timeStr}`;
      setLastTestTimestamp(record);
      AsyncStorage.setItem(LAST_TEST_STORAGE_KEY, record).catch(() => {});

      const sound = await playAudioPreview(selectedTestTrack, status => {
        if (status.didJustFinish) {
          setIsPlayingTest(false);
        }
      });
      if (!sound) setIsPlayingTest(false);
    }
  };

  const handleScheduleNotificationTest = async () => {
    try {
      setTestCountdown(5);
      await scheduleTestPrayerNotification(selectedTestTrack, 5);

      const interval = setInterval(() => {
        setTestCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      console.warn('Notification test schedule error:', e);
      setTestCountdown(null);
    }
  };

  // Diagnostic calculations
  const activePrayersCount = prefs
    ? [prefs.subuh, prefs.zohor, prefs.asar, prefs.maghrib, prefs.isyak].filter(m => m !== 'off').length
    : 5;

  const isHealthy = notificationGranted && appVolume >= 50 && activePrayersCount > 0;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.navTitle, { color: colors.text }]}>{t('diagnosticTitle')}</Text>
            <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>
              {t('diagnosticSubtitle')}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              stopAudioPreview();
              onClose();
            }}
            style={[styles.closeCircle, { backgroundColor: colors.surfaceSubtle }]}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. Health Status Overview Card */}
          <View
            style={[
              styles.healthScoreCard,
              {
                backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                borderColor: isHealthy ? colors.success : colors.warning,
              },
            ]}
          >
            <View style={styles.healthTopRow}>
              {isHealthy ? (
                <ShieldCheck size={28} color={colors.success} />
              ) : (
                <AlertTriangle size={28} color={colors.warning} />
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.healthTitle,
                    { color: isHealthy ? colors.success : colors.warning },
                  ]}
                >
                  {isHealthy ? t('systemReady') : t('needsAdjustment')}
                </Text>
                <Text style={[styles.healthDesc, { color: colors.textSecondary }]}>
                  {isHealthy ? t('systemReadyDesc') : t('needsAdjustmentDesc')}
                </Text>
              </View>
            </View>

            {/* Quick 3-Pill Status Grid */}
            <View style={styles.pillGrid}>
              <View style={[styles.statusPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Bell size={13} color={notificationGranted ? colors.success : colors.warning} />
                <Text style={[styles.pillLabel, { color: colors.text }]}>
                  {t('notificationLabel')}: {notificationGranted ? t('activeStatus') : t('closedStatus')}
                </Text>
              </View>

              <View style={[styles.statusPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Volume2 size={13} color={appVolume >= 50 ? colors.success : colors.warning} />
                <Text style={[styles.pillLabel, { color: colors.text }]}>
                  {t('volumeLabel')}: {appVolume}%
                </Text>
              </View>

              <View style={[styles.statusPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Sparkles size={13} color={activePrayersCount > 0 ? colors.success : colors.warning} />
                <Text style={[styles.pillLabel, { color: colors.text }]}>
                  {t('activePrayersLabel')}: {activePrayersCount}/5
                </Text>
              </View>
            </View>
          </View>

          {/* 2. Interactive Audio Test Console */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Music size={18} color={accent.color} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('quickAzanTestTitle')}</Text>
            </View>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              {t('quickAzanTestDesc')}
            </Text>

            {/* Track selector chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trackChipsScroll}
            >
              {AZAN_AUDIO_LIBRARY.map(track => {
                const isSelected = selectedTestTrack === track.id;
                return (
                  <TouchableOpacity
                    key={track.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isPlayingTest) stopAudioPreview();
                      setSelectedTestTrack(track.id);
                    }}
                    style={[
                      styles.trackChip,
                      {
                        backgroundColor: isSelected ? accent.color : colors.surfaceSubtle,
                        borderColor: isSelected ? accent.color : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.trackChipText,
                        { color: isSelected ? colors.white : colors.textSecondary },
                      ]}
                    >
                      {track.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Big Action Test Button (In-App) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleToggleSoundTest}
              style={[
                styles.testPlayButton,
                {
                  backgroundColor: isPlayingTest ? colors.danger : accent.color,
                },
              ]}
            >
              {isPlayingTest ? (
                <>
                  <Square size={20} color={colors.white} />
                  <Text style={styles.testPlayButtonText}>{t('stopPlayback')}</Text>
                </>
              ) : (
                <>
                  <Play size={20} color={colors.white} />
                  <Text style={styles.testPlayButtonText}>{t('testSoundNow')}</Text>
                </>
              )}
            </TouchableOpacity>

            {/* System Alarm & Lockscreen Notification Test */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleScheduleNotificationTest}
              style={[
                styles.testPlayButton,
                {
                  backgroundColor: testCountdown !== null ? '#10B981' : colors.surfaceSubtle,
                  borderColor: testCountdown !== null ? '#10B981' : colors.border,
                  borderWidth: 1,
                  marginTop: 10,
                },
              ]}
            >
              <Bell size={18} color={testCountdown !== null ? colors.white : accent.color} />
              <Text
                style={[
                  styles.testPlayButtonText,
                  { color: testCountdown !== null ? colors.white : colors.text, fontSize: 13 },
                ]}
              >
                {testCountdown !== null
                  ? `Penggera Berbunyi Dalam (${testCountdown}s) — Kunci Skrin!`
                  : 'Uji Penggera Skrin Kunci & Notifikasi (5s)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.testMetaRow}>
              <Text style={[styles.testMetaText, { color: colors.textSecondary }]}>
                {t('lastTestLabel')}: <Text style={{ color: colors.text, fontWeight: '600' }}>{lastTestTimestamp || t('notTestedYet')}</Text>
              </Text>
            </View>
          </View>

          {/* 3. Settings & Diagnostic Controls */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Volume2 size={18} color={accent.color} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('volumeLevelTitle')}</Text>
            </View>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              {t('volumeLevelDesc')}
            </Text>

            {/* Stepped Volume Pills */}
            <View style={styles.volumeSelectorRow}>
              {[50, 75, 100].map(val => {
                const isSelected = appVolume === val;
                return (
                  <TouchableOpacity
                    key={val}
                    activeOpacity={0.7}
                    onPress={() => handleSetVolume(val)}
                    style={[
                      styles.volumeOptionBtn,
                      {
                        backgroundColor: isSelected ? accent.color : colors.surfaceSubtle,
                        borderColor: isSelected ? accent.color : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.volumeOptionText,
                        { color: isSelected ? colors.white : colors.text },
                      ]}
                    >
                      {val === 100 ? t('maxVolume') : `${val}%`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notification Permission Item */}
            <View style={[styles.subSettingRow, { borderTopColor: colors.border }]}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.subSettingTitle, { color: colors.text }]}>
                  {t('sysPermTitle')}
                </Text>
                <Text style={[styles.subSettingDesc, { color: colors.textSecondary }]}>
                  {notificationGranted ? t('sysPermGranted') : t('sysPermBlocked')}
                </Text>
              </View>
              {!notificationGranted && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleRequestNotification}
                  style={[styles.miniActionBtn, { backgroundColor: accent.color }]}
                >
                  <Text style={[styles.miniActionText, { color: colors.white }]}>{t('activate')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 4. Manufacturer Background Optimization Guide */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Cpu size={18} color={accent.color} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('bgGuideTitle')}
              </Text>
            </View>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              {t('bgGuideDesc')}
            </Text>

            {/* Vendor Accordions */}
            {[
              {
                id: 'samsung',
                name: 'Samsung (One UI)',
                guide: t('samsungGuide'),
              },
              {
                id: 'xiaomi',
                name: 'Xiaomi / Redmi / POCO (MIUI / HyperOS)',
                guide: t('xiaomiGuide'),
              },
              {
                id: 'oppo_vivo',
                name: 'Oppo, Realme & Vivo',
                guide: t('oppoVivoGuide'),
              },
            ].map(vendor => {
              const isExpanded = expandedVendor === vendor.id;
              return (
                <View
                  key={vendor.id}
                  style={[
                    styles.vendorBox,
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setExpandedVendor(isExpanded ? null : vendor.id)}
                    style={styles.vendorHeader}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Smartphone size={16} color={accent.color} />
                      <Text style={[styles.vendorName, { color: colors.text }]}>{vendor.name}</Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={16} color={colors.textSecondary} />
                    ) : (
                      <ChevronDown size={16} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                  {isExpanded && (
                    <Text style={[styles.vendorGuideText, { color: colors.textSecondary }]}>
                      {vendor.guide}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  navSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  healthScoreCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  healthTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  healthDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  trackChipsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  trackChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  trackChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  testPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginTop: 4,
  },
  testPlayButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  testMetaRow: {
    alignItems: 'center',
    marginTop: 2,
  },
  testMetaText: {
    fontSize: 11,
  },
  volumeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  volumeOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  volumeOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: 4,
  },
  subSettingTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  subSettingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  miniActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  miniActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  vendorBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 13,
    fontWeight: '600',
  },
  vendorGuideText: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.15)',
  },
});
