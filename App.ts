import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
  Roboto_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CardapioScreen } from './src/screens/CardapioScreen';

const queryClient = new QueryClient();

export default function App(): React.ReactElement | null {
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_800ExtraBold,
  });

  const client = useMemo(() => queryClient, []);

  if (!fontsLoaded && !fontError) {
    return React.createElement(
      View,
      { style: styles.boot },
      React.createElement(ActivityIndicator, { size: 'large', color: '#008267' }),
    );
  }

  return React.createElement(
    QueryClientProvider,
    { client },
    React.createElement(
      SafeAreaProvider,
      null,
      React.createElement(
        View,
        { style: styles.appRoot },
        React.createElement(CardapioScreen, null),
      ),
      React.createElement(StatusBar, { style: 'dark' }),
    ),
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
