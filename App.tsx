import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Home, Gamepad2, Trophy } from 'lucide-react-native';
import { RootTabParamList } from './src/navigation/types';

import HomeScreen from '@/src/screens/HomeScreen';
import GameScreen from '@/src/screens/GameScreen';
import LeaderboardScreen from '@/src/screens/LeaderboardScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          title: 'Jogo',
          tabBarIcon: ({ size, color }) => <Gamepad2 size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: 'Classificação',
          tabBarIcon: ({ size, color }) => <Trophy size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
   return (
      <SafeAreaProvider>
         <NavigationContainer>
            <MyTabs />
         </NavigationContainer>
         <StatusBar style="auto" />
      </SafeAreaProvider>
   );
}