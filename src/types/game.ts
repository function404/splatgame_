// src/types/game.ts
import { SvgProps } from 'react-native-svg'

export interface GameObject {
  id: string
  x: number
  y: number
  type: 'normal' | 'bomb' | 'golden'
  points: number
  // Trocamos 'emoji' por 'svg'
  svg: React.FC<SvgProps> 
}

export interface GameState {
  score: number
  level: number
  lives: number
  isPlaying: boolean
  isGameOver: boolean
  isStageComplete: boolean; // <-- ADICIONADO: Controla o modal de fase concluída
  objects: GameObject[]
  currentStage: number // Adicionamos o estado da fase atual
}

// ... User e LeaderboardEntry permanecem os mesmos
export interface User {
  userId: string
  username: string
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