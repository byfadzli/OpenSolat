import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  FlatList,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Clock,
  Compass,
  Bell,
  Sparkles,
  ChevronDown,
  Search,
  Share2,
  Check,
  RefreshCw,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { JAKIM_ZONES, JakimZone } from '../constants/jakimZones';
import { formatPrayerTime } from '../utils/calculations';
import { updateOngoingPrayerWidget } from '../services/notificationService';

interface TimesScreenProps {
  navigation: any;
}

export const TimesScreen: React.FC<TimesScreenProps> = ({ navigation }) => {
  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();
  const {
    currentZone,
    setZone,
    isAutoLocation,
    autoDetectZone,
    todayTimes,
    nextPrayer,
    isLoading,
    refresh,
  } = usePrayerTimes();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [zoneSearchQuery, setZoneSearchQuery] = useState('');
  const [shareToastVisible, setShareToastVisible] = useState(false);

  React.useEffect(() => {
    if (todayTimes) {
      updateOngoingPrayerWidget(todayTimes);
    }
  }, [todayTimes]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const getPrayerLabel = (key: string) => {
    switch (key.toLowerCase()) {
      case 'imsak': return t('imsak');
      case 'subuh': return t('subuh');
      case 'syuruk': return t('syuruk');
      case 'dhuha': return t('dhuha');
      case 'zohor': return t('zohor');
      case 'asar': return t('asar');
      case 'maghrib': return t('maghrib');
      case 'isyak': return t('isyak');
      default: return key;
    }
  };

  const getLocalizedDay = (dayStr?: string) => {
    if (!dayStr) return t('today');
    const lower = dayStr.toLowerCase();
    if (lower.includes('isnin') || lower.includes('mon')) return t('monday');
    if (lower.includes('selasa') || lower.includes('tue')) return t('tuesday');
    if (lower.includes('rabu') || lower.includes('wed')) return t('wednesday');
    if (lower.includes('khamis') || lower.includes('thu')) return t('thursday');
    if (lower.includes('jumaat') || lower.includes('fri')) return t('friday');
    if (lower.includes('sabtu') || lower.includes('sat')) return t('saturday');
    if (lower.includes('ahad') || lower.includes('sun')) return t('sunday');
    return dayStr;
  };

  const getLocalizedHijri = (hijriStr?: string) => {
    if (!hijriStr) return t('hijriCalendarFallback');
    if (language === 'en') {
      return hijriStr
        .replace(/Rabiulawal|Rabi'ul Awal|Rabiul Awwal/gi, "Rabi' al-Awwal")
        .replace(/Rabiulakhir|Rabi'ul Akhir/gi, "Rabi' al-Thani")
        .replace(/Jamadilawal|Jumadil Awal/gi, "Jumada al-Ula")
        .replace(/Jamadilakhir|Jumadil Akhir/gi, "Jumada al-Akhirah")
        .replace(/Rejab|Rajab/gi, "Rajab")
        .replace(/Syaaban|Sha'ban/gi, "Sha'ban")
        .replace(/Ramadhan|Ramadan/gi, "Ramadan")
        .replace(/Syawal|Shawwal/gi, "Shawwal")
        .replace(/Zulkaedah|Zulqaedah/gi, "Dhu al-Qi'dah")
        .replace(/Zulhijjah|Zulhijah/gi, "Dhu al-Hijjah");
    }
    return hijriStr;
  };

  const handleShare = async () => {
    if (!todayTimes) return;
    const localizedDay = getLocalizedDay(todayTimes.day);
    const localizedHijri = getLocalizedHijri(todayTimes.hijri);
    const msg = `${t('shareHeading')} (${todayTimes.zone.code} - ${todayTimes.zone.locations})\n${t('shareDate')}: ${localizedDay}, ${todayTimes.date} (${localizedHijri})\n\n` +
      `• ${t('imsak')}: ${todayTimes.imsak}\n` +
      `• ${t('subuh')}: ${todayTimes.subuh}\n` +
      `• ${t('syuruk')}: ${todayTimes.syuruk}\n` +
      `• ${t('dhuha')}: ${todayTimes.dhuha}\n` +
      `• ${t('zohor')}: ${todayTimes.zohor}\n` +
      `• ${t('asar')}: ${todayTimes.asar}\n` +
      `• ${t('maghrib')}: ${todayTimes.maghrib}\n` +
      `• ${t('isyak')}: ${todayTimes.isyak}\n\n` +
      `${t('shareSynced')}`;

    let sharedSuccessfully = false;
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(msg);
        sharedSuccessfully = true;
      } else {
        const res = await Share.share({ message: msg });
        if (res.action === Share.sharedAction) {
          sharedSuccessfully = true;
        }
      }
    } catch (e) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(msg);
          sharedSuccessfully = true;
        } catch (clipErr) {}
      }
    }

    if (sharedSuccessfully) {
      setShareToastVisible(true);
      setTimeout(() => setShareToastVisible(false), 2500);
    }
  };

  const filteredZones = JAKIM_ZONES.filter(
    z =>
      z.code.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
      z.locations.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
      z.state.toLowerCase().includes(zoneSearchQuery.toLowerCase())
  );

  const prayerTimeline = [
    { key: 'imsak', name: t('imsak'), time: todayTimes?.imsak || '--:--', icon: Moon },
    { key: 'subuh', name: t('subuh'), time: todayTimes?.subuh || '--:--', icon: CloudSun },
    { key: 'syuruk', name: t('syuruk'), time: todayTimes?.syuruk || '--:--', icon: Sun },
    { key: 'dhuha', name: t('dhuha'), time: todayTimes?.dhuha || '--:--', icon: Sun },
    { key: 'zohor', name: t('zohor'), time: todayTimes?.zohor || '--:--', icon: Sun },
    { key: 'asar', name: t('asar'), time: todayTimes?.asar || '--:--', icon: CloudSun },
    { key: 'maghrib', name: t('maghrib'), time: todayTimes?.maghrib || '--:--', icon: Moon },
    { key: 'isyak', name: t('isyak'), time: todayTimes?.isyak || '--:--', icon: Moon },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={accent.color} />
        }
      >
        {/* Top Header Location & Date Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setZoneModalVisible(true)}
            style={[styles.locationSelector, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <MapPin size={16} color={accent.color} />
            <View style={styles.locationTextWrap}>
              <View style={styles.zoneCodeRow}>
                <Text style={[styles.zoneCodeText, { color: accent.color }]}>
                  {currentZone.code}
                </Text>
                {isAutoLocation && (
                  <View style={[styles.gpsBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[styles.gpsBadgeText, { color: colors.success }]}>GPS</Text>
                  </View>
                )}
              </View>
              <Text numberOfLines={1} style={[styles.locationNameText, { color: colors.text }]}>
                {currentZone.locations}
              </Text>
            </View>
            <ChevronDown size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Share2 size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {shareToastVisible && (
          <View style={[styles.shareToast, { backgroundColor: colors.success }]}>
            <Check size={16} color={colors.white} />
            <Text style={styles.shareToastText}>{t('copiedToClipboard')}</Text>
          </View>
        )}

        {/* Date Headers */}
        <View style={styles.dateHeader}>
          <Text style={[styles.gregorianDate, { color: colors.textSecondary }]}>
            {getLocalizedDay(todayTimes?.day)}, {todayTimes?.date || ''}
          </Text>
          <Text style={[styles.hijriDate, { color: accent.color }]}>
            {getLocalizedHijri(todayTimes?.hijri)}
          </Text>
        </View>

        {/* Prominent Next Prayer Countdown Card */}
        <View
          style={[
            styles.countdownCard,
            {
              backgroundColor: colors.card,
              borderColor: accent.color,
              shadowColor: accent.color,
            },
          ]}
        >
          <View style={styles.countdownTopRow}>
            <View style={[styles.statusTag, { backgroundColor: accent.softBg }]}>
              <Clock size={14} color={accent.color} />
              <Text style={[styles.statusTagText, { color: accent.color }]}>
                {nextPrayer ? getPrayerLabel(nextPrayer.name) : t('nextPrayer')}
              </Text>
            </View>

            <Text style={[styles.targetPrayerTime, { color: colors.text }]}>
              {nextPrayer ? formatPrayerTime(nextPrayer.time) : '--:--'}
            </Text>
          </View>

            {/* Big Countdown Number */}
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.countdownValue, { color: colors.text }]}>
            {nextPrayer?.formattedCountdown || '00:00:00'}
          </Text>
          <Text style={[styles.countdownSubtext, { color: colors.textSecondary }]}>
            {t('untilPrayer')} {nextPrayer ? getPrayerLabel(nextPrayer.name) : t('nextPrayer')}
          </Text>

          {/* Progress Bar */}
          <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.round((nextPrayer?.progress || 0) * 100)}%`,
                  backgroundColor: accent.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Quick Action Shortcuts */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Alarms')}
            style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Bell size={20} color={accent.color} />
            <Text style={[styles.quickActionTitle, { color: colors.text }]}>{t('quickAzanTitle')}</Text>
            <Text style={[styles.quickActionSub, { color: colors.textSecondary }]}>{t('quickAzanSub')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Qibla')}
            style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Compass size={20} color={accent.color} />
            <Text style={[styles.quickActionTitle, { color: colors.text }]}>{t('quickQiblaTitle')}</Text>
            <Text style={[styles.quickActionSub, { color: colors.textSecondary }]}>{t('quickQiblaSub')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('More', { screen: 'tasbih' })}
            style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Sparkles size={20} color={accent.color} />
            <Text style={[styles.quickActionTitle, { color: colors.text }]}>{t('quickTasbihTitle')}</Text>
            <Text style={[styles.quickActionSub, { color: colors.textSecondary }]}>{t('quickTasbihSub')}</Text>
          </TouchableOpacity>
        </View>

        {/* 8-Prayer Detailed Timeline */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('prayerScheduleToday')}</Text>
          <View style={[styles.jakimBadge, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.jakimBadgeText, { color: colors.textSecondary }]}>
              {todayTimes?.isOfflineFallback ? t('astronomicalCalc') : t('jakimOfficial')}
            </Text>
          </View>
        </View>

        <View style={[styles.timelineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {prayerTimeline.map((item, index) => {
            const isNext = nextPrayer?.name.toLowerCase() === item.key.toLowerCase();
            const Icon = item.icon;

            return (
              <View
                key={item.key}
                style={[
                  styles.timelineRow,
                  {
                    borderBottomColor: index === prayerTimeline.length - 1 ? 'transparent' : colors.border,
                    backgroundColor: isNext ? accent.softBg : 'transparent',
                  },
                ]}
              >
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.prayerIconCircle,
                      {
                        backgroundColor: isNext ? accent.color : colors.surfaceSubtle,
                      },
                    ]}
                  >
                    <Icon size={16} color={isNext ? colors.white : colors.textSecondary} />
                  </View>
                  <Text
                    style={[
                      styles.prayerRowName,
                      {
                        color: isNext ? accent.color : colors.text,
                        fontWeight: isNext ? '700' : '600',
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isNext && (
                    <View style={[styles.activeTag, { backgroundColor: accent.color }]}>
                      <Text style={[styles.activeTagText, { color: colors.white }]}>{t('nextBadge')}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.timelineRight}>
                  <Text
                    style={[
                      styles.prayerRowTime,
                      {
                        color: isNext ? accent.color : colors.text,
                        fontWeight: isNext ? '800' : '600',
                      },
                    ]}
                  >
                    {formatPrayerTime(item.time)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* JAKIM Zone Picker Modal */}
      <Modal
        visible={zoneModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setZoneModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('selectZoneTitle')}</Text>
              <TouchableOpacity onPress={() => setZoneModalVisible(false)}>
                <Text style={{ color: accent.color, fontWeight: '700' }}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            {/* GPS Auto Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                await autoDetectZone();
                setZoneModalVisible(false);
              }}
              style={[
                styles.autoGpsButton,
                {
                  backgroundColor: isAutoLocation ? accent.color : colors.surfaceSubtle,
                  borderColor: accent.color,
                },
              ]}
            >
              <MapPin size={18} color={isAutoLocation ? colors.white : accent.color} />
              <Text
                style={[
                  styles.autoGpsButtonText,
                  { color: isAutoLocation ? colors.white : colors.text },
                ]}
              >
                {t('autoGpsBtn')}
              </Text>
            </TouchableOpacity>

            {/* Search Input */}
            <View
              style={[
                styles.searchContainer,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <Search size={16} color={colors.textSecondary} />
              <TextInput
                placeholder={t('searchZonePlaceholder')}
                placeholderTextColor={colors.textMuted}
                value={zoneSearchQuery}
                onChangeText={setZoneSearchQuery}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>

            {/* Zone List */}
            <FlatList
              data={filteredZones}
              keyExtractor={item => item.code}
              renderItem={({ item }) => {
                const isSelected = currentZone.code === item.code;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setZone(item.code);
                      setZoneModalVisible(false);
                    }}
                    style={[
                      styles.zoneItem,
                      {
                        borderBottomColor: colors.border,
                        backgroundColor: isSelected ? accent.softBg : 'transparent',
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.zoneItemCode, { color: accent.color }]}>
                          {item.code}
                        </Text>
                        <Text style={[styles.zoneItemState, { color: colors.textSecondary }]}>
                          • {item.state}
                        </Text>
                      </View>
                      <Text style={[styles.zoneItemLocations, { color: colors.text }]}>
                        {item.locations}
                      </Text>
                    </View>
                    {isSelected && <Check size={20} color={accent.color} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 8,
  },
  locationSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  locationTextWrap: {
    flex: 1,
  },
  zoneCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zoneCodeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  gpsBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  gpsBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  locationNameText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeader: {
    marginVertical: 10,
  },
  gregorianDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  hijriDate: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  countdownCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    marginVertical: 10,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  countdownTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  targetPrayerTime: {
    fontSize: 16,
    fontWeight: '700',
  },
  countdownValue: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 14,
    letterSpacing: -1,
  },
  countdownSubtext: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: -2,
    marginBottom: 16,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  quickActionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  quickActionSub: {
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  jakimBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  jakimBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timelineCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prayerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerRowName: {
    fontSize: 14,
  },
  activeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  timelineRight: {
    alignItems: 'flex-end',
  },
  prayerRowTime: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  autoGpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  autoGpsButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 13,
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  zoneItemCode: {
    fontSize: 13,
    fontWeight: '800',
  },
  zoneItemState: {
    fontSize: 12,
  },
  zoneItemLocations: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  shareToast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
    gap: 8,
  },
  shareToastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
