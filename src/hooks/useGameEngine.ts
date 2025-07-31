import { useState, useEffect, useCallback, useRef } from 'react'
import { Dimensions } from 'react-native'
import { GameObject, GameState } from '@/src/types/game'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const GAME_AREA_HEIGHT = SCREEN_HEIGHT * 0.8
const DANGER_LINE_Y = GAME_AREA_HEIGHT - 80

const FRUIT_TYPES = [
    { emoji: '🍎', points: 10 },
    { emoji: '🍌', points: 15 },
    { emoji: '🍇', points: 20 },
    { emoji: '🍓', points: 25 },
    { emoji: '🥝', points: 30 }
]

const GOLDEN_FRUIT_TYPE = { emoji: '🌟', points: 100 }

const BOMB_TYPE = { emoji: '💣', points: -50 }

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        level: 1,
        lives: 3,
        isPlaying: false,
        isGameOver: false,
        objects: []
    })

    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)

    const generateRandomObject = useCallback((): GameObject => {
        const randomNumber = Math.random()
        let objectType
        let type: 'fruit' | 'bomb' | 'golden'

        if (randomNumber < 0.05) {
            objectType = GOLDEN_FRUIT_TYPE
            type = 'golden'
        } else if (randomNumber < 0.25) {
            objectType = BOMB_TYPE
            type = 'bomb'
        } else {
            objectType = FRUIT_TYPES[Math.floor(
                Math.random() * FRUIT_TYPES.length)]
            type = 'fruit'
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * (SCREEN_WIDTH - 60),
            y: 0,
            type: type,
            points: objectType.points,
            emoji: objectType.emoji
        }
    }, [])

    const spawnObject = useCallback(() => {
        if (!gameState.isPlaying) return
        
        setGameState(prev => ({
            ...prev,
            objects: [...prev.objects, generateRandomObject()]
        }))
    }, [gameState.isPlaying, generateRandomObject])

    const moveObjects = useCallback(() => {
        if (!gameState.isPlaying) return

        setGameState(prev => {
            const speed = 2 + (prev.level * 0.5)
            let livesLostThisFrame = 0

            const updatedObjects = prev.objects
                .map(obj => ({ ...obj, y: obj.y + speed }))
                .filter(obj => {
                    if ((obj.type === 'fruit' || 
                            obj.type === 'golden') && 
                                obj.y > DANGER_LINE_Y) {
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
                isPlaying: !isGameOver
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
                isPlaying: !isGameOver
            }
        })
    }, [])

    const startGame = useCallback(() => {
        setGameState({
            score: 0,
            level: 1,
            lives: 3,
            isPlaying: true,
            isGameOver: false,
            objects: []
        })
    }, [])

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isPlaying: false,
            isGameOver: false,
            objects: []
        }))
    }, [])

    useEffect(() => {
        if (gameState.isPlaying) {
            gameLoopRef.current = setInterval(moveObjects, 50)
            
            const baseInterval = 800
            const levelReduction = gameState.level * 50
            const scoreReduction = Math.floor(gameState.score / 100) * 20
            const spawnInterval = Math.max(baseInterval - 
                levelReduction - scoreReduction, 200)
            
            spawnTimerRef.current = setInterval(spawnObject, spawnInterval)
        } else {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current)
            }
            if (spawnTimerRef.current) {
                clearInterval(spawnTimerRef.current)
            }
        }

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current)
            }
            if (spawnTimerRef.current) {
                clearInterval(spawnTimerRef.current)
            }
        }
    }, [
        gameState.isPlaying,
        gameState.level,
        gameState.score,
        moveObjects,
        spawnObject
    ])

    return {
        gameState,
        startGame,
        resetGame,
        tapObject,
        DANGER_LINE_Y,
        SCREEN_WIDTH,
    }
}