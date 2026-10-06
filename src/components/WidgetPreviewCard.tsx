import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  Sparkles,
  Plus,
  Check,
  Smartphone,
  Eye,
  Layers,
  HelpCircle,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { WidgetStyleType } from '../widgets/OpenSolatWidget';
import {
  getSavedWidgetStyle,
  saveWidgetStyle,
  pinOpenSolatWidget,
} from '../widgets/widgetDataHelper';

interface WidgetOptionConfig {
  id: WidgetStyleType;
  titleBm: string;
  titleEn: string;
  taglineBm: string;
  taglineEn: string;
}

const WIDGET_OPTIONS: WidgetOptionConfig[] = [
  {
    id: 'classic_capsule',
    titleBm: "Muslim's Prayer Times",
    titleEn: "Muslim's Prayer Times",
    taglineBm: 'Kapsul Moden & Kaca Gelap Elegan',
    taglineEn: 'Sleek Dark Glass & Rounded Capsule',
  },
  {
    id: 'bold_banner',
    titleBm: 'Malaysia Prayer Times',
    titleEn: 'Malaysia Prayer Times',
    taglineBm: 'Sepanduk Jingga Berani & Dwi-Warna',
    taglineEn: 'Dual-Tone Bold Amber Banner',
  },
  {
    id: 'mysolat_green',
    titleBm: 'MySolat Rasmi',
    titleEn: 'MySolat Classic',
    taglineBm: 'Tajuk Hijau Masjid & Jadual Penuh 7 Waktu',
    taglineEn: 'Islamic Green Mosque Header & Full 7 Schedule',
  },
];

