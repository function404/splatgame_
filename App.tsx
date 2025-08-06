import 'react-native-gesture-handler'

import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { NavigationContainer } from '@react-navigation/native'

import { AppLoader } from '@/src/containers/AppLoaderComponent'

import { AppNavigator } from '@/src/navigation/AppNavigation'

import { ColorsTheme } from '@/src/theme/colors'

export default function App() {
  return (
    <SafeAreaProvider>
      <AppLoader>
        <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.brown100 }}>
            <NavigationContainer>
              <StatusBar backgroundColor={ColorsTheme.brown100} />

              <AppNavigator />
            </NavigationContainer>
        </SafeAreaView>
      </AppLoader>
    </SafeAreaProvider>
  )
}