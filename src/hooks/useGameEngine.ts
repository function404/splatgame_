import { useState, useEffect, useCallback, useRef } from 'react'
import { Dimensions } from 'react-native'

import { GameObject, GameState } from '@/src/types/game'

import { STAGES, StageObject } from '@/src/config/stages'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const GAME_AREA_HEIGHT = SCREEN_HEIGHT * 0.9
const DANGER_LINE_Y = GAME_AREA_HEIGHT - 50

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        level: 1,
        lives: 3,
        isPlaying: false,
        isGameOver: false,
        isStageComplete: false,
        objects: [],
        currentStage: 1,
    })

    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)

    const generateRandomObject = useCallback((): GameObject => {
        const stageConfig = STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]
        const { normal, golden, bomb } = stageConfig.objects
        
        const randomNumber = Math.random()
        let objectData: StageObject

        if (randomNumber < 0.05) {
            objectData = golden
        } else if (randomNumber < 0.25) {
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
        if (!gameState.isPlaying) return
        
        setGameState(prev => ({
            ...prev,
            objects: [...prev.objects, generateRandomObject()],
        }))
    }, [gameState.isPlaying, generateRandomObject])

    const moveObjects = useCallback(() => {
        if (!gameState.isPlaying) return

        setGameState(prev => {
            const stageConfig = STAGES.find(s => s.level === prev.currentStage) || STAGES[0]
            const speed = (2 + (prev.level * 0.5)) * stageConfig.speedModifier

            let livesLostThisFrame = 0

            const updatedObjects = prev.objects
                .map(obj => ({ ...obj, y: obj.y + speed }))
                .filter(obj => {
                    if ((obj.type === 'normal' || obj.type === 'golden') && obj.y > DANGER_LINE_Y) {
                        livesLostThisFrame++
                        return false
                    }

                    if (obj.y > SCREEN_HEIGHT) {
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
    }, [gameState.isPlaying])

    const tapObject = useCallback((objectId: string) => {
        setGameState(prev => {
            const tappedObject = prev.objects.find(obj => obj.id === objectId)
            if (!tappedObject || tappedObject.y > DANGER_LINE_Y) {
                return prev
            }

            const newScore = Math.max(0, prev.score + tappedObject.points)
            const newLevel = Math.floor(newScore / 500) + 1
            
            const currentStage = STAGES.find(s => s.level === prev.currentStage) || STAGES[0]
            const nextStage = STAGES.find(s => s.level === prev.currentStage + 1)

            if (nextStage && newScore >= nextStage.scoreThreshold) {
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
                level: newLevel,
                lives: Math.max(0, newLives),
                isGameOver,
                isPlaying: !isGameOver,
                currentStage: currentStage.level,
            }
        })
    }, [])

    const startGame = useCallback((stageToStart: number = 1) => {
        const stageConfig = STAGES.find(s => s.level === stageToStart) || STAGES[0]
        const initialScore = stageConfig.scoreThreshold
        const initialLevel = Math.floor(initialScore / 500) + 1

        setGameState({
            score: initialScore,
            level: initialLevel,
            lives: 3,
            isPlaying: true,
            isGameOver: false,
            isStageComplete: false,
            objects: [],
            currentStage: stageToStart,
        })
    }, [])

    const startNextStage = useCallback(() => {
        const nextStageLevel = gameState.currentStage + 1
        if (nextStageLevel <= STAGES.length) {
        startGame(nextStageLevel)
        }
    }, [gameState.currentStage, startGame])

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isPlaying: false,
            isGameOver: false,
            isStageComplete: false,
            objects: [],
            score: 0,
            level: 1,
            currentStage: 1,
        }))
    }, [])

    useEffect(() => {
        if (gameState.isPlaying) {
            gameLoopRef.current = setInterval(moveObjects, 50)
            
            const stageConfig = STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]
            const baseInterval = 800
            const levelReduction = gameState.level * 50
            const scoreReduction = Math.floor(gameState.score / 100) * 20
            
            const spawnInterval = Math.max(
                (baseInterval - levelReduction - scoreReduction) / stageConfig.spawnRateModifier, 
                150
            )
            
            spawnTimerRef.current = setInterval(spawnObject, spawnInterval)
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
        }

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
        }
    }, [
        gameState.isPlaying,
        gameState.level,
        gameState.score,
        gameState.currentStage,
        moveObjects,
        spawnObject
    ])

    return {
        gameState,
        startGame,
        resetGame,
        tapObject,
        startNextStage,
        DANGER_LINE_Y,
        SCREEN_WIDTH,
    }
}