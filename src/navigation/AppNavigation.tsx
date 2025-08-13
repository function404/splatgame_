import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'

import { auth } from '@/src/firebase/config'
import { TRoutesStack } from '@/src/navigation/types'

import HomeScreen from '@/src/screens/HomeScreen'
import LoginScreen from '@/src/screens/LoginScreen'
import RegisterScreen from '@/src/screens/RegisterScreen'
import GameScreen from '@/src/screens/GameScreen'
import LeaderboardScreen from '@/src/screens/LeaderboardScreen'
import { ColorsTheme } from '@/src/theme/colors'

const Stack = createStackNavigator<TRoutesStack>()

/**
 * AppNavigator
 * O componente principal de navegação do aplicativo.
 * Gerencia dois grupos de rotas: um para autenticação e outro para o app principal.
 */
export const AppNavigator = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
         setUser(authenticatedUser)
         setLoading(false)
      })

      return unsubscribe
   }, [])

   if (loading) {
      return (
         <>
            <ActivityIndicator size="large" color={ColorsTheme.blue500} />
            <Text>Carregando Conteúdo...</Text>
         </>
      )
   }

   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {user ? (
            <Stack.Group>
               <Stack.Screen name="Home" component={HomeScreen} />
               <Stack.Screen
                  name="Game"
                  component={GameScreen}
                  options={{ ...TransitionPresets.ScaleFromCenterAndroid }}
               />
               <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            </Stack.Group>
         ) : (
            <Stack.Group>
               <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ ...TransitionPresets.FadeFromBottomAndroid }}
               />
               <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ ...TransitionPresets.FadeFromBottomAndroid }}
               />
            </Stack.Group>
         )}
      </Stack.Navigator>
   )
}
