import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Compass,
  MapPin,
  RefreshCw,
  Info,
  ShieldAlert,
  HelpCircle,
  Sliders,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useCompass } from '../hooks/useCompass';
import { CompassDial } from '../components/CompassDial';
import { KAABA_COORDINATES } from '../utils/calculations';
import { playAudioPreview, stopAudioPreview } from '../services/notificationService';
import { useIsFocused } from '@react-navigation/native';

export const QiblaScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const { colors, accent } = useTheme();
  const { t, language } = useLanguage();
  const {
    heading,
    qiblaBearing,
    deviation,
    isAligned,
    distanceToKaabaKm,
    hasInterference,
    accuracy,
    hasSensor,
    userCoords,
    refreshLocation,
  } = useCompass(isFocused);

  const [simulatedHeading, setSimulatedHeading] = useState<number | null>(null);
  const [showCalibrationHelp, setShowCalibrationHelp] = useState<boolean>(false);

  const activeHeading = simulatedHeading !== null ? simulatedHeading : heading;
  const activeDeviation = Math.abs(((activeHeading - qiblaBearing + 180) % 360) - 180);
  const activeIsAligned = activeDeviation <= 3.5;

  const simTriggerRef = React.useRef(false);

  React.useEffect(() => {
    if (!isFocused) {
      simTriggerRef.current = false;
      stopAudioPreview();
      return;
    }

    if (simulatedHeading !== null) {
      if (activeIsAligned && !simTriggerRef.current) {
        simTriggerRef.current = true;
        try {
          playAudioPreview('chime_lembut');
        } catch (e) {}
      } else if (!activeIsAligned && activeDeviation > 6) {
        simTriggerRef.current = false;
      }
    }
  }, [isFocused, simulatedHeading, activeIsAligned, activeDeviation]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('qiblaTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('qiblaSubtitle')}
          </Text>
        </View>

        {/* Location & Kaaba Distance Badge */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={refreshLocation}
          style={[styles.infoBanner, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.infoLeft}>
            <MapPin size={16} color={accent.color} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {userCoords
                ? `${userCoords.latitude.toFixed(4)}° N, ${userCoords.longitude.toFixed(4)}° E`
                : t('currentLocationDefault')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.distanceText, { color: accent.color }]}>
              {distanceToKaabaKm.toLocaleString()} {t('kmToKaaba')}
            </Text>
            <RefreshCw size={12} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Qibla Alignment Feedback Indicator (Vibration & Chime) */}
        <View
          style={[
            styles.feedbackIndicator,
            {
              backgroundColor: activeIsAligned ? 'rgba(16, 185, 129, 0.12)' : colors.surfaceSubtle,
              borderColor: activeIsAligned ? colors.success : colors.borderSubtle,
            },
          ]}
        >
          <Sparkles size={14} color={activeIsAligned ? colors.success : accent.color} />
          <Text
            style={[
              styles.feedbackText,
              { color: activeIsAligned ? colors.success : colors.textSecondary },
            ]}
          >
            {t('qiblaFeedbackActive')}
          </Text>
        </View>

        {/* Animated Compass Dial */}
        <CompassDial
          heading={activeHeading}
          qiblaBearing={qiblaBearing}
          isAligned={activeIsAligned}
          hasInterference={hasInterference}
          accuracy={accuracy}
          hasSensor={hasSensor}
        />

        {/* Hardware calibration & guide card */}
        <View
          style={[
            styles.guideCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCalibrationHelp(!showCalibrationHelp)}
            style={styles.guideHeader}
          >
            <View style={styles.guideHeaderLeft}>
              <HelpCircle size={18} color={accent.color} />
              <Text style={[styles.guideTitle, { color: colors.text }]}>
                {t('guideHeading')}
              </Text>
            </View>
            <Text style={{ color: accent.color, fontWeight: '700', fontSize: 12 }}>
              {showCalibrationHelp ? t('closeBtn') : t('viewBtn')}
            </Text>
          </TouchableOpacity>

          {showCalibrationHelp && (
            <View style={styles.guideContent}>
              <Text style={[styles.guideParagraph, { color: colors.textSecondary }]}>
                1. <Text style={{ color: colors.text, fontWeight: '600' }}>{t('guideStep1Title')}:</Text> {t('guideStep1Desc')}
              </Text>
              <Text style={[styles.guideParagraph, { color: colors.textSecondary }]}>
                2. <Text style={{ color: colors.text, fontWeight: '600' }}>{t('guideStep2Title')}:</Text> {t('guideStep2Desc')}
              </Text>
              <Text style={[styles.guideParagraph, { color: colors.textSecondary }]}>
                3. <Text style={{ color: colors.text, fontWeight: '600' }}>{t('guideStep3Title')}:</Text> {t('guideStep3Desc')}
              </Text>
            </View>
          )}
        </View>

        {/* Makkah Coordinates Info Card */}
        <View
          style={[
            styles.kaabaInfoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.kaabaTitle, { color: colors.text }]}>
            {t('kaabaTitle')}
          </Text>
          <Text style={[styles.kaabaCoords, { color: accent.color }]}>
            {KAABA_COORDINATES.latitude}° N, {KAABA_COORDINATES.longitude}° E
          </Text>
          <Text style={[styles.kaabaSub, { color: colors.textSecondary }]}>
            {t('kaabaLocation')}
          </Text>
        </View>

        {/* Compass Simulator for Desktop/Emulator/Testing */}
        {(!hasSensor || Platform.OS === 'web') && (
          <View style={[styles.simCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <View style={styles.simHeader}>
              <Sliders size={16} color={accent.color} />
              <Text style={[styles.simTitle, { color: colors.text }]}>{t('simTitle')}</Text>
            </View>
            <View style={styles.simButtonRow}>
              {[
                { label: `0° ${t('north')}`, val: 0 },
                { label: `${Math.round(qiblaBearing)}° ${t('qibla')}`, val: qiblaBearing },
                { label: `90° ${t('east')}`, val: 90 },
                { label: `180° ${t('south')}`, val: 180 },
                { label: `270° ${t('west')}`, val: 270 },
              ].map(btn => (
                <TouchableOpacity
                  key={btn.label}
                  onPress={() => setSimulatedHeading(btn.val)}
                  style={[
                    styles.simBtn,
                    {
                      backgroundColor:
                        simulatedHeading === btn.val ? accent.color : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.simBtnText,
                      {
                        color:
                          simulatedHeading === btn.val ? colors.white : colors.text,
                      },
                    ]}
                  >
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  infoBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  feedbackIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  guideCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guideContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.15)',
    gap: 8,
  },
  guideParagraph: {
    fontSize: 12,
    lineHeight: 18,
  },
  kaabaInfoCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 12,
  },
  kaabaTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  kaabaCoords: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  kaabaSub: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  simCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  simTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  simButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  simBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
