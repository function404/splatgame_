import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavigatorScreenParams } from '@react-navigation/native'

export type RootTabParamList = {
  Home: undefined
  Game: undefined
  Leaderboard: undefined
}

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>
}

export type RootStackNavigationProp = 
  NativeStackNavigationProp<RootStackParamList>
  
export type MainTabsNavigationProp = BottomTabNavigationProp<RootTabParamList>
