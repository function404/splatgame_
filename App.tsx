import 'react-native-gesture-handler'

import React from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from '@react-navigation/native'

import { AppLoader } from '@/src/containers/AppLoaderComponent'
import { AppNavigator } from '@/src/navigation/AppNavigation'

export default function App() {
  return (
    <SafeAreaProvider>
      <AppLoader>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppLoader>
    </SafeAreaProvider>
  )
}
