import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RootStackParamList } from '@/src/navigation/types'
import { ROUTES } from '@/src/navigation/routes'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * AppNavigator
 * O componente principal de navegação do aplicativo.
 */
export const AppNavigator = () => (
   <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
         headerShown: false, 
      }}
   >
      {ROUTES.map(({ name, component, options }) => (
         <Stack.Screen
         key={name}
         name={name}
         component={component}
         options={options}
         />
      ))}
   </Stack.Navigator>
)