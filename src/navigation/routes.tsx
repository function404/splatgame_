import { TransitionPresets } from '@react-navigation/stack'

import { IRoute } from '@/src/navigation/types'

import HomeScreen from '@/src/screens/HomeScreen'
import LoginScreen from '@/src/screens/LoginScreen'
import RegisterScreen from '@/src/screens/RegisterScreen'
import GameScreen from '@/src/screens/GameScreen'
import LeaderboardScreen from '@/src/screens/LeaderboardScreen'

export const ROUTES: IRoute[] = [
   {
      name: 'Login',
      component: LoginScreen,
      isPrivate: false,
      options: {
         title: 'Login',
         ...TransitionPresets.FadeFromBottomAndroid,
      },
   },
   {
      name: 'Register',
      component: RegisterScreen,
      isPrivate: false,
      options: {
         title: 'Registro',
         ...TransitionPresets.FadeFromBottomAndroid,
      },
   },
   {
      name: 'Home',
      component: HomeScreen,
      isPrivate: true,
      options: {
         title: 'Início',
         ...TransitionPresets.FadeFromBottomAndroid,
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
      },
   },
]
