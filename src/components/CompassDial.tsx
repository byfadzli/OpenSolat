import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import { Compass, CheckCircle2, AlertTriangle, Navigation2, Sparkles } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { getCardinalDirection } from '../utils/calculations';

interface CompassDialProps {
  heading: number;
  qiblaBearing: number;
  isAligned: boolean;
  hasInterference: boolean;
  accuracy: 'good' | 'medium' | 'poor';
  hasSensor: boolean;
}

export const CompassDial: React.FC<CompassDialProps> = ({
  heading,
  qiblaBearing,
  isAligned,
  hasInterference,
  accuracy,
  hasSensor,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const dialSize = Math.min(Math.max(windowWidth - 64, 240), 320);

  const { colors, accent } = useTheme();
  const { t } = useLanguage();

  // Angle difference relative to device top (where the phone is pointing)
  const relativeQiblaAngle = useMemo(() => {
    let diff = qiblaBearing - heading;
    return (diff + 360) % 360;
  }, [qiblaBearing, heading]);

  const cardinal = useMemo(() => getCardinalDirection(heading), [heading]);

  // Smooth continuous animated rotation values
  const animatedHeading = useRef(new Animated.Value(heading)).current;
  const currentContinuousHeading = useRef(heading);

  const animatedRelative = useRef(new Animated.Value(relativeQiblaAngle)).current;
  const currentContinuousRelative = useRef(relativeQiblaAngle);

  const alignScale = useRef(new Animated.Value(1)).current;

  // Animate dial rotation with shortest-path unwrapping
  useEffect(() => {
    const diff = ((heading - (currentContinuousHeading.current % 360) + 540) % 360) - 180;
    const targetHeading = currentContinuousHeading.current + diff;
    currentContinuousHeading.current = targetHeading;

    Animated.spring(animatedHeading, {
      toValue: targetHeading,
      tension: 70,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  // Animate relative Kaaba pointer with shortest-path unwrapping
  useEffect(() => {
    const diffRel = ((relativeQiblaAngle - (currentContinuousRelative.current % 360) + 540) % 360) - 180;
    const targetRelative = currentContinuousRelative.current + diffRel;
    currentContinuousRelative.current = targetRelative;

    Animated.spring(animatedRelative, {
      toValue: targetRelative,
      tension: 70,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [relativeQiblaAngle]);

  // Visual pulse when aligned
  useEffect(() => {
    if (isAligned) {
      Animated.sequence([
        Animated.timing(alignScale, { toValue: 1.12, duration: 180, useNativeDriver: true }),
        Animated.timing(alignScale, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [isAligned]);

  const dialRotation = animatedHeading.interpolate({
    inputRange: [-360000, 360000],
    outputRange: ['360000deg', '-360000deg'],
  });

  const arrowRotation = animatedRelative.interpolate({
    inputRange: [-360000, 360000],
    outputRange: ['-360000deg', '360000deg'],
  });

  return (
    <View style={styles.container}>
      {/* Alignment status banner */}
      <View
        style={[
          styles.statusBanner,
          {
            backgroundColor: isAligned
              ? 'rgba(16, 185, 129, 0.16)'
              : hasInterference
              ? 'rgba(245, 158, 11, 0.16)'
              : colors.surfaceSubtle,
            borderColor: isAligned ? colors.success : hasInterference ? colors.warning : colors.border,
          },
        ]}
      >
        {isAligned ? (
          <>
            <CheckCircle2 size={20} color={colors.success} />
            <Text style={[styles.statusText, { color: colors.success }]}>
              {t('alignedText')}
            </Text>
          </>
        ) : hasInterference ? (
          <>
            <AlertTriangle size={20} color={colors.warning} />
            <Text style={[styles.statusText, { color: colors.warning }]}>
              {t('interferenceText')}
            </Text>
          </>
        ) : (
          <>
            <Compass size={20} color={accent.color} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {t('rotatePromptText')}
            </Text>
          </>
        )}
      </View>

      {/* Outer Dial Container */}
      <View
        style={[
          styles.dialWrapper,
          {
            width: dialSize,
            height: dialSize,
            borderColor: isAligned ? colors.success : colors.border,
            backgroundColor: colors.card,
            shadowColor: isAligned ? colors.success : accent.color,
          },
        ]}
      >
        {/* Rotating Compass Face (rotates with negative heading smoothly on GPU) */}
        <Animated.View
          style={[
            styles.rotatingFace,
            {
              transform: [{ rotate: dialRotation }],
            },
          ]}
        >
          {/* Cardinal Directions */}
          <Text style={[styles.cardinalLabel, styles.northLabel, { color: colors.danger }]}>{t('cardinalN')}</Text>
          <Text style={[styles.cardinalLabel, styles.eastLabel, { color: colors.textSecondary }]}>{t('cardinalE')}</Text>
          <Text style={[styles.cardinalLabel, styles.southLabel, { color: colors.textSecondary }]}>{t('cardinalS')}</Text>
          <Text style={[styles.cardinalLabel, styles.westLabel, { color: colors.textSecondary }]}>{t('cardinalW')}</Text>

          {/* Dial degree ring ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
            const isCardinal = deg % 90 === 0;
            return (
              <View
                key={deg}
                style={[
                  styles.tickContainer,
                  {
                    transform: [{ rotate: `${deg}deg` }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.tickMark,
                    {
                      height: isCardinal ? 14 : 8,
                      width: isCardinal ? 2.5 : 1.5,
                      backgroundColor: isCardinal
                        ? deg === 0
                          ? colors.danger
                          : colors.text
                        : colors.borderSubtle,
                    },
                  ]}
                />
              </View>
            );
          })}

          {/* Pinned Kaaba Target Indicator on the Compass Face */}
          <View
            style={[
              styles.kaabaIndicatorWrapper,
              {
                transform: [{ rotate: `${qiblaBearing}deg` }],
              },
            ]}
          >
            <View
              style={[
                styles.kaabaBadge,
                {
                  backgroundColor: isAligned ? colors.success : accent.color,
                  borderColor: colors.white,
                },
              ]}
            >
              <Text style={styles.kaabaIcon}>🕋</Text>
            </View>
            <View
              style={[
                styles.kaabaBeamLine,
                {
                  backgroundColor: isAligned ? colors.success : accent.color,
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Center Pivot Indicator */}
        <Animated.View
          style={[
            styles.centerHub,
            {
              backgroundColor: isAligned ? colors.success : colors.cardElevated,
              borderColor: isAligned ? colors.white : accent.color,
              transform: [{ scale: alignScale }],
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ rotate: arrowRotation }],
            }}
          >
            <Navigation2
              size={24}
              color={isAligned ? colors.white : accent.color}
            />
          </Animated.View>
        </Animated.View>

        {/* Top Alignment Pointer */}
        <View style={styles.topPointer}>
          <View
            style={[
              styles.pointerTriangle,
              {
                borderBottomColor: isAligned ? colors.success : accent.color,
              },
            ]}
          />
        </View>
      </View>

      {/* Numeric Readouts */}
      <View style={styles.readoutRow}>
        <View style={[styles.readoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.readoutLabel, { color: colors.textSecondary }]}>{t('currentHeading')}</Text>
          <Text style={[styles.readoutValue, { color: colors.text }]}>
            {Math.round(heading)}° <Text style={{ fontSize: 15, color: accent.color }}>{cardinal}</Text>
          </Text>
        </View>

        <View style={[styles.readoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.readoutLabel, { color: colors.textSecondary }]}>{t('qiblaBearing')}</Text>
          <Text style={[styles.readoutValue, { color: accent.color }]}>
            {Math.round(qiblaBearing)}°
          </Text>
        </View>

        <View style={[styles.readoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.readoutLabel, { color: colors.textSecondary }]}>{t('accuracy')}</Text>
          <View style={styles.accuracyTag}>
            <Sparkles size={13} color={isAligned ? colors.success : accent.color} />
            <Text
              style={[
                styles.accuracyText,
                { color: isAligned ? colors.success : colors.text },
              ]}
            >
              {isAligned ? t('aligned') : `${Math.round(Math.abs(qiblaBearing - heading))}°`}
            </Text>
          </View>
        </View>
      </View>

      {!hasSensor && (
        <View style={[styles.noSensorWarning, { backgroundColor: colors.card, borderColor: colors.warning }]}>
          <Text style={[styles.noSensorText, { color: colors.warning }]}>
            {t('noSensorWarning')} ({qiblaBearing}°).
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    maxWidth: '92%',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flexShrink: 1,
  },
  dialWrapper: {
    borderRadius: 999,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    position: 'relative',
  },
  rotatingFace: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinalLabel: {
    position: 'absolute',
    fontSize: 15,
    fontWeight: '800',
  },
  northLabel: {
    top: 14,
  },
  eastLabel: {
    right: 16,
  },
  southLabel: {
    bottom: 14,
  },
  westLabel: {
    left: 16,
  },
  tickContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tickMark: {
    borderRadius: 2,
    marginTop: 6,
  },
  kaabaIndicatorWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  kaabaBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    elevation: 4,
  },
  kaabaIcon: {
    fontSize: 16,
  },
  kaabaBeamLine: {
    width: 2,
    height: 32,
    opacity: 0.8,
  },
  centerHub: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  topPointer: {
    position: 'absolute',
    top: -12,
    alignItems: 'center',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  readoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginTop: 24,
    gap: 8,
  },
  readoutCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  readoutLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  readoutValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  accuracyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  noSensorWarning: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  noSensorText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
