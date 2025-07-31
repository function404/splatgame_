import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { House, Gamepad2, Trophy } from 'lucide-react-native';
import { RootTabParamList, RootStackParamList } from './src/navigation/types';

import HomeScreen from '@/src/screens/HomeScreen';
import GameScreen from '@/src/screens/GameScreen';
import LeaderboardScreen from '@/src/screens/LeaderboardScreen';
import { ColorsTheme } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ColorsTheme.blue200,
        tabBarInactiveTintColor: ColorsTheme.grey300,
        tabBarStyle: {
          backgroundColor: ColorsTheme.white,
          borderTopWidth: 1,
          borderTopColor: ColorsTheme.grey200,
          height: 70,
          paddingBottom: 8,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ size, color }) => <House size={size} color={color} />,
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
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={MyTabs}
            options={{ headerShown: false }}
          />  
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}