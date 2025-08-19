import { TransitionPresets } from '@react-navigation/stack'

import { IRoute } from '@/src/navigation/types'

import HomeScreen from '@/src/screens/HomeScreen'
import LoginScreen from '@/src/screens/LoginScreen'
import RegisterScreen from '@/src/screens/RegisterScreen'
import GameScreen from '@/src/screens/GameScreen'
import LeaderboardScreen from '@/src/screens/LeaderboardScreen'

export const ROUTES: IRoute[] = [
   {
      name: 'Home',
      component: HomeScreen,
      isPrivate: true,
      options: {
         title: 'Início',
         ...TransitionPresets.FadeFromRightAndroid,
      },
   },
   {
      name: 'Login',
      component: LoginScreen,
      isPrivate: false,
      options: {
         title: 'Login',
         ...TransitionPresets.FadeFromRightAndroid,
      },
   },
   {
      name: 'Register',
      component: RegisterScreen,
      isPrivate: false,
      options: {
         title: 'Registro',
         ...TransitionPresets.FadeFromRightAndroid,
      },
   },
   {
      name: 'Game',
      component: GameScreen,
      isPrivate: true,
      options: {
         title: 'Jogo',
         ...TransitionPresets.ScaleFromCenterAndroid,
      },
   },
   {
      name: 'Leaderboard',
      component: LeaderboardScreen,
      isPrivate: true,
      options: {
         title: 'Classificação',
         ...TransitionPresets.FadeFromRightAndroid,
      },
   },
]
