export interface GameObject {
  id: string
  x: number
  y: number
  type: 'normal' | 'bomb' | 'golden'
  points: number
  svg: string
}

export interface GameState {
  score: number
  level: number
  lives: number
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
  isStageComplete: boolean
  isGameComplete: boolean
  objects: GameObject[]
  currentStage: number
}

export interface User {
  userId: string
  username: string
  email: string
  highScore: number
  createdAt: Date
}

export interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  score: number
  timestamp: Date
}