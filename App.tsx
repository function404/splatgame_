import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import { AppNavigator } from '@/src/navigation/AppNavigation';
import { ColorsTheme } from '@/src/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';

// import * as SplashScreen from 'expo-splash-screen'; 

// SplashScreen.preventAutoHideAsync(); // Mantém a tela de splash visível

export default function App() {
    const [fontsLoaded, fontError] = useFonts({
    'PixelifySans-Bold': require('@/assets/fonts/PixelifySans-Bold.ttf'),
    'PixelifySans-Medium': require('@/assets/fonts/PixelifySans-Medium.ttf'),
    'PixelifySans-Regular': require('@/assets/fonts/PixelifySans-Regular.ttf'),
    'PixelifySans-SemiBold': require('@/assets/fonts/PixelifySans-SemiBold.ttf'),
    'Tiny5-Regular': require('@/assets/fonts/Tiny5-Regular.ttf'),
  })

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.brown100 }}>
        <StatusBar backgroundColor={ColorsTheme.brown100} />

        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}