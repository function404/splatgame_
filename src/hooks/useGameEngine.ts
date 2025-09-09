import { useState, useCallback, useRef, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

import { STAGES, StageObject } from '@/src/config/stages'
import { db } from '@/src/firebase/config'
import { GameObject, IPrize, GameState } from '@/src/types/game'

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
    awardedPrize: null,
    wonPrizes: {},
}

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>(initialGameState)
    const [prizeStock, setPrizeStock] = useState<IPrize[]>([])

    const gameLoopRef = useRef<number | null>(null)
    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const fetchPrizes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'award'))
                const prizes: IPrize[] = querySnapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    name: doc.id, // ex: "bolinha"
                    stock: data.stock,
                    chance: data.chance,
                } as IPrize
                })
                setPrizeStock(prizes)
            } catch (error) {
                console.error('Erro ao buscar prêmios:', error)
            }
        }

        fetchPrizes()
    }, [])
    
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

    const awardPrize = useCallback(async () => {
        const availablePrizes = prizeStock.filter(p => p.stock > 0)

        if (availablePrizes.length === 0) return null

        const probabilityList: { prize: IPrize; weight: number }[] = []
        let cumulativeWeight = 0
        
        availablePrizes.forEach(prize => {
            cumulativeWeight += prize.chance
            probabilityList.push({ prize, weight: cumulativeWeight })
        })

        const totalWeight = probabilityList[probabilityList.length - 1].weight
        
        const random = Math.random() * totalWeight
        
        const chosenEntry = probabilityList.find(entry => random < entry.weight)
        
        const chosenPrize = chosenEntry ? chosenEntry.prize : availablePrizes[0]

        if (!chosenPrize) {
            return null
        }

        // const newPrizeStock = prizeStock.map(prize =>
        //     prize.name === chosenPrize.name
        //     ? { ...prize, stock: prize.stock - 1 }
        //     : prize
        // )

        if (chosenPrize) {
            const newPrizeStock = prizeStock.map(prize =>
                prize.name === chosenPrize.name
                    ? { ...prize, stock: prize.stock - 1 }
                    : prize
            )
            setPrizeStock(newPrizeStock)

            // atualiza no Firebase também
            await updateDoc(doc(db, 'award', chosenPrize.name), {
            stock: chosenPrize.stock - 1,
            })

            return chosenPrize.name
        }
    }, [prizeStock])

    const tapObject = useCallback((objectId: string) => {
        setGameState(prev => {
            if (prev.isPaused) return prev

            const tappedObject = prev.objects.find(obj => obj.id === objectId)
            if (!tappedObject || tappedObject.y > DANGER_LINE_Y) {
            return prev
            }

            const newScore = Math.max(0, prev.score + tappedObject.points)

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

        setGameState(prev => {
            const currentStageConfig =
                STAGES.find(s => s.level === prev.currentStage) || STAGES[0]
                
            const nextStageConfig = STAGES.find(
                s => s.level === prev.currentStage + 1,
            )

            const updatePrizes = (prize: string | null) => {
                if (!prize) return prev.wonPrizes
                return {
                    ...prev.wonPrizes,
                    [prize]: (prev.wonPrizes[prize] || 0) + 1,
                }
            }

            if (
                currentStageConfig.completionScore &&
                prev.score >= currentStageConfig.completionScore
            ) {
                awardPrize().then(prize => {
                    setGameState(state => ({
                        ...state,
                        isPlaying: false,
                        isGameComplete: true,
                        isStageComplete: true,
                        objects: [],
                        awardedPrize: prize ?? null,
                        wonPrizes: updatePrizes(prize ?? null),
                    }))
                })
            } 

            if (nextStageConfig && prev.score >= nextStageConfig.scoreThreshold) {
                awardPrize().then(prize => {
                    setGameState(state => ({
                        ...state,
                        isPlaying: false,
                        isStageComplete: true,
                        awardedPrize: prize ?? null,
                        wonPrizes: updatePrizes(prize ?? null),
                    }))
                })
            }

            return prev
        })
    }, [awardPrize])

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
                200,
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
        prizeStock,
        startGame,
        resetGame,
        tapObject,
        pauseGame,
        resumeGame,
        DANGER_LINE_Y,
        SCREEN_WIDTH,
    }
}