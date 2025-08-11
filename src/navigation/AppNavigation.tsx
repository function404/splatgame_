import React, { useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'

import { auth } from '@/src/firebase/config'
import { TRoutesStack } from '@/src/navigation/types'
import { ROUTES } from '@/src/navigation/routes'

const Stack = createStackNavigator<TRoutesStack>()

/**
 * AppNavigator
 * O componente principal de navegação do aplicativo.
 */
export const AppNavigator = () => {
   const [user, setUser] = useState<FirebaseUser | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
         setUser(authenticatedUser)
         setLoading(false)
      })

      return unsubscribe
   }, [])

   if (loading) return null

   return (
      <Stack.Navigator
         initialRouteName={user ? 'Home' : 'Login'}
         screenOptions={{ headerShown: false }}
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
}