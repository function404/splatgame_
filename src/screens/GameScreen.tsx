import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameEngine } from '@/src/hooks/useGameEngine'
import { GameHeader } from '@/src/components/GameHeader'
import { FallingObject } from '@/src/components/FallingObject'
import { DangerLine } from '@/src/components/DangerLine'
import { LocalStorageService } from '@/src/services/localStorage'
import { TouchableOpacity, Text } from 'react-native'
import { Play, RotateCcw, House } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { MainTabsNavigationProp } from '@/src/navigation/types'
import { ColorsTheme } from '@/src/theme/colors'

export default function GameScreen() {
  const navigation = useNavigation<MainTabsNavigationProp>()
  const { 
    gameState, 
    startGame, 
    resetGame, 
    tapObject, 
    DANGER_LINE_Y, 
    SCREEN_WIDTH, 
  } = useGameEngine()
  const [showGameOverModal, setShowGameOverModal] = useState(false)

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

  const handleNewGame = () => {
    setShowGameOverModal(false)
    startGame()
  }

  const handleGoHome = () => {
    setShowGameOverModal(false)
    resetGame()
    navigation.navigate('Game')
  }

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Splat 💥</Text>
          <Text style={styles.welcomeSubtitle}>Pronto para jogar</Text>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionText}>🍎 Toque nas frutas para marcar pontos</Text>
            <Text style={styles.instructionText}>💣 Evite tocar nas bombas</Text>
            <Text style={styles.instructionText}>❤️ Não deixe as frutas chegarem à zona de perigo</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Play size={24} color={ColorsTheme.white} />
            <Text style={styles.startButtonText}>Iniciar Jogo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader 
        score={gameState.score} 
        level={gameState.level} 
        lives={gameState.lives} 
      />
      
      <View style={styles.gameArea}>
        <DangerLine y={DANGER_LINE_Y} width={SCREEN_WIDTH} />
        
        {gameState.objects.map(object => (
          <FallingObject
            key={object.id}
            object={object}
            onTap={tapObject}
          />
        ))}
      </View>

      {showGameOverModal && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverModal}>
            <Text style={styles.gameOverTitle}>Fim de jogo!</Text>
            <Text style={styles.finalScore}>Pontuação final: {gameState.score}</Text>
            <Text style={styles.levelReached}>Level alcançado: {gameState.level}</Text>

            <View style={styles.gameOverButtons}>
              <TouchableOpacity style={styles.playAgainButton} onPress={handleNewGame}>
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
    marginBottom: 40,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  instructionText: {
    fontSize: 16,
    color: ColorsTheme.blue400,
    textAlign: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorsTheme.blue200,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    shadowColor: ColorsTheme.blue200,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorsTheme.white,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverModal: {
    backgroundColor: ColorsTheme.white,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: ColorsTheme.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ColorsTheme.blue500,
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorsTheme.blue200,
    marginBottom: 8,
  },
  levelReached: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    marginBottom: 32,
  },
  gameOverButtons: {
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