export const WidgetPreviewCard: React.FC = () => {
  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();
  const { todayTimes, nextPrayer, currentZone } = usePrayerTimes();

  const [selectedStyle, setSelectedStyle] = useState<WidgetStyleType>('classic_capsule');
  const [isPinning, setIsPinning] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    getSavedWidgetStyle().then(style => {
      setSelectedStyle(style);
    });
  }, []);

  const handleSelectStyle = async (style: WidgetStyleType) => {
    setSelectedStyle(style);
    await saveWidgetStyle(style);
  };

  const handlePin = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        language === 'en' ? 'Android Home Screen Widget' : 'Widget Skrin Hadapan Android',
        language === 'en'
          ? 'Home Screen app widgets are supported on Android devices.'
          : 'Ciri widget skrin hadapan (Home Screen) disokong pada peranti Android.'
      );
      return;
    }

    try {
      setIsPinning(true);
      const success = await pinOpenSolatWidget();
      if (success) {
        Alert.alert(
          language === 'en' ? 'Add to Home Screen' : 'Tambah Widget Skrin Depan',
          language === 'en'
            ? 'System prompt displayed! Tap "Add" or "Confirm" to place the widget on your home screen.'
            : 'Kotak dialog sistem telah dipaparkan. Sila tekan "Tambah" (Add) untuk meletakkan widget di skrin hadapan telefon anda.'
        );
      } else {
        Alert.alert(
          language === 'en' ? 'How to Add Widget' : 'Cara Pasang Widget Skrin Depan',
          language === 'en'
            ? 'Long-press any empty space on your home screen > Tap "Widgets" > Search "OpenSolat" > Drag widget to your screen.'
            : 'Sila tekan lama (long-press) pada mana-mana ruang kosong di skrin utama telefon anda > Pilih "Widget" > Cari "OpenSolat" > Tarik widget ke skrin hadapan.'
        );
      }
    } catch (e) {
      Alert.alert(
        language === 'en' ? 'Add Widget' : 'Pasang Widget',
        language === 'en'
          ? 'Long-press on your phone\'s home screen > select "Widgets" > "OpenSolat".'
          : 'Sila tekan lama pada skrin utama telefon > pilih "Widget" > "OpenSolat".'
      );
    } finally {
      setIsPinning(false);
    }
  };

  // Helper prayer data for preview
  const previewLocation = currentZone.locations.split(',')[0].trim() || 'Kuala Lumpur';
  const previewHijri = todayTimes?.hijri || '14 Ramadan 1448';
  const previewGregorian = todayTimes?.date || '16 Jul 2026';
  const nextName = (nextPrayer?.name || 'Zohor').toUpperCase();
  const nextTime = nextPrayer?.time || '13:22';

  const previewPrayers = [
    { name: 'SUBUH', time: todayTimes?.subuh || '05:48', isNext: nextName === 'SUBUH' },
    { name: 'SYURUK', time: todayTimes?.syuruk || '07:11', isNext: nextName === 'SYURUK' },
    { name: 'ZOHOR', time: todayTimes?.zohor || '13:22', isNext: nextName === 'ZOHOR' },
    { name: 'ASAR', time: todayTimes?.asar || '16:46', isNext: nextName === 'ASAR' },
    { name: 'MAGHRIB', time: todayTimes?.maghrib || '19:30', isNext: nextName === 'MAGHRIB' },
    { name: 'ISYAK', time: todayTimes?.isyak || '20:45', isNext: nextName === 'ISYAK' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: accent.softBg }]}>
            <Layers size={18} color={accent.color} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.title, { color: colors.text }]}>
                {language === 'en' ? 'Home Screen Widget Styles' : 'Pilihan Reka Bentuk Widget'}
              </Text>
              <View style={[styles.tagBadge, { backgroundColor: accent.color }]}>
                <Text style={styles.tagBadgeText}>
                  {language === 'en' ? '3 Styles' : '3 Pilihan'}
                </Text>
              </View>
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {language === 'en'
                ? 'Choose your favorite widget layout for your phone home screen'
                : 'Pilih susunan dan gaya warna widget kegemaran anda untuk skrin telefon'}
            </Text>
          </View>
        </View>
      </View>

      {/* Style Selector Tabs */}
      <View style={styles.selectorRow}>
        {WIDGET_OPTIONS.map(opt => {
          const isSelected = selectedStyle === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              onPress={() => handleSelectStyle(opt.id)}
              style={[
                styles.styleTabBtn,
                {
                  backgroundColor: isSelected ? accent.softBg : colors.surfaceSubtle,
                  borderColor: isSelected ? accent.color : colors.border,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {isSelected && <Check size={12} color={accent.color} />}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.styleTabBtnText,
                    { color: isSelected ? accent.color : colors.textSecondary, fontWeight: isSelected ? '700' : '500' },
                  ]}
                >
                  {language === 'en' ? opt.titleEn : opt.titleBm}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live Interactive Preview Box */}
      <View style={styles.previewShell}>
        <View style={styles.previewHeaderLabel}>
          <Eye size={12} color={colors.textSecondary} />
          <Text style={[styles.previewLabelText, { color: colors.textSecondary }]}>
            {language === 'en' ? 'Live Simulated Widget Preview' : 'Pratonton Sebenar Widget'}
          </Text>
        </View>

        {/* ── STYLE 1 PREVIEW: CLASSIC CAPSULE ── */}
        {selectedStyle === 'classic_capsule' && (
          <View style={styles.classicWidgetShell}>
            {/* Top Date Header */}
            <View style={styles.classicTopRow}>
              <Text style={styles.classicDateText}>
                {previewHijri}   {previewGregorian}
              </Text>
            </View>

            {/* Prayers Row */}
            <View style={styles.classicPrayersRow}>
              {previewPrayers.map((p, i) => {
                const isNext = p.isNext;
                return (
                  <View
                    key={i}
                    style={[
                      styles.classicCol,
                      isNext && styles.classicActiveCapsule,
                    ]}
                  >
                    <Text style={[styles.classicName, isNext && styles.classicActiveName]}>
                      {p.name === 'ZOHOR' ? 'Dhouhr' : p.name === 'SUBUH' ? 'Fajr' : p.name === 'ISYAK' ? 'Ishaa' : p.name.charAt(0) + p.name.slice(1).toLowerCase()}
                    </Text>
                    <Text style={[styles.classicTime, isNext && styles.classicActiveTime]}>
                      {p.time}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Bottom Caption */}
            <View style={styles.classicFooterRow}>
              <Text style={styles.classicFooterText}>Muslim's Prayer Times</Text>
            </View>
          </View>
        )}

        {/* ── STYLE 2 PREVIEW: BOLD AMBER BANNER ── */}
        {selectedStyle === 'bold_banner' && (
          <View style={styles.bannerWidgetShell}>
            {/* Top Amber Banner */}
            <View style={styles.bannerTopBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Text style={styles.bannerBigTime}>{nextTime}</Text>
                <Text style={styles.bannerBigPrayer}>{nextName}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.bannerHijriRight}>{previewHijri.toUpperCase()}</Text>
                <Text style={styles.bannerLocRight}>{previewLocation.toUpperCase()}</Text>
              </View>
            </View>

            {/* Bottom Dark Timetable */}
            <View style={styles.bannerBottomRow}>
              {previewPrayers.map((p, i) => {
                const isNext = p.isNext;
                return (
                  <View key={i} style={styles.bannerCol}>
                    <Text style={[styles.bannerColName, isNext && styles.bannerActiveText]}>
                      {p.name}
                    </Text>
                    <Text style={[styles.bannerColTime, isNext && styles.bannerActiveText]}>
                      {p.time}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Bottom Caption */}
            <View style={styles.bannerCaptionRow}>
              <Text style={styles.bannerCaptionText}>Malaysia Prayer Times</Text>
            </View>
          </View>
        )}

        {/* ── STYLE 3 PREVIEW: MYSOLAT GREEN ── */}
        {selectedStyle === 'mysolat_green' && (
          <View style={styles.mySolatWidgetShell}>
            {/* Top Green Banner */}
            <View style={styles.mySolatTopBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 16 }}>🕌</Text>
                <View>
                  <Text style={styles.mySolatLocation}>{previewLocation}</Text>
                  <Text style={styles.mySolatHijri}>{previewHijri}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>

            {/* Bottom Dark 7-Timetable */}
            <View style={styles.mySolatBottomRow}>
              {[
                { name: 'imsak', time: todayTimes?.imsak || '05:38', isNext: false },
                ...previewPrayers.map(p => ({
                  name: p.name.toLowerCase(),
                  time: p.time,
                  isNext: p.isNext,
                })),
              ].map((p, i) => {
                const isNext = p.isNext;
                return (
                  <View key={i} style={styles.mySolatCol}>
                    <Text style={[styles.mySolatColTime, isNext && styles.mySolatActiveText]}>
                      {p.time}
                    </Text>
                    <Text style={[styles.mySolatColName, isNext && styles.mySolatActiveText]}>
                      {p.name}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Bottom Caption */}
            <View style={styles.mySolatCaptionRow}>
              <Text style={styles.mySolatCaptionText}>MySolat</Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons: Pin to Home Screen & Help Tip */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePin}
          disabled={isPinning}
          style={[styles.pinBtn, { backgroundColor: accent.color }]}
        >
          <Plus size={16} color="#ffffff" />
          <Text style={styles.pinBtnText}>
            {isPinning
              ? (language === 'en' ? 'Connecting to Launcher...' : 'Menghubungi Launcher...')
              : (language === 'en' ? 'Add Widget to Home Screen' : 'Tambah Widget ke Skrin Depan')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowTips(!showTips)}
          style={[styles.tipsToggleBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
        >
          <HelpCircle size={15} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Instructions / Tips */}
      {showTips && (
        <View style={[styles.tipsBox, { backgroundColor: colors.surfaceSubtle }]}>
          <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
            💡 <Text style={{ fontWeight: '700', color: colors.text }}>
              {language === 'en' ? 'Samsung, Pixel & Xiaomi tip:' : 'Petua Samsung Galaxy & Android:'}
            </Text>{' '}
            {language === 'en'
              ? 'You can also long-press any empty space on your phone home screen > Tap "Widgets" > Search "OpenSolat" > Drag widget to place.'
              : 'Anda juga boleh menekan lama (long-press) pada mana-mana ruang kosong di skrin utama telefon anda > Pilih "Widget" > Cari "OpenSolat" > Tarik widget ke skrin.'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  styleTabBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleTabBtnText: {
    fontSize: 10,
    textAlign: 'center',
  },
  previewShell: {
    marginBottom: 12,
  },
  previewHeaderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  previewLabelText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* ── CLASSIC CAPSULE STYLES ── */
  classicWidgetShell: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3F3F46',
    padding: 12,
  },
  classicTopRow: {
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D30',
  },
  classicDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D4D4D8',
    letterSpacing: 0.3,
  },
  classicPrayersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  classicCol: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  classicActiveCapsule: {
    backgroundColor: '#09090B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#71717A',
    paddingHorizontal: 8,
  },
  classicName: {
    fontSize: 9,
    color: '#A1A1AA',
    marginBottom: 2,
  },
  classicActiveName: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  classicTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E4E4E7',
  },
  classicActiveTime: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  classicFooterRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  classicFooterText: {
    fontSize: 9,
    color: '#71717A',
    letterSpacing: 0.5,
  },

  /* ── BOLD BANNER STYLES ── */
  bannerWidgetShell: {
    backgroundColor: '#18181B',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9770655',
  },
  bannerTopBanner: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerBigTime: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bannerBigPrayer: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  bannerHijriRight: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FEF3C7',
    letterSpacing: 0.4,
  },
  bannerLocRight: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  bannerBottomRow: {
    backgroundColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerCol: {
    alignItems: 'center',
  },
  bannerColName: {
    fontSize: 8,
    color: '#A1A1AA',
    fontWeight: '600',
    marginBottom: 2,
  },
  bannerColTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E4E4E7',
  },
  bannerActiveText: {
    color: '#F59E0B',
    fontWeight: '800',
  },
  bannerCaptionRow: {
    alignItems: 'center',
    paddingBottom: 4,
    backgroundColor: '#18181B',
  },
  bannerCaptionText: {
    fontSize: 9,
    color: '#71717A',
  },

  /* ── MYSOLAT STYLES ── */
  mySolatWidgetShell: {
    backgroundColor: '#121820',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#65A30D55',
  },
  mySolatTopBanner: {
    backgroundColor: '#65A30D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mySolatLocation: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mySolatHijri: {
    fontSize: 9,
    color: '#ECFCCB',
    marginTop: 1,
  },
  mySolatBottomRow: {
    backgroundColor: '#121820',
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mySolatCol: {
    alignItems: 'center',
  },
  mySolatColTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 2,
  },
  mySolatColName: {
    fontSize: 8,
    color: '#94A3B8',
  },
  mySolatActiveText: {
    color: '#84CC16',
    fontWeight: '800',
  },
  mySolatCaptionRow: {
    alignItems: 'center',
    paddingBottom: 4,
    backgroundColor: '#121820',
  },
  mySolatCaptionText: {
    fontSize: 9,
    color: '#64748B',
  },

  /* ── ACTION BUTTONS ── */
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  pinBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  tipsToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsBox: {
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  tipsText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
