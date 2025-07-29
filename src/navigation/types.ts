import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Home: undefined;
  Game: undefined;
  Leaderboard: undefined;
};

export type TabNavigationType = BottomTabNavigationProp<RootTabParamList>;