import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Volume2,
  Play,
  Square,
  BookOpen,
  CalendarDays,
  BadgeCheck,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { CalendarView } from '../components/CalendarView';
import {
  MALAYSIAN_ISLAMIC_EVENTS,
  TAKBIR_RAYA_DATA,
  HIJRI_MONTH_NAMES_EN,
} from '../constants/islamicEvents';
import { playAudioPreview, stopAudioPreview } from '../services/notificationService';

export const TakwimScreen: React.FC = () => {
  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();
  const { yearlyData, currentZone } = usePrayerTimes();

  const [activeTab, setActiveTab] = useState<'calendar' | 'events' | 'takbir'>('calendar');
  const [isTakbirPlaying, setIsTakbirPlaying] = useState<boolean>(false);

  const toggleTakbirAudio = async () => {
    if (isTakbirPlaying) {
      await stopAudioPreview();
      setIsTakbirPlaying(false);
    } else {
      setIsTakbirPlaying(true);
      const sound = await playAudioPreview('takbir_raya', status => {
        if (status.didJustFinish) {
          setIsTakbirPlaying(false);
        }
      });
      if (!sound) setIsTakbirPlaying(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('takwimTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('takwimSubtitle')}
          </Text>
        </View>

        {/* Top 3-Way Segment Tabs */}
        <View style={[styles.tabSegment, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('calendar')}
            style={[
              styles.segmentItem,
              activeTab === 'calendar' && { backgroundColor: accent.color },
            ]}
          >
            <CalendarDays
              size={15}
              color={activeTab === 'calendar' ? colors.white : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentLabel,
                { color: activeTab === 'calendar' ? colors.white : colors.textSecondary },
              ]}
            >
              {t('tabCalendar')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('events')}
            style={[
              styles.segmentItem,
              activeTab === 'events' && { backgroundColor: accent.color },
            ]}
          >
            <Sparkles
              size={15}
              color={activeTab === 'events' ? colors.white : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentLabel,
                { color: activeTab === 'events' ? colors.white : colors.textSecondary },
              ]}
            >
              {t('tabEvents')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('takbir')}
            style={[
              styles.segmentItem,
              activeTab === 'takbir' && { backgroundColor: accent.color },
            ]}
          >
            <Volume2
              size={15}
              color={activeTab === 'takbir' ? colors.white : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentLabel,
                { color: activeTab === 'takbir' ? colors.white : colors.textSecondary },
              ]}
            >
              {t('tabTakbir')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Interactive Dual Calendar */}
        {activeTab === 'calendar' && (
          <CalendarView yearlyData={yearlyData} currentZoneCode={currentZone.code} />
        )}

        {/* Tab 2: Important Malaysian Dates */}
        {activeTab === 'events' && (
          <View style={styles.eventsContainer}>
            {MALAYSIAN_ISLAMIC_EVENTS.map(event => (
              <View
                key={event.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.eventTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.eventName, { color: colors.text }]}>
                      {language === 'en' ? (event.nameEn || event.name) : event.name}
                    </Text>
                    <Text style={[styles.eventNameArabic, { color: accent.color }]}>
                      {event.nameArabic}
                    </Text>
                  </View>

                  <View style={styles.eventBadges}>
                    <View style={[styles.dateBadge, { backgroundColor: accent.softBg }]}>
                      <Text style={[styles.dateBadgeText, { color: accent.color }]}>
                        {event.hijriDay} {language === 'en' ? (HIJRI_MONTH_NAMES_EN[event.hijriMonth - 1] || event.hijriMonthName) : event.hijriMonthName}
                      </Text>
                    </View>
                    {event.isHolidayMalaysia && (
                      <View style={[styles.holidayBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                        <Text style={[styles.holidayBadgeText, { color: colors.danger }]}>
                          {t('publicHoliday')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={[styles.eventDesc, { color: colors.textSecondary }]}>
                  {language === 'en' ? (event.descriptionEn || event.description) : event.description}
                </Text>

                {/* Sunnah deeds */}
                <View style={[styles.deedsBox, { backgroundColor: colors.surfaceSubtle }]}>
                  <Text style={[styles.deedsHeading, { color: colors.text }]}>
                    {t('sunnahDeedsHeading')}
                  </Text>
                  {(language === 'en' && event.sunnahDeedsEn ? event.sunnahDeedsEn : event.sunnahDeeds).map((deed, i) => (
                    <View key={i} style={styles.deedItem}>
                      <BadgeCheck size={14} color={accent.color} />
                      <Text style={[styles.deedText, { color: colors.textSecondary }]}>
                        {deed}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: Takbir Raya Audio & Text */}
        {activeTab === 'takbir' && (
          <View style={styles.takbirContainer}>
            {/* Audio Player Card */}
            <View
              style={[
                styles.takbirPlayerCard,
                {
                  backgroundColor: colors.card,
                  borderColor: accent.color,
                  shadowColor: accent.color,
                },
              ]}
            >
              <View style={styles.takbirPlayerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.takbirTitle, { color: colors.text }]}>
                    {language === 'en' ? (TAKBIR_RAYA_DATA.titleEn || TAKBIR_RAYA_DATA.title) : TAKBIR_RAYA_DATA.title}
                  </Text>
                  <Text style={[styles.takbirSub, { color: colors.textSecondary }]}>
                    {t('takbirSub')}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={toggleTakbirAudio}
                  style={[
                    styles.takbirPlayBtn,
                    {
                      backgroundColor: isTakbirPlaying ? colors.danger : accent.color,
                    },
                  ]}
                >
                  {isTakbirPlaying ? (
                    <Square size={20} color={colors.white} />
                  ) : (
                    <Play size={20} color={colors.white} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={[styles.takbirStatusText, { color: accent.color }]}>
                {isTakbirPlaying ? t('takbirPlaying') : t('takbirPrompt')}
              </Text>
            </View>

            {/* Fadhilat & Kelebihan */}
            <View style={[styles.virtueCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <BookOpen size={16} color={accent.color} />
              <Text style={[styles.virtueText, { color: colors.textSecondary }]}>
                {language === 'en' ? (TAKBIR_RAYA_DATA.virtueEn || TAKBIR_RAYA_DATA.virtue) : TAKBIR_RAYA_DATA.virtue}
              </Text>
            </View>

            {/* Lafaz Takbir Sections */}
            {TAKBIR_RAYA_DATA.arabicFull.map((arabic, idx) => (
              <View
                key={idx}
                style={[
                  styles.takbirVerseCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.arabicMatan, { color: colors.text }]}>{arabic}</Text>
                <Text style={[styles.rumiMatan, { color: accent.color }]}>
                  {TAKBIR_RAYA_DATA.rumiFull[idx]}
                </Text>
                <Text style={[styles.transMatan, { color: colors.textSecondary }]}>
                  "{(language === 'en' && TAKBIR_RAYA_DATA.translationEnglish ? TAKBIR_RAYA_DATA.translationEnglish[idx] : TAKBIR_RAYA_DATA.translationMalay[idx])}"
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  tabSegment: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  eventTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventName: {
    fontSize: 15,
    fontWeight: '700',
  },
  eventNameArabic: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  eventBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  holidayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  holidayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  eventDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  deedsBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    gap: 6,
  },
  deedsHeading: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  deedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deedText: {
    fontSize: 12,
    flex: 1,
  },
  takbirContainer: {
    gap: 12,
  },
  takbirPlayerCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  takbirPlayerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  takbirTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  takbirSub: {
    fontSize: 12,
    marginTop: 2,
  },
  takbirPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takbirStatusText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
  },
  virtueCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  virtueText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  takbirVerseCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  arabicMatan: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'right',
  },
  rumiMatan: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  transMatan: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
