import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Linking,
  Platform,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  BookOpen,
  Compass,
  Palette,
  Moon,
  Sun,
  Shield,
  ShieldCheck,
  Clock,
  ChevronRight,
  ArrowLeft,
  Check,
  HeartHandshake,
  MapPin,
  Info,
  Globe,
  Search,
  BookMarked,
  Heart,
  ExternalLink,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Share2,
  Bookmark,
  Layers,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { ACCENT_COLORS } from '../constants/themeColors';
import { TasbihCounter } from '../components/TasbihCounter';
import { AzanDiagnosticModal } from '../components/AzanDiagnosticModal';
import { AUTHENTICATED_JAKIM_HADITH } from '../constants/hadithData';
import { MUSAFIR_GUIDE } from '../constants/musafirGuide';
import { AL_MATHURAT_DATA, MathuratVerse } from '../constants/mathuratData';
import { MANZIL_DATA } from '../constants/manzilData';
import { POST_PRAYER_WIRID } from '../constants/postPrayerData';
import { SAIYYIDUL_ISTIGHFAR_DATA } from '../constants/istighfarData';
import { ASMAUL_HUSNA_DATA } from '../constants/asmaulHusnaData';
import { HISNUL_MUSLIM_DUAS } from '../constants/duasData';
import { SELECTED_QURAN_SURAHS } from '../constants/quranData';
import { ALL_114_SURAHS, QuranSurahMetadata } from '../constants/quranSurahsList';
import { getSurahWithVerses, FullSurahDetails } from '../services/quranService';

type MoreSection =
  | 'hub'
  | 'quran'
  | 'mathurat'
  | 'manzil'
  | 'post_prayer'
  | 'hisnul_muslim'
  | 'tasbih'
  | 'duas'
  | 'asmaul_husna'
  | 'istighfar'
  | 'masjid'
  | 'hadith'
  | 'musafir'
  | 'settings';

type HubCategory = 'all' | 'quran' | 'zikir' | 'duas' | 'guides';

