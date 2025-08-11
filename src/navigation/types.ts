import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ComponentType } from 'react'

export type TRoutesStack = {
  Login: undefined
  Register: undefined
  Home: undefined
  Game: undefined
  Leaderboard: undefined
}

export interface IRoute {
  name: keyof TRoutesStack
  component: ComponentType<any>
  isPrivate: boolean
  options?: any
}

export type TNavigationProp = NativeStackNavigationProp<TRoutesStack, 'Login' | 'Register' | 'Home' | 'Game' | 'Leaderboard'>

