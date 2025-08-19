import { useState, useCallback, useRef, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { GameObject, GameState } from '@/src/types/game'
import { STAGES, StageObject } from '@/src/config/stages'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const GAME_AREA_HEIGHT = SCREEN_HEIGHT * 0.9
const DANGER_LINE_Y = GAME_AREA_HEIGHT - 100

const initialGameState: GameState = {
    score: 0,
    level: 1,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isStageComplete: false,
    isGameComplete: false,
    objects: [],
    currentStage: 1,
}

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const gameLoopRef = useRef<number | null>(null)
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)

    const generateRandomObject = useCallback((): GameObject => {
        const stageConfig = STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]
        const { normal, golden, bomb } = stageConfig.objects

        const randomNumber = Math.random()
        let objectData: StageObject

        if (randomNumber < 0.10) {
            objectData = golden
        } else if (randomNumber < 0.40) {
            objectData = bomb
        } else {
            objectData = normal[Math.floor(Math.random() * normal.length)]
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * (SCREEN_WIDTH - 60),
            y: 0,
            type: objectData.type,
            points: objectData.points,
            svg: objectData.svg,
        }
    }, [gameState.currentStage])

    const spawnObject = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            objects: [...prev.objects, generateRandomObject()],
        }))
    }, [generateRandomObject])

    const moveObjects = useCallback(() => {
        setGameState(prev => {
            if (!prev.isPlaying || prev.isPaused) return prev

            const stageConfig =
                STAGES.find(s => s.level === prev.currentStage) || STAGES[0]

            const speed = stageConfig.speedModifier

            let livesLostThisFrame = 0

            const updatedObjects = prev.objects
                .map(obj => ({ ...obj, y: obj.y + speed }))
                .filter(obj => {
                    if (obj.y > DANGER_LINE_Y) {
                            if (obj.type === 'normal' || obj.type === 'golden') {
                            livesLostThisFrame++
                        }

                        return false
                    }

                    return true
                })

            const newLives = prev.lives - livesLostThisFrame
            const isGameOver = newLives <= 0

            return {
                ...prev,
                objects: updatedObjects,
                lives: Math.max(0, newLives),
                isGameOver,
                isPlaying: !isGameOver,
            }
        })
        gameLoopRef.current = requestAnimationFrame(moveObjects)
    }, [])

    const tapObject = useCallback((objectId: string) => {
        setGameState(prev => {
            if (prev.isPaused) return prev

            const tappedObject = prev.objects.find(obj => obj.id === objectId)

            if (!tappedObject || tappedObject.y > DANGER_LINE_Y) {
                return prev
            }

            const newScore = Math.max(0, prev.score + tappedObject.points)
            const currentStageConfig =
                STAGES.find(s => s.level === prev.currentStage) || STAGES[0]

            if (
                currentStageConfig.completionScore &&
                newScore >= currentStageConfig.completionScore
            ) {
                return {
                ...prev,
                score: newScore,
                isPlaying: false,
                isGameComplete: true,
                isStageComplete: true,
                objects: [],
                }
            }

            const nextStageConfig = STAGES.find(
                s => s.level === prev.currentStage + 1,
            )

            if (nextStageConfig && newScore >= nextStageConfig.scoreThreshold) {
                return {
                    ...prev,
                    score: newScore,
                    isPlaying: false,
                    isStageComplete: true,
                    objects: prev.objects.filter(obj => obj.id !== objectId),
                }
            }

            let newLives = prev.lives
            if (tappedObject.type === 'bomb') {
                newLives = prev.lives - 1
            }

            const isGameOver = newLives <= 0

            return {
                ...prev,
                objects: prev.objects.filter(obj => obj.id !== objectId),
                score: newScore,
                lives: Math.max(0, newLives),
                isGameOver,
                isPlaying: !isGameOver,
            }
        })
    }, [])

    const startGame = useCallback((stageToStart: number = 1) => {
        setGameState(prev => ({
            ...initialGameState,
            score: 0,
            level: stageToStart,
            isPlaying: true,
            isPaused: false,
            currentStage: stageToStart,
        }))
    }, [])

    const resetGame = useCallback(() => {
        setGameState(initialGameState)
    }, [])

    const pauseGame = () => {
        setGameState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
    }

    const resumeGame = () => {
        setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
    }

    useEffect(() => {
        if (gameState.isPlaying && !gameState.isPaused) {
            gameLoopRef.current = requestAnimationFrame(moveObjects)

            const stageConfig =
                STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]
            const baseInterval = 800
            
            const spawnInterval = Math.max(
                baseInterval / stageConfig.spawnRateModifier,
                150,
            )

            spawnTimerRef.current = setInterval(spawnObject, spawnInterval)
        } else {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
        }

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
        }
    }, [
        gameState.isPlaying,
        gameState.isPaused,
        gameState.currentStage,
        moveObjects,
        spawnObject,
    ])

    return {
        gameState,
        startGame,
        resetGame,
        tapObject,
        pauseGame,
        resumeGame,
        DANGER_LINE_Y,
        SCREEN_WIDTH,
    }
}