interface MoreScreenProps {
  route?: any;
  navigation?: any;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ route, navigation }) => {
  const { isDark, toggleTheme, accentKey, setAccentKey, colors, accent } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currentZone, isAutoLocation, setIsAutoLocation } = usePrayerTimes();

  const [activeSection, setActiveSection] = useState<MoreSection>('hub');
  const [hubCategory, setHubCategory] = useState<HubCategory>('all');
  const [hubSearchQuery, setHubSearchQuery] = useState<string>('');

  // Sub-feature states
  const [selectedHadithCategory, setSelectedHadithCategory] = useState<string>('Semua');
  const [isDiagnosticVisible, setIsDiagnosticVisible] = useState<boolean>(false);
  const [mathuratTime, setMathuratTime] = useState<'morning' | 'evening'>('morning');
  const [mathuratCounts, setMathuratCounts] = useState<{ [id: string]: number }>({});
  const [selectedQuranSurahId, setSelectedQuranSurahId] = useState<string>('surah_67');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(67);
  const [surahDetails, setSurahDetails] = useState<FullSurahDetails | null>(null);
  const [isSurahLoading, setIsSurahLoading] = useState<boolean>(false);
  const [isSurahModalOpen, setIsSurahModalOpen] = useState<boolean>(false);
  const [surahSearchQuery, setSurahSearchQuery] = useState<string>('');
  const [surahFilterType, setSurahFilterType] = useState<'all' | 'Makkah' | 'Madinah'>('all');
  const [quranTransMode, setQuranTransMode] = useState<'both' | 'en' | 'bm'>('both');
  const [asmaulSearch, setAsmaulSearch] = useState<string>('');
  const [selectedDuaCat, setSelectedDuaCat] = useState<string>('Semua');
  const [postPrayerCount, setPostPrayerCount] = useState<number>(0);

  useEffect(() => {
    if (activeSection === 'quran') {
      setIsSurahLoading(true);
      getSurahWithVerses(selectedSurahNumber)
        .then(details => {
          setSurahDetails(details);
        })
        .finally(() => {
          setIsSurahLoading(false);
        });
    }
  }, [activeSection, selectedSurahNumber]);

  React.useEffect(() => {
    const target = route?.params?.section || route?.params?.screen;
    if (target && typeof target === 'string') {
      setActiveSection(target as MoreSection);
    }
  }, [route?.params]);

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
    }
  };

  // Mathurat counter tap
  const handleMathuratCount = (id: string, max: number) => {
    triggerHaptic();
    setMathuratCounts(prev => {
      const current = prev[id] || 0;
      if (current + 1 >= max) {
        return { ...prev, [id]: max };
      }
      return { ...prev, [id]: current + 1 };
    });
  };

  // Menu items list (skipping prophets, angels, hijri birthday as requested)
  const menuItems = useMemo(() => {
    return [
      {
        id: 'quran',
        category: 'quran',
        title: t('quranTitle'),
        desc: t('quranDesc'),
        icon: BookOpen,
        color: '#10B981', // Emerald
        badge: 'Surah Pilihan',
        badgeEn: 'Key Surahs',
        action: () => setActiveSection('quran'),
      },
      {
        id: 'mathurat',
        category: 'zikir',
        title: t('mathuratTitle'),
        desc: t('mathuratDesc'),
        icon: Bookmark,
        color: '#8B5CF6', // Purple
        badge: 'Pagi & Petang',
        badgeEn: 'Morning & Eve',
        action: () => setActiveSection('mathurat'),
      },
      {
        id: 'manzil',
        category: 'duas',
        title: t('manzilTitle'),
        desc: t('manzilDesc'),
        icon: ShieldCheck,
        color: '#06B6D4', // Cyan
        badge: '33 Ayat Syifa\'',
        badgeEn: '33 Verses',
        action: () => setActiveSection('manzil'),
      },
      {
        id: 'post_prayer',
        category: 'zikir',
        title: t('postPrayerTitle'),
        desc: t('postPrayerDesc'),
        icon: Clock,
        color: '#EC4899', // Pink
        badge: 'Tartib Solat',
        badgeEn: 'Post-Prayer',
        action: () => setActiveSection('post_prayer'),
      },
      {
        id: 'tasbih',
        category: 'zikir',
        title: t('tasbihCardTitle'),
        desc: t('tasbihCardDesc'),
        icon: Sparkles,
        color: '#F59E0B', // Amber
        badge: 'Kaunter Zikir',
        badgeEn: 'Dhikr Counter',
        action: () => setActiveSection('tasbih'),
      },
      {
        id: 'istighfar',
        category: 'zikir',
        title: t('istighfarTitle'),
        desc: t('istighfarDesc'),
        icon: Heart,
        color: '#EF4444', // Rose Red
        badge: 'Penghulu Istighfar',
        badgeEn: 'Master Istighfar',
        action: () => setActiveSection('istighfar'),
      },
      {
        id: 'asmaul_husna',
        category: 'zikir',
        title: t('asmaulHusnaTitle'),
        desc: t('asmaulHusnaDesc'),
        icon: Sparkles,
        color: '#D97706', // Warm Gold
        badge: '99 Nama Allah',
        badgeEn: '99 Names',
        action: () => setActiveSection('asmaul_husna'),
      },
      {
        id: 'duas',
        category: 'duas',
        title: t('duasTitle'),
        desc: t('duasDesc'),
        icon: HeartHandshake,
        color: '#14B8A6', // Teal
        badge: 'Hisnul Muslim',
        badgeEn: 'Fortress',
        action: () => setActiveSection('duas'),
      },
      {
        id: 'masjid',
        category: 'guides',
        title: t('masjidTitle'),
        desc: t('masjidDesc'),
        icon: MapPin,
        color: '#6366F1', // Indigo
        badge: 'Peta & Adab',
        badgeEn: 'Mosque Locator',
        action: () => setActiveSection('masjid'),
      },
      {
        id: 'hadith',
        category: 'guides',
        title: t('hadithCardTitle'),
        desc: t('hadithCardDesc'),
        icon: BookMarked,
        color: '#10B981', // Emerald
        badge: t('verifiedOfficial'),
        badgeEn: 'Official',
        action: () => setActiveSection('hadith'),
      },
      {
        id: 'musafir',
        category: 'guides',
        title: t('musafirCardTitle'),
        desc: t('musafirCardDesc'),
        icon: Compass,
        color: '#64748B', // Slate
        badge: 'Jamak & Qasar',
        badgeEn: 'Jamak & Qasar',
        action: () => setActiveSection('musafir'),
      },
      {
        id: 'settings',
        category: 'guides',
        title: t('settingsCardTitle'),
        desc: t('settingsCardDesc'),
        icon: Palette,
        color: '#8B5CF6', // Violet
        badge: 'BM / EN / Mod',
        badgeEn: 'BM / EN / Theme',
        action: () => setActiveSection('settings'),
      },
      {
        id: 'azan_check',
        category: 'guides',
        title: t('azanCheckTitle'),
        desc: t('azanCheckDesc'),
        icon: ShieldCheck,
        color: accent.color,
        badge: t('diagnosticBadge'),
        badgeEn: 'Diagnostics',
        action: () => setIsDiagnosticVisible(true),
      },
    ];
  }, [language, accent.color, navigation, t]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory =
        hubCategory === 'all' ? true : item.category === hubCategory;
      const matchesSearch =
        hubSearchQuery.trim() === ''
          ? true
          : item.title.toLowerCase().includes(hubSearchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(hubSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, hubCategory, hubSearchQuery]);

  const categoriesHadith = ['Semua', 'Solat', 'Niat', 'Akhlak', 'Zikir & Doa', 'Puasa'];
  const getHadithCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Semua': return t('all');
      case 'Solat': return t('prayerCategory');
      case 'Niat': return t('intentCategory');
      case 'Akhlak': return t('akhlaqCategory');
      case 'Zikir & Doa': return t('zikrDoaCategory');
      case 'Puasa': return t('fastingCategory');
      default: return cat;
    }
  };

  const filteredHadith = AUTHENTICATED_JAKIM_HADITH.filter(h =>
    selectedHadithCategory === 'Semua' ? true : h.category === selectedHadithCategory
  );

  const filteredSurahs = useMemo(() => {
    return ALL_114_SURAHS.filter(s => {
      const matchesType =
        surahFilterType === 'all' ? true : s.revelationType === surahFilterType;
      const q = surahSearchQuery.trim().toLowerCase();
      const matchesSearch =
        q === ''
          ? true
          : s.number.toString() === q ||
            s.nameLatin.toLowerCase().includes(q) ||
            s.englishMeaning.toLowerCase().includes(q) ||
            s.malayMeaning.toLowerCase().includes(q) ||
            s.nameArabic.includes(q);
      return matchesType && matchesSearch;
    });
  }, [surahFilterType, surahSearchQuery]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Bar / Header */}
        {activeSection === 'hub' ? (
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>{t('menuTitle')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {t('menuSubtitle')}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveSection('settings')}
                style={[styles.quickSettingsBtn, { backgroundColor: colors.surfaceSubtle }]}
              >
                <Palette size={20} color={accent.color} />
              </TouchableOpacity>
            </View>

            {/* Live Search Bar */}
            <View style={[styles.searchBarBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Search size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={t('menuHubSearchPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={hubSearchQuery}
                onChangeText={setHubSearchQuery}
                clearButtonMode="while-editing"
              />
            </View>

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPillsScroll}
            >
              {[
                { id: 'all', label: t('allFeatures') },
                { id: 'quran', label: t('catQuran') },
                { id: 'zikir', label: t('catZikir') },
                { id: 'duas', label: t('catDuas') },
                { id: 'guides', label: t('catGuides') },
              ].map(cat => {
                const isSelected = hubCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.7}
                    onPress={() => setHubCategory(cat.id as HubCategory)}
                    style={[
                      styles.catPill,
                      {
                        backgroundColor: isSelected ? accent.color : colors.surfaceSubtle,
                        borderColor: isSelected ? accent.color : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        { color: isSelected ? colors.white : colors.textSecondary },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveSection('hub')}
            style={styles.backButtonRow}
          >
            <ArrowLeft size={18} color={accent.color} />
            <Text style={[styles.backButtonText, { color: accent.color }]}>{t('backToMenu')}</Text>
          </TouchableOpacity>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: HUB GRID
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'hub' && (
          <View style={styles.hubContainer}>
            {/* 2-Column Responsive Card Grid */}
            <View style={styles.gridContainer}>
              {filteredMenuItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.75}
                    onPress={item.action}
                    style={[
                      styles.hubCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {/* Top Row: Icon circle + Badge */}
                    <View style={styles.hubCardTop}>
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: `${item.color}20` },
                        ]}
                      >
                        <IconComponent size={22} color={item.color} />
                      </View>
                      <View
                        style={[
                          styles.cardBadge,
                          { backgroundColor: `${item.color}15` },
                        ]}
                      >
                        <Text style={[styles.cardBadgeText, { color: item.color }]}>
                          {language === 'en' ? item.badgeEn : item.badge}
                        </Text>
                      </View>
                    </View>

                    {/* Text Details */}
                    <View style={styles.hubCardBody}>
                      <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        style={[styles.cardDesc, { color: colors.textSecondary }]}
                        numberOfLines={2}
                      >
                        {item.desc}
                      </Text>
                    </View>

                    {/* Bottom Action Hint */}
                    <View style={styles.cardFooter}>
                      <Text style={[styles.cardActionText, { color: item.color }]}>
                        {language === 'en' ? 'Open' : 'Buka'}
                      </Text>
                      <ChevronRight size={14} color={item.color} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* App Promise Banner */}
            <View
              style={[
                styles.promiseBanner,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Shield size={20} color={accent.color} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.promiseTitle, { color: colors.text }]}>
                  {t('promiseTitle')}
                </Text>
                <Text style={[styles.promiseDesc, { color: colors.textSecondary }]}>
                  {t('promiseDesc')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: AL-MATHURAT SUGHRÁ
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'mathurat' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('mathuratTitle')}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {language === 'en'
                  ? 'Morning & evening authentic supplications compiled by Imam Hassan al-Banna.'
                  : 'Rangkaian ayat Al-Quran dan doa ma\'thurat susunan Imam Hassan al-Banna.'}
              </Text>

              {/* Time Toggle: Pagi / Petang */}
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setMathuratTime('morning')}
                  style={[
                    styles.toggleBtn,
                    {
                      backgroundColor: mathuratTime === 'morning' ? accent.color : colors.surfaceSubtle,
                      borderColor: mathuratTime === 'morning' ? accent.color : colors.border,
                    },
                  ]}
                >
                  <Sun size={16} color={mathuratTime === 'morning' ? colors.white : colors.textSecondary} />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      { color: mathuratTime === 'morning' ? colors.white : colors.text },
                    ]}
                  >
                    {language === 'en' ? 'Morning (Pagi)' : 'Waktu Pagi'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setMathuratTime('evening')}
                  style={[
                    styles.toggleBtn,
                    {
                      backgroundColor: mathuratTime === 'evening' ? accent.color : colors.surfaceSubtle,
                      borderColor: mathuratTime === 'evening' ? accent.color : colors.border,
                    },
                  ]}
                >
                  <Moon size={16} color={mathuratTime === 'evening' ? colors.white : colors.textSecondary} />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      { color: mathuratTime === 'evening' ? colors.white : colors.text },
                    ]}
                  >
                    {language === 'en' ? 'Evening (Petang)' : 'Waktu Petang'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Verses List */}
            {AL_MATHURAT_DATA.filter(
              v => v.timeOfDay === 'both' || v.timeOfDay === mathuratTime
            ).map((v, idx) => {
              const currentCount = mathuratCounts[v.id] || 0;
              const isCompleted = currentCount >= v.repeatCount;
              return (
                <View
                  key={v.id}
                  style={[
                    styles.verseCard,
                    { backgroundColor: colors.card, borderColor: isCompleted ? colors.success : colors.border },
                  ]}
                >
                  <View style={styles.verseCardTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.verseNumberBadge, { backgroundColor: accent.softBg }]}>
                        <Text style={[styles.verseNumberText, { color: accent.color }]}>{idx + 1}</Text>
                      </View>
                      <Text style={[styles.verseTitle, { color: colors.text }]}>
                        {language === 'en' ? v.titleEn : v.title}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.repeatBadge,
                        { backgroundColor: isCompleted ? 'rgba(16,185,129,0.15)' : colors.surfaceSubtle },
                      ]}
                    >
                      <Text
                        style={[
                          styles.repeatBadgeText,
                          { color: isCompleted ? colors.success : colors.textSecondary },
                        ]}
                      >
                        {v.repeatCount > 1 ? `${currentCount}/${v.repeatCount}x` : '1x'}
                      </Text>
                    </View>
                  </View>

                  {/* Arabic */}
                  <Text style={[styles.arabicTextLarge, { color: colors.text }]}>{v.arabic}</Text>

                  {/* Rumi */}
                  <Text style={[styles.rumiText, { color: accent.color }]}>{v.rumi}</Text>

                  {/* Translation */}
                  <Text style={[styles.transText, { color: colors.textSecondary }]}>
                    "{language === 'en' ? v.translationEn : v.translationMalay}"
                  </Text>

                  {/* Tap counter button if repeatable */}
                  {v.repeatCount > 1 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleMathuratCount(v.id, v.repeatCount)}
                      style={[
                        styles.tapCountBtn,
                        {
                          backgroundColor: isCompleted ? colors.success : accent.color,
                        },
                      ]}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 size={16} color={colors.white} />
                          <Text style={styles.tapCountBtnText}>
                            {language === 'en' ? 'Completed (Selesai)' : 'Selesai Dibaca'}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.tapCountBtnText}>
                          {language === 'en'
                            ? `Tap to Count (${currentCount}/${v.repeatCount})`
                            : `Tekan untuk Kira (${currentCount}/${v.repeatCount})`}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: AYAT AL-MANZIL
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'manzil' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('manzilTitle')}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {language === 'en'
                  ? '33 protective Quranic verses for spiritual healing, peace, and warding off evil.'
                  : 'Himpunan 33 ayat Al-Quran penawar gangguan sihir, jin, dan perisai rohani.'}
              </Text>
            </View>

            {MANZIL_DATA.map((section, idx) => (
              <View
                key={section.id}
                style={[
                  styles.verseCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.verseCardTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.verseNumberBadge, { backgroundColor: '#06B6D420' }]}>
                      <Text style={[styles.verseNumberText, { color: '#06B6D4' }]}>{idx + 1}</Text>
                    </View>
                    <View>
                      <Text style={[styles.verseTitle, { color: colors.text }]}>
                        {language === 'en' ? section.surahEn : section.surah}
                      </Text>
                      <Text style={[styles.verseSubRange, { color: colors.textSecondary }]}>
                        {section.ayatRange}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Arabic */}
                <Text style={[styles.arabicTextLarge, { color: colors.text }]}>
                  {section.arabic}
                </Text>

                {/* Rumi */}
                <Text style={[styles.rumiText, { color: '#06B6D4' }]}>{section.rumi}</Text>

                {/* Translation */}
                <Text style={[styles.transText, { color: colors.textSecondary }]}>
                  "{language === 'en' ? section.translationEn : section.translationMalay}"
                </Text>

                {/* Virtue Box */}
                {section.virtue && (
                  <View style={[styles.virtueBox, { backgroundColor: colors.surfaceSubtle }]}>
                    <Text style={[styles.virtueHeading, { color: colors.text }]}>
                      {language === 'en' ? 'Spiritual Virtue:' : 'Fadhilat & Hikmah:'}
                    </Text>
                    <Text style={[styles.virtueContent, { color: colors.textSecondary }]}>
                      {language === 'en' ? section.virtueEn : section.virtue}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: WIRID SELEPAS SOLAT
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'post_prayer' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('postPrayerTitle')}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {language === 'en'
                  ? 'Authentic step-by-step supplications, 33x tasbih, and prayer after obligatory solah.'
                  : 'Tartib zikir, tasbih 33 kali, dan doa ma\'thur selepas menunaikan solat fardhu.'}
              </Text>
            </View>

            {POST_PRAYER_WIRID.map(item => (
              <View
                key={item.step}
                style={[
                  styles.verseCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.verseCardTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.verseNumberBadge, { backgroundColor: '#EC489920' }]}>
                      <Text style={[styles.verseNumberText, { color: '#EC4899' }]}>
                        {item.step}
                      </Text>
                    </View>
                    <Text style={[styles.verseTitle, { color: colors.text }]}>
                      {language === 'en' ? item.titleEn : item.title}
                    </Text>
                  </View>
                  <View style={[styles.repeatBadge, { backgroundColor: colors.surfaceSubtle }]}>
                    <Text style={[styles.repeatBadgeText, { color: colors.textSecondary }]}>
                      {item.repeat}x
                    </Text>
                  </View>
                </View>

                {/* Arabic */}
                <Text style={[styles.arabicTextLarge, { color: colors.text }]}>{item.arabic}</Text>

                {/* Rumi */}
                <Text style={[styles.rumiText, { color: '#EC4899' }]}>{item.rumi}</Text>

                {/* Translation */}
                <Text style={[styles.transText, { color: colors.textSecondary }]}>
                  "{language === 'en' ? item.translationEn : item.translationMalay}"
                </Text>

                {/* Step 5 interactive counter */}
                {item.repeat === 33 && (
                  <View style={styles.interactiveBox}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        triggerHaptic();
                        setPostPrayerCount(prev => (prev < 33 ? prev + 1 : 33));
                      }}
                      style={[
                        styles.tapCountBtn,
                        {
                          backgroundColor: postPrayerCount >= 33 ? colors.success : '#EC4899',
                        },
                      ]}
                    >
                      <Text style={styles.tapCountBtnText}>
                        {postPrayerCount >= 33
                          ? (language === 'en' ? 'Completed 33x (Selesai)' : 'Genap 33 Kali Selesai')
                          : (language === 'en' ? `Tap to Count: ${postPrayerCount}/33` : `Kira Zikir: ${postPrayerCount}/33`)}
                      </Text>
                    </TouchableOpacity>
                    {postPrayerCount > 0 && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPostPrayerCount(0)}
                        style={styles.resetBtnInline}
                      >
                        <RotateCcw size={14} color={colors.textSecondary} />
                        <Text style={[styles.resetBtnText, { color: colors.textSecondary }]}>
                          {language === 'en' ? 'Reset' : 'Set Semula'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: SAIYYIDUL ISTIGHFAR
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'istighfar' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {language === 'en' ? SAIYYIDUL_ISTIGHFAR_DATA.titleEn : SAIYYIDUL_ISTIGHFAR_DATA.title}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {language === 'en' ? SAIYYIDUL_ISTIGHFAR_DATA.sourceEn : SAIYYIDUL_ISTIGHFAR_DATA.source}
              </Text>
            </View>

            {/* Main Supplication Box */}
            <View style={[styles.verseCard, { backgroundColor: colors.card, borderColor: '#EF4444' }]}>
              <View style={[styles.cardBadge, { alignSelf: 'flex-start', backgroundColor: '#EF444420', marginBottom: 8 }]}>
                <Text style={[styles.cardBadgeText, { color: '#EF4444' }]}>
                  {language === 'en' ? 'Recommended: Fajr & Maghrib' : 'Waktu Amalan: Subuh & Maghrib'}
                </Text>
              </View>

              <Text style={[styles.arabicTextGrand, { color: colors.text }]}>
                {SAIYYIDUL_ISTIGHFAR_DATA.arabic}
              </Text>
              <Text style={[styles.rumiText, { color: '#EF4444', marginTop: 12 }]}>
                {SAIYYIDUL_ISTIGHFAR_DATA.rumi}
              </Text>
              <Text style={[styles.transText, { color: colors.textSecondary, marginTop: 8 }]}>
                "{language === 'en' ? SAIYYIDUL_ISTIGHFAR_DATA.translationEn : SAIYYIDUL_ISTIGHFAR_DATA.translationMalay}"
              </Text>
            </View>

            {/* Promise of Paradise Box */}
            <View style={[styles.virtueBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' }]}>
              <Heart size={20} color="#EF4444" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.virtueHeading, { color: '#EF4444' }]}>
                  {language === 'en' ? 'Virtue: Guarantee of Paradise' : 'Fadhilat Agung: Jaminan Syurga'}
                </Text>
                <Text style={[styles.virtueContent, { color: colors.text }]}>
                  {language === 'en' ? SAIYYIDUL_ISTIGHFAR_DATA.virtueEn : SAIYYIDUL_ISTIGHFAR_DATA.virtueMalay}
                </Text>
              </View>
            </View>

            {/* Guidance Reflections */}
            <View style={[styles.guidanceCard, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.guidanceTitle, { color: colors.text }]}>
                {language === 'en' ? '5 Core Spiritual Lessons:' : '5 Pengajaran & Penghayatan Utama:'}
              </Text>
              {(language === 'en' ? SAIYYIDUL_ISTIGHFAR_DATA.guidancePointsEn : SAIYYIDUL_ISTIGHFAR_DATA.guidancePoints).map((pt, i) => (
                <View key={i} style={styles.guidanceItem}>
                  <CheckCircle2 size={15} color="#EF4444" />
                  <Text style={[styles.guidanceText, { color: colors.textSecondary }]}>{pt}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: ASMAUL HUSNA (99 NAMA ALLAH)
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'asmaul_husna' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('asmaulHusnaTitle')}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {t('asmaulHusnaDesc')}
              </Text>

              {/* Search Bar for 99 Names */}
              <View style={[styles.searchBarBox, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 10 }]}>
                <Search size={16} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder={language === 'en' ? 'Search by name or meaning...' : 'Cari nama atau makna...'}
                  placeholderTextColor={colors.textSecondary}
                  value={asmaulSearch}
                  onChangeText={setAsmaulSearch}
                />
              </View>
            </View>

            {/* 99 Names Grid */}
            <View style={styles.asmaulGrid}>
              {ASMAUL_HUSNA_DATA.filter(n => {
                if (!asmaulSearch.trim()) return true;
                const q = asmaulSearch.toLowerCase();
                return (
                  n.rumi.toLowerCase().includes(q) ||
                  n.meaningMalay.toLowerCase().includes(q) ||
                  n.meaningEn.toLowerCase().includes(q) ||
                  n.number.toString() === q
                );
              }).map(name => (
                <View
                  key={name.number}
                  style={[
                    styles.asmaulCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={[styles.asmaulNumBadge, { backgroundColor: '#D9770620' }]}>
                    <Text style={[styles.asmaulNumText, { color: '#D97706' }]}>#{name.number}</Text>
                  </View>
                  <Text style={[styles.asmaulArabic, { color: colors.text }]}>{name.arabic}</Text>
                  <Text style={[styles.asmaulRumi, { color: '#D97706' }]}>{name.rumi}</Text>
                  <Text style={[styles.asmaulMeaning, { color: colors.textSecondary }]} numberOfLines={2}>
                    {language === 'en' ? name.meaningEn : name.meaningMalay}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: KOLEKSI DOA HARIAN (HISNUL MUSLIM)
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'duas' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('duasTitle')}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {t('duasDesc')}
              </Text>

              {/* Category selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsScroll}
              >
                {[
                  { key: 'Semua', labelBm: 'Semua', labelEn: 'All' },
                  { key: 'Harian', labelBm: 'Harian', labelEn: 'Daily' },
                  { key: 'Rumah', labelBm: 'Rumah', labelEn: 'Home' },
                  { key: 'Masjid', labelBm: 'Masjid', labelEn: 'Mosque' },
                  { key: 'Makan', labelBm: 'Makan', labelEn: 'Meals' },
                  { key: 'Musafir', labelBm: 'Musafir', labelEn: 'Travel' },
                  { key: 'Kesihatan', labelBm: 'Kesihatan', labelEn: 'Health' },
                  { key: 'Perlindungan', labelBm: 'Perlindungan', labelEn: 'Protection' },
                ].map(c => {
                  const isSelected = selectedDuaCat === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      onPress={() => setSelectedDuaCat(c.key)}
                      style={[
                        styles.catPill,
                        {
                          backgroundColor: isSelected ? '#14B8A6' : colors.surfaceSubtle,
                          borderColor: isSelected ? '#14B8A6' : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.catPillText, { color: isSelected ? colors.white : colors.textSecondary }]}>
                        {language === 'en' ? c.labelEn : c.labelBm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Duas List */}
            {HISNUL_MUSLIM_DUAS.filter(d =>
              selectedDuaCat === 'Semua' ? true : d.category === selectedDuaCat
            ).map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.verseCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.verseCardTop}>
                  <Text style={[styles.verseTitle, { color: colors.text }]}>
                    {language === 'en' ? item.titleEn : item.title}
                  </Text>
                  <View style={[styles.repeatBadge, { backgroundColor: '#14B8A615' }]}>
                    <Text style={[styles.repeatBadgeText, { color: '#14B8A6' }]}>
                      {language === 'en' ? item.categoryEn : item.category}
                    </Text>
                  </View>
                </View>

                {/* Arabic */}
                <Text style={[styles.arabicTextLarge, { color: colors.text }]}>{item.arabic}</Text>
                {/* Rumi */}
                <Text style={[styles.rumiText, { color: '#14B8A6' }]}>{item.rumi}</Text>
                {/* Translation */}
                <Text style={[styles.transText, { color: colors.textSecondary }]}>
                  "{language === 'en' ? item.translationEn : item.translationMalay}"
                </Text>

                <Text style={[styles.sourceRefText, { color: colors.textSecondary }]}>
                  📖 {item.reference}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: AL-QURAN (COMPLETE 114 SURAHS & READER)
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'quran' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t('quranTitle')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsSurahModalOpen(true)}
                  style={[styles.allSurahsBtn, { backgroundColor: '#10B981', borderColor: '#10B981' }]}
                >
                  <BookOpen size={13} color="#FFFFFF" />
                  <Text style={styles.allSurahsBtnText}>
                    {language === 'en' ? 'All 114 Surahs' : '114 Surah'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {language === 'en'
                  ? 'Access the complete Noble Quran, authentic translations, and verse-by-verse reflection.'
                  : 'Akses teks lengkap 114 Surah Al-Quran, terjemahan dwi-bahasa rasmi, dan penghayatan makna ayat.'}
              </Text>

              {/* Popular Surahs Horizontal Chip Selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsScroll}
              >
                {[
                  { num: 67, name: 'Al-Mulk', arabic: 'المُلْك' },
                  { num: 1, name: 'Al-Fatihah', arabic: 'الفَاتِحَة' },
                  { num: 18, name: 'Al-Kahf', arabic: 'الكَهْف' },
                  { num: 36, name: 'Ya-Sin', arabic: 'يس' },
                  { num: 32, name: 'As-Sajdah', arabic: 'السَّجْدَة' },
                  { num: 56, name: 'Al-Waqi\'ah', arabic: 'الوَاقِعَة' },
                  { num: 55, name: 'Ar-Rahman', arabic: 'الرَّحْمَن' },
                  { num: 112, name: 'Al-Ikhlas', arabic: 'الإِخْلَاص' },
                  { num: 113, name: 'Al-Falaq', arabic: 'الفَلَق' },
                  { num: 114, name: 'An-Nas', arabic: 'النَّاس' },
                  { num: 108, name: 'Al-Kawthar', arabic: 'الكَوْثَر' },
                  { num: 103, name: 'Al-\'Asr', arabic: 'العَصْر' },
                  { num: 93, name: 'Ad-Duha', arabic: 'الضُّحَى' },
                  { num: 94, name: 'Ash-Sharh', arabic: 'الشَّرْح' },
                ].map(s => {
                  const isSelected = selectedSurahNumber === s.num;
                  return (
                    <TouchableOpacity
                      key={s.num}
                      onPress={() => setSelectedSurahNumber(s.num)}
                      style={[
                        styles.catPill,
                        {
                          backgroundColor: isSelected ? '#10B981' : colors.surfaceSubtle,
                          borderColor: isSelected ? '#10B981' : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.catPillText, { color: isSelected ? colors.white : colors.textSecondary }]}>
                        #{s.num} {s.name} ({s.arabic})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Selected Surah Meta & Verses */}
            {(() => {
              const activeMeta =
                surahDetails?.metadata ||
                ALL_114_SURAHS.find(s => s.number === selectedSurahNumber) ||
                ALL_114_SURAHS[66];

              return (
                <View>
                  {/* Surah Meta Card */}
                  <View style={[styles.surahMetaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={[styles.surahMetaTitle, { color: colors.text }]}>
                          Surah {activeMeta.nameLatin} ({activeMeta.nameArabic})
                        </Text>
                        <Text style={[styles.surahMetaMeaning, { color: '#10B981' }]}>
                          {activeMeta.englishMeaning} • {activeMeta.malayMeaning}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end', gap: 4 }}>
                        <View style={[styles.cardBadge, { backgroundColor: '#10B98120' }]}>
                          <Text style={[styles.cardBadgeText, { color: '#10B981' }]}>
                            {activeMeta.versesCount} {t('verses')} • {activeMeta.revelationType === 'Makkah' ? t('makkah') : t('madinah')}
                          </Text>
                        </View>
                        {surahDetails?.isFromOfflineCache && (
                          <View style={[styles.cardBadge, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                            <Text style={{ fontSize: 9, fontWeight: '700', color: '#10B981' }}>
                              ✓ {t('offlineCached')}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={[styles.surahThemeText, { color: colors.textSecondary }]}>
                      {language === 'en' ? activeMeta.themeEn : activeMeta.themeBm}
                    </Text>

                    {(activeMeta.virtueEn || activeMeta.virtueBm) ? (
                      <Text style={[styles.surahVirtueText, { color: '#10B981' }]}>
                        ✨ {language === 'en' ? (activeMeta.virtueEn || activeMeta.virtueBm) : (activeMeta.virtueBm || activeMeta.virtueEn)}
                      </Text>
                    ) : null}

                    {/* Translation View Mode Switcher */}
                    <View style={[styles.quranTransRow, { borderTopColor: colors.border }]}>
                      <Text style={[styles.quranTransLabel, { color: colors.textSecondary }]}>
                        {t('showTranslation')}
                      </Text>
                      <View style={styles.quranTransPills}>
                        {[
                          { key: 'both', label: t('transBoth') },
                          { key: 'bm', label: t('transMalay') },
                          { key: 'en', label: t('transEn') },
                        ].map(opt => {
                          const isSel = quranTransMode === opt.key;
                          return (
                            <TouchableOpacity
                              key={opt.key}
                              onPress={() => setQuranTransMode(opt.key as any)}
                              style={[
                                styles.quranTransBtn,
                                {
                                  backgroundColor: isSel ? '#10B981' : colors.surfaceSubtle,
                                  borderColor: isSel ? '#10B981' : colors.border,
                                },
                              ]}
                            >
                              <Text style={[styles.quranTransBtnText, { color: isSel ? colors.white : colors.textSecondary }]}>
                                {opt.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  {/* Loading State or Verses List */}
                  {isSurahLoading ? (
                    <View style={[styles.loadingBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <ActivityIndicator size="small" color="#10B981" />
                      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        {t('loadingSurah')}
                      </Text>
                    </View>
                  ) : (
                    surahDetails?.verses.map(v => (
                      <View
                        key={v.verseNumber}
                        style={[
                          styles.verseCard,
                          { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                      >
                        <View style={styles.verseCardTop}>
                          <View style={[styles.verseNumberBadge, { backgroundColor: '#10B98120' }]}>
                            <Text style={[styles.verseNumberText, { color: '#10B981' }]}>
                              {v.verseNumber}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 10, color: colors.textSecondary }}>
                            {activeMeta.nameLatin} : {v.verseNumber}
                          </Text>
                        </View>

                        {/* Arabic Matan */}
                        <Text style={[styles.arabicTextLarge, { color: colors.text }]}>{v.arabic}</Text>

                        {/* Rumi Transliteration if available */}
                        {v.rumi ? (
                          <Text style={[styles.rumiText, { color: '#10B981' }]}>{v.rumi}</Text>
                        ) : null}

                        {/* Malay Translation */}
                        {(quranTransMode === 'both' || quranTransMode === 'bm') && v.translationMalay ? (
                          <View style={{ marginTop: 6 }}>
                            <Text style={[styles.transSubLabel, { color: colors.textSecondary }]}>
                              🇲🇾 {t('transMalay')}:
                            </Text>
                            <Text style={[styles.transText, { color: colors.text }]}>
                              "{v.translationMalay}"
                            </Text>
                          </View>
                        ) : null}

                        {/* English Translation */}
                        {(quranTransMode === 'both' || quranTransMode === 'en') && v.translationEn ? (
                          <View style={{ marginTop: 6 }}>
                            <Text style={[styles.transSubLabel, { color: colors.textSecondary }]}>
                              🇬🇧 {t('transEn')}:
                            </Text>
                            <Text style={[styles.transText, { color: colors.text }]}>
                              "{v.translationEn}"
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    ))
                  )}
                </View>
              );
            })()}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: CARI MASJID & ADAB
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'masjid' && (
          <View style={styles.readerContainer}>
            <View style={styles.readerHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('masjidTitle')}
              </Text>
              <Text style={[styles.readerHeaderSub, { color: colors.textSecondary }]}>
                {t('masjidDesc')}
              </Text>
            </View>

            {/* Launch Map Action Card */}
            <View style={[styles.verseCard, { backgroundColor: colors.card, borderColor: '#6366F1' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MapPin size={24} color="#6366F1" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.verseTitle, { color: colors.text }]}>
                    {language === 'en' ? 'Locate Nearby Mosques' : 'Kesan Masjid / Surau Terdekat'}
                  </Text>
                  <Text style={[styles.transText, { color: colors.textSecondary }]}>
                    {language === 'en'
                      ? 'Open navigation map to find mosques and surau near your current location.'
                      : 'Buka aplikasi peta untuk navigasi ke masjid dan surau berhampiran kedudukan anda.'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Linking.openURL('https://www.google.com/maps/search/masjid+surau+near+me');
                }}
                style={[styles.tapCountBtn, { backgroundColor: '#6366F1', marginTop: 12 }]}
              >
                <ExternalLink size={16} color="#FFFFFF" />
                <Text style={styles.tapCountBtnText}>
                  {language === 'en' ? 'Open in Maps' : 'Buka Dalam Peta (Google Maps)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mosque Etiquette */}
            <View style={[styles.guidanceCard, { backgroundColor: colors.surfaceSubtle, marginTop: 12 }]}>
              <Text style={[styles.guidanceTitle, { color: colors.text }]}>
                {language === 'en' ? '6 Essential Mosque Etiquettes:' : '6 Adab Utama Ketika Menghadiri Masjid:'}
              </Text>
              {[
                { bm: 'Memakai pakaian bersih, sopan, menutup aurat dan memakai wangian (bagi lelaki).', en: 'Wear clean, modest attire covering the awrah, and apply non-alcoholic scent (for men).' },
                { bm: 'Melangkah masuk dengan kaki kanan berserta doa masuk masjid.', en: 'Step in with the right foot while reciting the mosque entrance supplication.' },
                { bm: 'Menunaikan Solat Sunat Tahiyyatul Masjid dua rakaat sebelum duduk.', en: 'Offer two rak\'ahs of Tahiyyatul Masjid before sitting down.' },
                { bm: 'Mematikan nada dering telefon bimbit atau set kepada mod senyap.', en: 'Switch phone ringtone to silent to preserve congregational sanctity.' },
                { bm: 'Tidak melangkah bahu jemaah lain dan memenuhkan saf hadapan terlebih dahulu.', en: 'Do not step over others\' shoulders; fill the front rows continuously.' },
                { bm: 'Melangkah keluar dengan kaki kiri berserta doa memohon limpah kurnia Allah.', en: 'Step out with the left foot reciting the exit supplication seeking Allah\'s bounty.' },
              ].map((adab, idx) => (
                <View key={idx} style={styles.guidanceItem}>
                  <CheckCircle2 size={16} color="#6366F1" />
                  <Text style={[styles.guidanceText, { color: colors.textSecondary }]}>
                    {language === 'en' ? adab.en : adab.bm}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}


        {/* ═══════════════════════════════════════════════════════
            SECTION: TASBIH DIGITAL
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'tasbih' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('tasbihTitle')}</Text>
            <TasbihCounter />
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: HADITH SAHIH JAKIM
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'hadith' && (
          <View style={styles.hadithContainer}>
            <View style={styles.hadithHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('hadithHeader')}
              </Text>
              <Text style={[styles.hadithHeaderSub, { color: colors.textSecondary }]}>
                {t('hadithSub')}
              </Text>
            </View>

            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipScroll}
            >
              {categoriesHadith.map(cat => {
                const isSelected = selectedHadithCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedHadithCategory(cat)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? accent.color : colors.card,
                        borderColor: isSelected ? accent.color : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isSelected ? colors.white : colors.textSecondary },
                      ]}
                    >
                      {getHadithCategoryLabel(cat)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Hadith Cards */}
            {filteredHadith.map(item => (
              <View
                key={item.id}
                style={[
                  styles.hadithCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.hadithTopRow}>
                  <View style={[styles.categoryTag, { backgroundColor: accent.softBg }]}>
                    <Text style={[styles.categoryTagText, { color: accent.color }]}>
                      {language === 'en' ? (item.categoryEn || item.category) : item.category}
                    </Text>
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[styles.statusTagText, { color: colors.success }]}>
                      {language === 'en' ? (item.statusEn || item.status) : item.status}
                    </Text>
                  </View>
                </View>

                {/* Arabic Matan */}
                <Text style={[styles.hadithArabic, { color: colors.text }]}>{item.arabic}</Text>

                {/* Malay / English Translation */}
                <Text style={[styles.hadithMalay, { color: colors.text }]}>
                  "{language === 'en' ? (item.english || item.malay) : item.malay}"
                </Text>

                {/* Narrator & Authority Source */}
                <View style={styles.narratorBox}>
                  <Text style={[styles.narratorText, { color: colors.textSecondary }]}>
                    {language === 'en' ? (item.narratorEn || item.narrator) : item.narrator}
                  </Text>
                  <Text style={[styles.authorityText, { color: accent.color }]}>
                    📌 {item.sourceAuthority}
                  </Text>
                </View>

                {/* Lessons */}
                <View style={[styles.lessonsBox, { backgroundColor: colors.surfaceSubtle }]}>
                  <Text style={[styles.lessonsTitle, { color: colors.text }]}>
                    {t('lessonsHeading')}
                  </Text>
                  {(language === 'en' && item.lessonsEn ? item.lessonsEn : item.lessons).map((lesson, idx) => (
                    <Text key={idx} style={[styles.lessonPoint, { color: colors.textSecondary }]}>
                      • {lesson}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: PANDUAN MUSAFIR
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'musafir' && (
          <View style={styles.musafirContainer}>
            <View style={styles.musafirHeaderBox}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('musafirHeader')}
              </Text>
              <Text style={[styles.hadithHeaderSub, { color: colors.textSecondary }]}>
                {t('musafirSub')}
              </Text>
            </View>

            {MUSAFIR_GUIDE.map(topic => (
              <View
                key={topic.id}
                style={[
                  styles.topicCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.topicTitle, { color: accent.color }]}>
                  {language === 'en' ? (topic.titleEn || topic.title) : topic.title}
                </Text>
                <Text style={[styles.topicSummary, { color: colors.text }]}>
                  {language === 'en' ? (topic.summaryEn || topic.summary) : topic.summary}
                </Text>

                <View style={styles.pointsList}>
                  {(language === 'en' && topic.pointsEn ? topic.pointsEn : topic.points).map((pt, i) => (
                    <Text key={i} style={[styles.pointLine, { color: colors.textSecondary }]}>
                      ✔ {pt}
                    </Text>
                  ))}
                </View>

                {/* Niat formulas if present */}
                {topic.intentFormulas && (
                  <View style={styles.formulasContainer}>
                    <Text style={[styles.formulaHeading, { color: colors.text }]}>
                      {t('intentHeading')}
                    </Text>
                    {topic.intentFormulas.map((f, fi) => (
                      <View
                        key={fi}
                        style={[
                          styles.formulaItem,
                          { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                        ]}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={[styles.fPrayer, { color: accent.color }]}>
                            {language === 'en' ? (f.prayerEn || f.prayer) : f.prayer}
                          </Text>
                          <Text style={[styles.fType, { color: colors.textSecondary }]}>
                            {language === 'en' ? (f.typeEn || f.type) : f.type}
                          </Text>
                        </View>
                        <Text style={[styles.fArabic, { color: colors.text }]}>{f.arabic}</Text>
                        <Text style={[styles.fRumi, { color: colors.text }]}>{f.rumi}</Text>
                        <Text style={[styles.fTrans, { color: colors.textSecondary }]}>
                          "{language === 'en' ? (f.translationEn || f.translation) : f.translation}"
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION: APP SETTINGS
        ════════════════════════════════════════════════════════ */}
        {activeSection === 'settings' && (
          <View style={styles.settingsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settingsHeader')}</Text>

            {/* Language Switcher (BM / EN) */}
            <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.settingRowLeft}>
                <Globe size={20} color={accent.color} />
                <View>
                  <Text style={[styles.settingRowTitle, { color: colors.text }]}>
                    {t('languageTitle')}
                  </Text>
                  <Text style={[styles.settingRowSub, { color: colors.textSecondary }]}>
                    {language === 'bm' ? 'Bahasa Melayu' : 'English'}
                  </Text>
                </View>
              </View>
              <View style={styles.langPillsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setLanguage('bm')}
                  style={[
                    styles.langPill,
                    {
                      backgroundColor: language === 'bm' ? accent.color : colors.surfaceSubtle,
                      borderColor: language === 'bm' ? accent.color : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.langPillText,
                      { color: language === 'bm' ? colors.white : colors.textSecondary },
                    ]}
                  >
                    BM
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setLanguage('en')}
                  style={[
                    styles.langPill,
                    {
                      backgroundColor: language === 'en' ? accent.color : colors.surfaceSubtle,
                      borderColor: language === 'en' ? accent.color : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.langPillText,
                      { color: language === 'en' ? colors.white : colors.textSecondary },
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Theme Mode Toggle (Dark / Light) */}
            <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.settingRowLeft}>
                {isDark ? <Moon size={20} color={accent.color} /> : <Sun size={20} color={accent.color} />}
                <View>
                  <Text style={[styles.settingRowTitle, { color: colors.text }]}>{t('darkModeTitle')}</Text>
                  <Text style={[styles.settingRowSub, { color: colors.textSecondary }]}>
                    {isDark ? t('darkModeDark') : t('darkModeLight')}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                thumbColor={isDark ? accent.color : colors.cardElevated}
                trackColor={{ false: colors.surfaceSubtle, true: accent.softBg }}
              />
            </View>

            {/* Accent Color Palette Picker */}
            <View style={[styles.paletteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.paletteTitle, { color: colors.text }]}>{t('accentColorTitle')}</Text>
              <Text style={[styles.paletteSub, { color: colors.textSecondary }]}>
                {t('accentColorSub')}
              </Text>

              <View style={styles.colorOptionsRow}>
                {ACCENT_COLORS.map(opt => {
                  const isSelected = accentKey === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      activeOpacity={0.7}
                      onPress={() => setAccentKey(opt.key)}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: opt.color },
                        isSelected && styles.colorCircleSelected,
                      ]}
                    >
                      {isSelected && <Check size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={[styles.selectedColorName, { color: accent.color }]}>
                {t('selectedColor')}: {accent.name}
              </Text>
            </View>

            {/* GPS Auto Toggle */}
            <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 }]}>
              <View style={styles.settingRowLeft}>
                <MapPin size={20} color={accent.color} />
                <View>
                  <Text style={[styles.settingRowTitle, { color: colors.text }]}>
                    {t('gpsAutoTitle')}
                  </Text>
                  <Text style={[styles.settingRowSub, { color: colors.textSecondary }]}>
                    {t('currentZoneLabel')}: {currentZone.code} ({currentZone.state})
                  </Text>
                </View>
              </View>
              <Switch
                value={isAutoLocation}
                onValueChange={setIsAutoLocation}
                thumbColor={isAutoLocation ? accent.color : colors.cardElevated}
                trackColor={{ false: colors.surfaceSubtle, true: accent.softBg }}
              />
            </View>

            {/* Version & Info Card */}
            <View
              style={[
                styles.aboutCard,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.aboutAppName, { color: colors.text }]}>
                {t('aboutAppTitle')}
              </Text>
              <Text style={[styles.aboutAppVer, { color: colors.textSecondary }]}>
                {t('aboutAppVer')}
              </Text>
              <Text style={[styles.aboutAppDesc, { color: colors.textSecondary }]}>
                {t('aboutAppDesc')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Azan Diagnostic Modal */}
      <AzanDiagnosticModal
        visible={isDiagnosticVisible}
        onClose={() => setIsDiagnosticVisible(false)}
        onOpenSettings={() => setActiveSection('settings')}
      />

      {/* All 114 Surahs Directory Modal */}
      <Modal
        visible={isSurahModalOpen}
        animationType="slide"
        onRequestClose={() => setIsSurahModalOpen(false)}
      >
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('all114Surahs')}
              </Text>
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                {language === 'en' ? 'Select a surah to read verses & translations' : 'Pilih surah untuk membaca ayat & terjemahan'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsSurahModalOpen(false)}
              style={[styles.closeModalBtn, { backgroundColor: colors.surfaceSubtle }]}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={[styles.modalSearchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Search size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.modalSearchInput, { color: colors.text }]}
              placeholder={t('searchSurahPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={surahSearchQuery}
              onChangeText={setSurahSearchQuery}
              autoCorrect={false}
            />
            {surahSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSurahSearchQuery('')}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Revelation Type Filter Pills */}
          <View style={styles.modalFilterRow}>
            {[
              { key: 'all', label: language === 'en' ? 'All' : 'Semua' },
              { key: 'Makkah', label: t('makkah') },
              { key: 'Madinah', label: t('madinah') },
            ].map(f => {
              const isSelected = surahFilterType === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setSurahFilterType(f.key as any)}
                  style={[
                    styles.modalFilterPill,
                    {
                      backgroundColor: isSelected ? '#10B981' : colors.surfaceSubtle,
                      borderColor: isSelected ? '#10B981' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.modalFilterText, { color: isSelected ? colors.white : colors.textSecondary }]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Surah FlatList */}
          <FlatList
            data={filteredSurahs}
            keyExtractor={item => item.number.toString()}
            contentContainerStyle={styles.surahListContent}
            renderItem={({ item }) => {
              const isSelected = selectedSurahNumber === item.number;
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedSurahNumber(item.number);
                    setIsSurahModalOpen(false);
                  }}
                  style={[
                    styles.surahListItem,
                    {
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.1)' : colors.card,
                      borderColor: isSelected ? '#10B981' : colors.border,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.surahNumBadge, { backgroundColor: isSelected ? '#10B981' : colors.surfaceSubtle }]}>
                      <Text style={[styles.surahNumBadgeText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                        {item.number}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[styles.surahItemTitle, { color: colors.text }]}>
                        {item.nameLatin}
                      </Text>
                      <Text style={[styles.surahItemSub, { color: colors.textSecondary }]}>
                        {language === 'en' ? item.englishMeaning : item.malayMeaning} • {item.versesCount} {t('verses')}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                    <Text style={[styles.surahItemArabic, { color: '#10B981' }]}>
                      {item.nameArabic}
                    </Text>
                    <Text style={[styles.surahItemType, { color: colors.textSecondary }]}>
                      {item.revelationType === 'Makkah' ? t('makkah') : t('madinah')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
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
    paddingBottom: 40,
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
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  quickSettingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 2,
  },
  categoryPillsScroll: {
    gap: 8,
    paddingVertical: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  hubContainer: {
    gap: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  hubCard: {
    width: '48.2%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  hubCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  hubCardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 10,
    lineHeight: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 2,
  },
  cardActionText: {
    fontSize: 10,
    fontWeight: '700',
  },
  promiseBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginTop: 4,
  },
  promiseTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  promiseDesc: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },

  // Reader Components Common Styles
  readerContainer: {
    gap: 12,
  },
  readerHeaderBox: {
    marginBottom: 4,
  },
  readerHeaderSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  verseCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  verseCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verseNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  verseTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  verseSubRange: {
    fontSize: 10,
    marginTop: 1,
  },
  repeatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  repeatBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  arabicTextLarge: {
    fontSize: 19,
    lineHeight: 34,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
    marginVertical: 4,
  },
  arabicTextGrand: {
    fontSize: 21,
    lineHeight: 38,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
    marginVertical: 6,
  },
  rumiText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  transText: {
    fontSize: 12,
    lineHeight: 18,
  },
  tapCountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
    gap: 6,
  },
  tapCountBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  interactiveBox: {
    marginTop: 6,
    gap: 6,
  },
  resetBtnInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  virtueBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: 6,
  },
  virtueHeading: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  virtueContent: {
    fontSize: 11,
    lineHeight: 16,
  },
  guidanceCard: {
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  guidanceTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  guidanceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guidanceText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  sourceRefText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },

  // Asmaul Husna Grid
  asmaulGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  asmaulCard: {
    width: '48.5%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  asmaulNumBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  asmaulNumText: {
    fontSize: 9,
    fontWeight: '800',
  },
  asmaulArabic: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 4,
    textAlign: 'center',
  },
  asmaulRumi: {
    fontSize: 12,
    fontWeight: '700',
  },
  asmaulMeaning: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Surah Meta
  surahMetaCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 6,
  },
  surahMetaTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  surahThemeText: {
    fontSize: 11,
    lineHeight: 16,
  },
  surahVirtueText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  allSurahsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  allSurahsBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  surahMetaMeaning: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  quranTransRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
  },
  quranTransLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  quranTransPills: {
    flexDirection: 'row',
    gap: 6,
  },
  quranTransBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  quranTransBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  transSubLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  loadingBox: {
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Surah Modal styles
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11,
    marginTop: 2,
  },
  closeModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  modalFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalFilterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  modalFilterText: {
    fontSize: 11,
    fontWeight: '700',
  },
  surahListContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 8,
  },
  surahListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  surahNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNumBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  surahItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  surahItemSub: {
    fontSize: 10,
    marginTop: 2,
  },
  surahItemArabic: {
    fontSize: 16,
    fontWeight: '700',
  },
  surahItemType: {
    fontSize: 9,
    marginTop: 2,
  },

  // Hadith & Musafir
  hadithContainer: {
    gap: 12,
  },
  hadithHeaderBox: {
    marginBottom: 4,
  },
  hadithHeaderSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  filterChipScroll: {
    gap: 8,
    marginVertical: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hadithCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  hadithTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  hadithArabic: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'right',
  },
  hadithMalay: {
    fontSize: 12,
    lineHeight: 18,
  },
  narratorBox: {
    marginTop: 2,
  },
  narratorText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  authorityText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  lessonsBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
    gap: 4,
  },
  lessonsTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  lessonPoint: {
    fontSize: 11,
    lineHeight: 16,
  },
  musafirContainer: {
    gap: 12,
  },
  musafirHeaderBox: {
    marginBottom: 4,
  },
  topicCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  topicSummary: {
    fontSize: 12,
    lineHeight: 17,
  },
  pointsList: {
    gap: 4,
  },
  pointLine: {
    fontSize: 11,
    lineHeight: 16,
  },
  formulasContainer: {
    marginTop: 6,
    gap: 8,
  },
  formulaHeading: {
    fontSize: 12,
    fontWeight: '800',
  },
  formulaItem: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  fPrayer: {
    fontSize: 11,
    fontWeight: '700',
  },
  fType: {
    fontSize: 10,
  },
  fArabic: {
    fontSize: 15,
    textAlign: 'right',
    lineHeight: 24,
  },
  fRumi: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  fTrans: {
    fontSize: 10,
    lineHeight: 14,
  },

  // Settings
  settingsContainer: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingRowTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingRowSub: {
    fontSize: 11,
    marginTop: 2,
  },
  langPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  paletteCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  paletteTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  paletteSub: {
    fontSize: 11,
  },
  colorOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedColorName: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  aboutCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
    gap: 4,
  },
  aboutAppName: {
    fontSize: 13,
    fontWeight: '800',
  },
  aboutAppVer: {
    fontSize: 11,
  },
  aboutAppDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
});
