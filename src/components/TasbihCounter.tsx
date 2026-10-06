import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

export interface ZikirPreset {
  id: string;
  name: string;
  nameEn: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningEn: string;
  target: number;
}

export const ZIKIR_PRESETS: ZikirPreset[] = [
  {
    id: 'subhanallah',
    name: 'Subhanallah',
    nameEn: 'Subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    meaning: 'Maha Suci Allah',
    meaningEn: 'Glory be to Allah',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    nameEn: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Segala puji bagi Allah',
    meaningEn: 'All praise belongs to Allah',
    target: 33,
  },
  {
    id: 'allahuakbar',
    name: 'Allahu Akbar',
    nameEn: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah Maha Besar',
    meaningEn: 'Allah is the Greatest',
    target: 34,
  },
  {
    id: 'tahlil',
    name: 'La ilaha illallah',
    nameEn: 'La ilaha illallah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'Tiada Tuhan melainkan Allah',
    meaningEn: 'There is no god worthy of worship except Allah',
    target: 100,
  },
  {
    id: 'istighfar',
    name: 'Astaghfirullah',
    nameEn: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    transliteration: 'Astaghfirullahal-\'Adzim',
    meaning: 'Aku memohon keampunan kepada Allah yang Maha Agung',
    meaningEn: 'I seek forgiveness from Allah the Almighty',
    target: 100,
  },
  {
    id: 'selawat',
    name: 'Selawat ke atas Nabi',
    nameEn: 'Blessings upon the Prophet',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    transliteration: 'Allahumma salli \'ala sayyidina Muhammad',
    meaning: 'Ya Allah, limpahkanlah selawat ke atas junjungan kami Nabi Muhammad',
    meaningEn: 'O Allah, bestow blessings upon our Master Muhammad',
    target: 100,
  },
  {
    id: 'custom',
    name: 'Zikir Bebas',
    nameEn: 'Free Zikir',
    arabic: 'ذِكْرُ اللَّهِ',
    transliteration: 'Zikrullah',
    meaning: 'Mengingati Allah tanpa had batasan',
    meaningEn: 'Remembrance of Allah without limit',
    target: 999,
  },
];

const LIFETIME_KEY = '@opensolat_tasbih_lifetime';

