import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { RotateCcw, House } from 'lucide-react-native'

import { GameHeader } from '@/src/components/GameHeader'
import { FallingObject } from '@/src/components/FallingObject'
import { DangerLine } from '@/src/components/DangerLine'
import { StageSelector } from '@/src/components/StageSelector'

import { STAGES } from '@/src/config/stages'

import { useGameEngine } from '@/src/hooks/useGameEngine'

import { TNavigationProp } from '@/src/navigation/types'

import { LocalStorageService } from '@/src/services/localStorage'

import { ColorsTheme } from '@/src/theme/colors'

import { User } from '@/src/types/game'

export default function GameScreen() {
  const navigation = useNavigation<TNavigationProp>()
  const { 
    gameState, 
    startGame, 
    resetGame, 
    tapObject, 
    DANGER_LINE_Y, 
    SCREEN_WIDTH, 
  } = useGameEngine()
  
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [unlockedStages, setUnlockedStages] = useState<number[]>([1])
  const [newlyUnlockedStage, setNewlyUnlockedStage] = useState<number | null>(null)

  const loadUserProgress = useCallback(async () => {
    const mockUserId = 'user_123'
    const user: User | null = await LocalStorageService.getUser(mockUserId)
    let unlocked: number[] = [1]
    if (user) {
      const unlockedFromScore = STAGES
        .filter(stage => user.highScore >= stage.scoreThreshold)
        .map(stage => stage.level)
      
      const allUnlocked = new Set([1, ...unlockedFromScore])
      unlocked = Array.from(allUnlocked)
    }
    setUnlockedStages(unlocked)
    return unlocked
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadUserProgress()
    }, [loadUserProgress])
  )

  const saveProgress = useCallback(async (score: number) => {
    try {
      const mockUserId = 'user_123'
      const user = await LocalStorageService.getUser(mockUserId)
      
      if (!user) {
        console.error("Tentativa de salvar progresso sem um usuário logado.")
        return
      }
      
      await LocalStorageService.updateHighScore(mockUserId, score)
      await LocalStorageService.addLeaderboardEntry({
        userId: mockUserId,
        username: user.username,
        score: score,
      })
    } catch (error) {
      console.error('Error saving game data:', error)
    }
  }, [])

  useEffect(() => {
    if (gameState.isGameOver && !showGameOverModal) {
      setShowGameOverModal(true)
      saveProgress(gameState.score)
    }
  }, [gameState.isGameOver, gameState.score, saveProgress, showGameOverModal])

  useEffect(() => {
    if (gameState.isStageComplete && !gameState.isGameOver) {
      const handleStageCompletion = async () => {
        const previouslyUnlocked = unlockedStages
        
        await saveProgress(gameState.score)
        
        const newlyUnlockedList = await loadUserProgress()
        
        const newStageLevel = newlyUnlockedList.find(level => 
          !previouslyUnlocked.includes(level))

        if (newStageLevel) {
          setNewlyUnlockedStage(newStageLevel)
        }
      }
      handleStageCompletion()
    }
  }, [
    gameState.isStageComplete, 
    gameState.isGameOver, 
    gameState.score, 
    saveProgress, 
    loadUserProgress
  ])

  const handleStartGame = (stageLevel: number) => {
    setNewlyUnlockedStage(null)
    startGame(stageLevel)
  }

  const handleNewGameFromModal = () => {
    setShowGameOverModal(false)
    startGame(gameState.currentStage)
  }

  const handleGoHome = () => {
    setShowGameOverModal(false)
    resetGame()
    navigation.navigate('Home')
  }

  const handleBackToMenu = () => {
    resetGame()
  }

  const currentStageConfig = STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]

  if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isStageComplete) {
    return (
      <StageSelector
        unlockedStages={unlockedStages}
        newlyUnlockedStage={newlyUnlockedStage}
        onStartGame={handleStartGame}
        onGoBack={() => navigation.goBack()}
      />
    )
  }

  return (
    <ImageBackground 
      source={currentStageConfig.backgroundImage} 
      style={styles.gameArea}
      resizeMode="cover"
    >
      <GameHeader 
        score={gameState.score} 
        level={gameState.level} 
        lives={gameState.lives} 
      />

      {gameState.objects.map(object => (
        <FallingObject key={object.id} object={object} onTap={tapObject} />
      ))}

      <DangerLine y={DANGER_LINE_Y} width={SCREEN_WIDTH} />

      {/* Modal de Fase Completa */}
      {gameState.isStageComplete && !gameState.isGameComplete && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Fase Concluída!</Text>
            <Text style={styles.finalScore}>Você completou a fase "{currentStageConfig.name}"</Text>
            <Text style={styles.levelReached}>Pontuação: {gameState.score}</Text>

            <TouchableOpacity style={styles.playAgainButton} onPress={handleBackToMenu}>
              <Text style={styles.playAgainText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal de Jogo Completo */}
      {gameState.isGameComplete && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Parabéns!</Text>
            <Text style={styles.finalScore}>Você concluiu todos os desafios!</Text>
            <Text style={styles.levelReached}>Pontuação Final: {gameState.score}</Text>

            <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
              <House size={20} color={ColorsTheme.blue200} />
              <Text style={styles.homeButtonText}>Voltar ao Início</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal de Fim de Jogo */}
      {showGameOverModal && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Fim de jogo!</Text>
            <Text style={styles.finalScore}>Pontuação final: {gameState.score}</Text>
            <Text style={styles.levelReached}>Fase alcançada: {gameState.currentStage}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.playAgainButton} onPress={handleNewGameFromModal}>
                <RotateCcw size={20} color={ColorsTheme.white} />
                <Text style={styles.playAgainText}>Tentar novamente</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                <House size={20} color={ColorsTheme.blue200} />
                <Text style={styles.homeButtonText}>Início</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: ColorsTheme.white,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    width: '90%',
    shadowColor: ColorsTheme.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ColorsTheme.blue500,
    marginBottom: 16,
    marginTop: 8,
  },
  finalScore: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorsTheme.blue200,
    marginBottom: 8,
    textAlign: 'center',
  },
  levelReached: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    marginBottom: 32,
  },
  modalButtons: {
    gap: 12,
    width: '100%',
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorsTheme.blue200,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorsTheme.white,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorsTheme.white,
    borderWidth: 2,
    borderColor: ColorsTheme.blue200,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorsTheme.blue200,
  },
})
