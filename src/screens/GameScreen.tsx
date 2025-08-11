import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, StatusBar, Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { RotateCcw, House } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { auth, db } from '@/src/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { GameHeader } from '@/src/components/GameHeader'
import { FallingObject } from '@/src/components/FallingObject'
import { DangerLine } from '@/src/components/DangerLine'
import { StageSelector } from '@/src/components/StageSelector'

import { STAGES } from '@/src/config/stages'
import { useGameEngine } from '@/src/hooks/useGameEngine'
import { TNavigationProp } from '@/src/navigation/types'
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
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return [1]

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)

      let unlocked: number[] = [1]
      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        const unlockedFromScore = STAGES
          .filter(stage => userData.highScore >= stage.scoreThreshold)
          .map(stage => stage.level)

        const allUnlocked = new Set([1, ...unlockedFromScore])
        unlocked = Array.from(allUnlocked)
      }
      setUnlockedStages(unlocked)
      return unlocked
    } catch (error) {
      console.error("Erro ao carregar progresso do usuário:", error)
      return [1]
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadUserProgress()
    }, [loadUserProgress])
  )

  const saveProgress = useCallback(async (score: number) => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      console.error("Tentativa de salvar progresso sem um usuário logado.")
      return
    }

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const currentHighScore = userDoc.data().highScore || 0
        if (score > currentHighScore) {
          await updateDoc(userDocRef, {
            highScore: score
          })
          console.log(`Novo recorde salvo: ${score}`)
        }
      }
    } catch (error) {
      console.error('Erro ao salvar dados do jogo:', error)
      Alert.alert("Erro", "Não foi possível salvar seu progresso.")
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
    loadUserProgress,
    unlockedStages
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
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.green500 }}>
        <StatusBar backgroundColor={ColorsTheme.green500} barStyle="light-content" />
        
        <StageSelector
          unlockedStages={unlockedStages}
          newlyUnlockedStage={newlyUnlockedStage}
          onStartGame={handleStartGame}
          onGoBack={() => navigation.goBack()}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange50 }}>
      <StatusBar backgroundColor={ColorsTheme.orange50} barStyle="light-content" />

      <ImageBackground
        source={currentStageConfig.backgroundImage}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={{ zIndex: 2 }}>
          <GameHeader
            score={gameState.score}
            level={gameState.level}
            lives={gameState.lives}
          />
        </View>

        <View style={{ zIndex: 1 }}>
          {gameState.objects.map(object => (
            <FallingObject key={object.id} object={{...object, y: object.y - 70}} onTap={tapObject} />
          ))}
        </View>
        <DangerLine y={DANGER_LINE_Y} width={SCREEN_WIDTH} />

        {gameState.isStageComplete && !gameState.isGameComplete && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Fase Concluída!</Text>
              
              <Text style={styles.finalScore}>Você completou a fase "{currentStageConfig.name}"</Text>
              
              <Text style={styles.levelReached}>Pontuação: {gameState.score}</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.playAgainButton} onPress={handleBackToMenu}>
                  <Text style={styles.playAgainText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {gameState.isGameComplete && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Parabéns!</Text>
              
              <Text style={styles.finalScore}>Você concluiu todos os desafios!</Text>
              
              <Text style={styles.levelReached}>Pontuação Final: {gameState.score}</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                  <House size={20} color={ColorsTheme.blue200} />
                  <Text style={styles.homeButtonText}>Voltar ao Início</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {showGameOverModal && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Fim de jogo!</Text>
              
              <Text style={styles.finalScore}>Pontuação final: {gameState.score}</Text>
              
              <Text style={styles.levelReached}>Fase alcançada: {gameState.currentStage}</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.playAgainButton} onPress={handleNewGameFromModal}>
                  <RotateCcw size={20} color={ColorsTheme.orange100} />
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
    </SafeAreaView>
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
    zIndex: 10,
  },
  modal: {
    backgroundColor: ColorsTheme.orange60,
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
    color: ColorsTheme.blue500,
    marginBottom: 16,
    marginTop: 8,
    fontFamily: 'PixelifySans-Bold',
  },
  finalScore: {
    fontSize: 18,
    color: ColorsTheme.blue500,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'PixelifySans-Medium',
  },
  levelReached: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    marginBottom: 16,
    fontFamily: 'PixelifySans-Regular',
  },
  modalButtons: {
    gap: 12,
    width: '100%',
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    backgroundColor: ColorsTheme.orange40,
    borderWidth: 2,
    borderColor: ColorsTheme.orange100,
  },
  playAgainText: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.orange100,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorsTheme.blue150,
    borderWidth: 2,
    borderColor: ColorsTheme.blue200,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue200,
  },
})
