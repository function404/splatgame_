import { IRoute } from '@/src/navigation/types'

import HomeScreen from '@/src/screens/HomeScreen'
import GameScreen from '@/src/screens/GameScreen'
import LeaderboardScreen from '@/src/screens/LeaderboardScreen'

export const ROUTES: IRoute[] = [
   {
      name: 'Home',
      component: HomeScreen,
      options: {
         title: 'Início',
      },
   },
   {
      name: 'Game',
      component: GameScreen,
      options: {
         title: 'Jogo',
      },
   },
   {
      name: 'Leaderboard',
      component: LeaderboardScreen,
      options: {
         title: 'Classificação',
      },
   },
]