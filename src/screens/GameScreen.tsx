import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Play, RotateCcw, House, Lock, Star } from 'lucide-react-native'

import { useGameEngine } from '@/src/hooks/useGameEngine'
import { GameHeader } from '@/src/components/GameHeader'
import { FallingObject } from '@/src/components/FallingObject'
import { DangerLine } from '@/src/components/DangerLine'
import { LocalStorageService } from '@/src/services/localStorage'
import { MainTabsNavigationProp } from '@/src/navigation/types'
import { ColorsTheme } from '@/src/theme/colors'
import { STAGES } from '@/src/config/stages'
import { User } from '@/src/types/game'

export default function GameScreen() {
  const navigation = useNavigation<MainTabsNavigationProp>()
  const { 
    gameState, 
    startGame, 
    resetGame, 
    tapObject, 
    startNextStage,
    DANGER_LINE_Y, 
    SCREEN_WIDTH, 
  } = useGameEngine()
  
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [unlockedStages, setUnlockedStages] = useState<number[]>([1]) // Nível 1 sempre desbloqueado

  // Carrega o progresso do usuário para desbloquear as fases
  useFocusEffect(
    useCallback(() => {
      const loadUserProgress = async () => {
        const mockUserId = 'user_123'
        const user: User | null = await LocalStorageService.getUser(mockUserId)
        if (user) {
          const unlocked = STAGES.filter(stage => user.highScore >= stage.scoreThreshold).map(stage => stage.level)
          // Garante que pelo menos a fase 1 esteja sempre disponível
          setUnlockedStages(unlocked.length > 0 ? unlocked : [1])
        }
      }
      loadUserProgress()
    }, [])
  );

  useEffect(() => {
    if (gameState.isGameOver && !showGameOverModal) {
      setShowGameOverModal(true)
      handleGameOver()
    }
  }, [gameState.isGameOver])

  const handleGameOver = async () => {
    try {
      const mockUserId = 'user_123'
      const user = await LocalStorageService.getUser(mockUserId)
      const username = user ? user.username : 'Player'
      await LocalStorageService.updateHighScore(mockUserId, gameState.score)
      await LocalStorageService.addLeaderboardEntry({
        userId: mockUserId,
        username: username,
        score: gameState.score,
        timestamp: new Date()
      })
      if (!user) {
        await LocalStorageService.createUser({
          userId: mockUserId,
          username: username,
          highScore: gameState.score,
          createdAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error saving game data:', error)
    }
  }

  const handleStartGame = (stageLevel: number) => {
    startGame(stageLevel);
  }

  const handleNewGameFromModal = () => {
    setShowGameOverModal(false)
    startGame(gameState.currentStage) // Reinicia na mesma fase
  }

  const handleGoHome = () => {
    setShowGameOverModal(false)
    resetGame()
    navigation.navigate('Home') // Navega para a Home, não para a própria tela
  }

  const handleContinue = () => {
    startNextStage()
  }

  const handleBackToMenu = () => {
    resetGame()
  }

  const currentStageConfig = STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]

  // TELA DE SELEÇÃO DE FASE
  if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isStageComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Splat 💥</Text>
          <Text style={styles.welcomeSubtitle}>Selecione uma fase</Text>
          
          <ScrollView contentContainerStyle={styles.stageSelectorContainer}>
            {STAGES.map(stage => {
              const isUnlocked = unlockedStages.includes(stage.level)
              return (
                <TouchableOpacity
                  key={stage.level}
                  style={[styles.stageItem, isUnlocked ? styles.stageUnlocked : styles.stageLocked]}
                  disabled={!isUnlocked}
                  onPress={() => handleStartGame(stage.level)}
                >
                  <View style={styles.stageInfo}>
                    <Text style={styles.stageLevelText}>Fase {stage.level}</Text>
                    <Text style={styles.stageNameText}>{stage.name}</Text>
                    <Text style={styles.stageScoreText}>Recorde para desbloquear: {stage.scoreThreshold} pts</Text>
                  </View>
                  <View style={styles.stageAction}>
                    {isUnlocked ? <Play size={24} color={ColorsTheme.white} /> : <Lock size={24} color={ColorsTheme.grey300} />}
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }

  // JOGO EM ANDAMENTO
  return (
    <SafeAreaView style={styles.container}>
      <GameHeader 
        score={gameState.score} 
        level={gameState.level} 
        lives={gameState.lives} 
      />
      
      <ImageBackground 
        source={currentStageConfig.backgroundImage} 
        style={styles.gameArea}
        resizeMode="cover"
      >
        <DangerLine y={DANGER_LINE_Y} width={SCREEN_WIDTH} />
        
        {gameState.objects.map(object => (
          <FallingObject
            key={object.id}
            object={object}
            onTap={tapObject}
          />
        ))}
      </ImageBackground>

      {/* MODAL DE FASE CONCLUÍDA */}
      {gameState.isStageComplete && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Star size={40} color={ColorsTheme.yellow100} fill={ColorsTheme.yellow100} />
            <Text style={styles.modalTitle}>Fase Concluída!</Text>
            <Text style={styles.finalScore}>Você completou a fase "{currentStageConfig.name}"</Text>
            <Text style={styles.levelReached}>Pontuação: {gameState.score}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.playAgainButton} onPress={handleContinue}>
                <Text style={styles.playAgainText}>Próxima Fase</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.homeButton} onPress={handleBackToMenu}>
                <Text style={styles.homeButtonText}>Voltar ao Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* MODAL DE FIM DE JOGO */}
      {showGameOverModal && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Fim de jogo!</Text>
            <Text style={styles.finalScore}>Pontuação final: {gameState.score}</Text>
            <Text style={styles.levelReached}>Level alcançado: {gameState.level}</Text>

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
    </SafeAreaView>
  )
}

// Renomeei alguns estilos para serem mais genéricos (modal, overlay)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsTheme.blue100,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ColorsTheme.blue500,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: ColorsTheme.grey300,
    marginBottom: 20,
  },
  // Estilos para o seletor de fase
  stageSelectorContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  stageItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  stageUnlocked: {
    backgroundColor: ColorsTheme.blue200,
    borderColor: ColorsTheme.blue400,
  },
  stageLocked: {
    backgroundColor: ColorsTheme.grey100,
    borderColor: ColorsTheme.grey200,
  },
  stageInfo: {
    flex: 1,
  },
  stageAction: {
    marginLeft: 16,
  },
  stageLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorsTheme.white,
  },
  stageNameText: {
    fontSize: 14,
    color: ColorsTheme.blue100,
    marginTop: 2,
  },
  stageScoreText: {
    fontSize: 12,
    color: ColorsTheme.white,
    opacity: 0.8,
    marginTop: 4,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  // Estilos genéricos para os modais
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
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
