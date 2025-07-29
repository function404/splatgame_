export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: 'fruit' | 'bomb';
  points: number;
  emoji: string;
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  isPlaying: boolean;
  isGameOver: boolean;
  objects: GameObject[];
}

export interface User {
  userId: string;
  username: string;
  highScore: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  score: number;
  timestamp: Date;
}
