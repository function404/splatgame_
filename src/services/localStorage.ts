import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LeaderboardEntry } from '@/src/types/game';

const USER_KEY = 'user_data';
const LEADERBOARD_KEY = 'leaderboard_data';

const getStoredData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (e) {
    console.error('Error reading from storage', e);
    return null;
  }
};

const setStoredData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving to storage', e);
  }
};

export const LocalStorageService = {
  async getUser(userId: string): Promise<User | null> {
    return await getStoredData<User>(USER_KEY);
  },

  async createUser(user: User): Promise<void> {
    await setStoredData(USER_KEY, user);
  },

  async updateHighScore(userId: string, newScore: number): Promise<void> {
    const user = await this.getUser(userId);

    if (user && newScore > user.highScore) {
      const updatedUser = { ...user, highScore: newScore };
      await setStoredData(USER_KEY, updatedUser);
    }
  },

  async addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'>): Promise<void> {
    const leaderboard = (await this.getTopScores(100)) || [];
    
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    leaderboard.push(newEntry);
    
    leaderboard.sort((a, b) => b.score - a.score);
    const updatedLeaderboard = leaderboard.slice(0, 50);

    await setStoredData(LEADERBOARD_KEY, updatedLeaderboard);
  },


  async getTopScores(limitCount: number = 10): Promise<LeaderboardEntry[]> {
    const leaderboard = await getStoredData<LeaderboardEntry[]>(LEADERBOARD_KEY);
    return (leaderboard || []).slice(0, limitCount);
  },

  async getUserRank(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    if (!user || user.highScore === 0) return 0;

    const leaderboard = await this.getTopScores(100);
    if (!leaderboard) return 1;

    const rank = leaderboard.findIndex(entry => user.highScore >= entry.score);

    return rank === -1 ? leaderboard.length + 1 : rank + 1;
  },

  async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([USER_KEY, LEADERBOARD_KEY]);
    } catch (e) {
      console.error('Error resetting data', e);
    }
  },
};