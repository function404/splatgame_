import { NativeStackNavigationOptions, NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ComponentType } from 'react'

export type RootStackParamList = {
  Home: undefined
  Game: undefined
  Leaderboard: undefined
}

export interface IRoute {
  name: keyof RootStackParamList
  component: ComponentType<any>
  options?: NativeStackNavigationOptions
}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>