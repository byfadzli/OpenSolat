import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, Bell, Compass, Calendar, Grid } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

import { TimesScreen } from '../screens/TimesScreen';
import { AlarmsScreen } from '../screens/AlarmsScreen';
import { QiblaScreen } from '../screens/QiblaScreen';
import { TakwimScreen } from '../screens/TakwimScreen';
import { MoreScreen } from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  const { colors, accent } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding to ensure the tab items are completely above
  // system navigation bars (Samsung 3-button nav, Android gesture bar, iOS home bar)
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 10);
  const tabHeight = 58 + bottomPadding;

  return (
    <Tab.Navigator
      initialRouteName="Times"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: accent.color,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          elevation: 8,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Times"
        component={TimesScreen}
        options={{
          tabBarLabel: t('tabTimes'),
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Alarms"
        component={AlarmsScreen}
        options={{
          tabBarLabel: t('tabAzan'),
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Qibla"
        component={QiblaScreen}
        options={{
          tabBarLabel: t('tabQibla'),
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="Takwim"
        component={TakwimScreen}
        options={{
          tabBarLabel: t('tabTakwim'),
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size || 22} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: t('tabMore'),
          tabBarIcon: ({ color, size }) => <Grid color={color} size={size || 22} />,
        }}
      />
    </Tab.Navigator>
  );
};
