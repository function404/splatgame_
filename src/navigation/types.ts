import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ComponentType } from 'react'

export type TRoutesStack = {
  Home: undefined
  Game: undefined
  Leaderboard: undefined
}

export interface IRoute {
  name: keyof TRoutesStack
  component: ComponentType<any>
  options?: any
}

export type TNavigationProp = NativeStackNavigationProp<TRoutesStack, 'Home' | 'Game' | 'Leaderboard'>

