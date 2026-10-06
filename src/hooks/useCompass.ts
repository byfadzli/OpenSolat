import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Vibration, AppState } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { calculateQiblaBearing, calculateDistanceToMakkah, KAABA_COORDINATES } from '../utils/calculations';
import { playAudioPreview, stopAudioPreview } from '../services/notificationService';

export interface CompassData {
  heading: number; // [0, 360)
  qiblaBearing: number; // [0, 360)
  deviation: number; // difference in degrees
  isAligned: boolean;
  distanceToKaabaKm: number;
  hasInterference: boolean;
  accuracy: 'good' | 'medium' | 'poor';
  hasSensor: boolean;
  userCoords: { latitude: number; longitude: number } | null;
}

const DEFAULT_COORDS = {
  latitude: 3.139, // Kuala Lumpur
  longitude: 101.6869,
};

export const useCompass = (isActive: boolean = true) => {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaBearing, setQiblaBearing] = useState<number>(
    calculateQiblaBearing(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude)
  );
  const [distanceKm, setDistanceKm] = useState<number>(
    calculateDistanceToMakkah(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude)
  );
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasSensor, setHasSensor] = useState<boolean>(true);
  const [hasInterference, setHasInterference] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<'good' | 'medium' | 'poor'>('good');
  const [isAligned, setIsAligned] = useState<boolean>(false);

  const prevHeadingRef = useRef<number>(0);
  const alignedTriggeredRef = useRef<boolean>(false);
  const subscriptionRef = useRef<any>(null);

  // Obtain GPS coordinates for pinpoint Qibla angle
  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const lat = loc.coords.latitude;
        const lng = loc.coords.longitude;
        setUserCoords({ latitude: lat, longitude: lng });
        const bearing = calculateQiblaBearing(lat, lng);
        setQiblaBearing(bearing);
        setDistanceKm(calculateDistanceToMakkah(lat, lng));
      }
    } catch (err) {
      console.warn('Compass location error:', err);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      fetchLocation();
    }
  }, [isActive, fetchLocation]);

  useEffect(() => {
    let mounted = true;

    // Immediately teardown if screen is unfocused
    if (!isActive) {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
      alignedTriggeredRef.current = false;
      stopAudioPreview();
      return;
    }

    const removeCurrentSub = () => {
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.remove();
        } catch (e) {}
        subscriptionRef.current = null;
      }
    };

    const setupMagnetometer = async () => {
      try {
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isAvailable) {
          if (mounted) setHasSensor(false);
          return;
        }

        Magnetometer.setUpdateInterval(35); // ~28-30 updates per second for smooth tracking
        removeCurrentSub();

        subscriptionRef.current = Magnetometer.addListener(data => {
          if (!data || !mounted || !isActive) return;

          const { x, y, z } = data;

          // Field magnitude to check for magnetic anomalies
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          if (magnitude < 20 || magnitude > 75) {
            setHasInterference(true);
            setAccuracy('poor');
          } else {
            setHasInterference(false);
            setAccuracy('good');
          }

          // Calculate heading
          let rawAngle = 0;
          if (Platform.OS === 'ios') {
            rawAngle = Math.atan2(y, x) * (180 / Math.PI);
          } else {
            rawAngle = Math.atan2(-y, x) * (180 / Math.PI);
          }

          let deg = (rawAngle + 360) % 360;

          // Adaptive low-pass smoothing filter
          let prev = prevHeadingRef.current;
          let diff = deg - prev;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;

          // Skip micro-jitter (< 0.1 degree) when stationary
          if (Math.abs(diff) < 0.1) {
            return;
          }

          const absDiff = Math.abs(diff);
          const alpha = absDiff > 8 ? 0.45 : absDiff > 2 ? 0.3 : 0.2;
          const smoothed = (prev + diff * alpha + 360) % 360;
          prevHeadingRef.current = smoothed;
          setHeading(Math.round(smoothed * 10) / 10);

          // Check alignment with Kaaba bearing
          const dev = Math.abs(((smoothed - qiblaBearing + 180) % 360) - 180);
          const alignedNow = dev <= 3.5;
          setIsAligned(alignedNow);

          // Trigger tactile vibration and audio chime feedback upon alignment ONLY when screen is focused
          if (alignedNow && !alignedTriggeredRef.current) {
            alignedTriggeredRef.current = true;
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              Vibration.vibrate(100);
            } catch (e) {
              // ignore
            }
            try {
              playAudioPreview('chime_lembut');
            } catch (e) {
              // ignore
            }
          } else if (dev > 6.0 && alignedTriggeredRef.current) {
            // Departed alignment by > 6.0 degrees (hysteresis prevents flicker)
            alignedTriggeredRef.current = false;
          }
        });
      } catch (err) {
        console.warn('Magnetometer listener error:', err);
        if (mounted) setHasSensor(false);
      }
    };

    setupMagnetometer();

    // Pause sensor and sounds if app moves to background
    const appStateSub = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== 'active') {
        removeCurrentSub();
        alignedTriggeredRef.current = false;
        stopAudioPreview();
      } else if (isActive && mounted) {
        setupMagnetometer();
      }
    });

    return () => {
      mounted = false;
      appStateSub.remove();
      removeCurrentSub();
      alignedTriggeredRef.current = false;
      stopAudioPreview();
    };
  }, [isActive, qiblaBearing]);

  const deviation = Math.abs(((heading - qiblaBearing + 180) % 360) - 180);

  return {
    heading,
    qiblaBearing,
    deviation: Math.round(deviation * 10) / 10,
    isAligned,
    distanceToKaabaKm: distanceKm,
    hasInterference,
    accuracy,
    hasSensor,
    userCoords,
    kaabaCoordinates: KAABA_COORDINATES,
    refreshLocation: fetchLocation,
  };
};