export const TasbihCounter: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const tapSize = Math.min(Math.max(windowWidth - 80, 200), 260);

  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<ZikirPreset>(ZIKIR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [lifetimeTotal, setLifetimeTotal] = useState<number>(0);
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(true);

  // Load lifetime count
  useEffect(() => {
    const loadLifetime = async () => {
      try {
        const val = await AsyncStorage.getItem(LIFETIME_KEY);
        if (val) setLifetimeTotal(parseInt(val, 10) || 0);
      } catch (e) {
        // ignore
      }
    };
    loadLifetime();
  }, []);

  const handleTap = async () => {
    const nextCount = count + 1;
    const nextLifetime = lifetimeTotal + 1;
    setLifetimeTotal(nextLifetime);
    AsyncStorage.setItem(LIFETIME_KEY, nextLifetime.toString()).catch(() => {});

    if (nextCount >= selectedPreset.target) {
      setCount(0);
      setRoundsCompleted(r => r + 1);

      if (isHapticEnabled) {
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {}
      }

      // Check for automatic progression Subhanallah (33) -> Alhamdulillah (33) -> Allahu Akbar (34)
      if (selectedPreset.id === 'subhanallah') {
        setSelectedPreset(ZIKIR_PRESETS[1]); // Alhamdulillah
      } else if (selectedPreset.id === 'alhamdulillah') {
        setSelectedPreset(ZIKIR_PRESETS[2]); // Allahu Akbar
      }
    } else {
      setCount(nextCount);
      if (isHapticEnabled) {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {}
      }
    }
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(t('resetConfirmMsg'))) {
        setCount(0);
        setRoundsCompleted(0);
      }
    } else {
      Alert.alert(t('resetConfirmTitle'), t('resetConfirmMsg'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: () => {
            setCount(0);
            setRoundsCompleted(0);
          },
        },
      ]);
    }
  };

  const progressPercent = Math.min(100, Math.round((count / selectedPreset.target) * 100));

  return (
    <View style={styles.container}>
      {/* Preset Selector Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetsList}
      >
        {ZIKIR_PRESETS.map(preset => {
          const isSelected = selectedPreset.id === preset.id;
          const displayName = language === 'en' ? preset.nameEn : preset.name;
          return (
            <TouchableOpacity
              key={preset.id}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedPreset(preset);
                setCount(0);
                if (isHapticEnabled) {
                  Haptics.selectionAsync();
                }
              }}
              style={[
                styles.presetChip,
                {
                  backgroundColor: isSelected ? accent.color : colors.card,
                  borderColor: isSelected ? accent.color : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.presetChipText,
                  { color: isSelected ? colors.white : colors.textSecondary },
                ]}
              >
                {displayName} ({preset.target})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Zikir Details */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.arabicText, { color: colors.text }]}>{selectedPreset.arabic}</Text>
        <Text style={[styles.transliterationText, { color: accent.color }]}>
          {selectedPreset.transliteration}
        </Text>
        <Text style={[styles.meaningText, { color: colors.textSecondary }]}>
          "{language === 'en' ? selectedPreset.meaningEn : selectedPreset.meaning}"
        </Text>
      </View>

      {/* Main Big Tap Area */}
      <View style={styles.tapAreaContainer}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleTap}
          style={[
            styles.bigTapButton,
            {
              width: tapSize,
              height: tapSize,
              borderRadius: tapSize / 2,
              backgroundColor: colors.cardElevated,
              borderColor: accent.color,
              shadowColor: accent.color,
            },
          ]}
        >
          {/* Circular Progress Gauge Backdrop */}
          <View
            style={[
              styles.gaugeFill,
              {
                borderColor: accent.color,
                opacity: 0.15 + (progressPercent / 100) * 0.4,
              },
            ]}
          />

          <Text style={[styles.counterNumber, { color: colors.text }]}>{count}</Text>
          <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>
            {t('target')}: {selectedPreset.target}
          </Text>

          {/* Progress bar inside button */}
          <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceSubtle }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: accent.color,
                },
              ]}
            />
          </View>
          <Text style={[styles.percentLabel, { color: accent.color }]}>{progressPercent}%</Text>
        </TouchableOpacity>
      </View>

      {/* Control Buttons & Statistics */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleReset}
          style={[styles.smallButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <RotateCcw size={18} color={colors.textSecondary} />
          <Text style={[styles.smallButtonText, { color: colors.textSecondary }]}>{t('reset')}</Text>
        </TouchableOpacity>

        <View style={[styles.statsBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Sparkles size={16} color={accent.color} />
          <Text style={[styles.statsBadgeText, { color: colors.text }]}>
            {t('rounds')}: <Text style={{ color: accent.color, fontWeight: '700' }}>{roundsCompleted}</Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsHapticEnabled(!isHapticEnabled)}
          style={[styles.smallButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {isHapticEnabled ? (
            <Volume2 size={18} color={accent.color} />
          ) : (
            <VolumeX size={18} color={colors.textMuted} />
          )}
          <Text
            style={[
              styles.smallButtonText,
              { color: isHapticEnabled ? accent.color : colors.textMuted },
            ]}
          >
            {t('haptic')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lifetime stats */}
      <View style={[styles.lifetimeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.lifetimeLabel, { color: colors.textSecondary }]}>
          {t('totalLifetimeZikir')}
        </Text>
        <Text style={[styles.lifetimeValue, { color: accent.color }]}>
          {lifetimeTotal.toLocaleString()} {t('timesUnit')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  presetsList: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    width: '92%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  arabicText: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  transliterationText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tapAreaContainer: {
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigTapButton: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  gaugeFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 10,
  },
  counterNumber: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -1,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: -4,
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '50%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    marginTop: 20,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statsBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  lifetimeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  lifetimeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  lifetimeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
