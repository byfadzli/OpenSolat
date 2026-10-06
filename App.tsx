import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/components/ThemeProvider';
import { LanguageProvider } from './src/components/LanguageProvider';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { initNotificationListener } from './src/services/notificationService';

const AppNavigator: React.FC = () => {
  const { isDark, colors } = useTheme();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
        },
      };

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <BottomTabNavigator />
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  useEffect(() => {
    const cleanup = initNotificationListener();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppNavigator />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
