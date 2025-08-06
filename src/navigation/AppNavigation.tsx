import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { TRoutesStack } from '@/src/navigation/types'
import { ROUTES } from '@/src/navigation/routes'

const Stack = createStackNavigator<TRoutesStack>()

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