// src/hooks/useGameEngine.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { Dimensions } from 'react-native'
import { GameObject, GameState } from '@/src/types/game'
import { STAGES, StageConfig, StageObject } from '@/src/config/stages'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const GAME_AREA_HEIGHT = SCREEN_HEIGHT * 0.8
const DANGER_LINE_Y = GAME_AREA_HEIGHT - 80

// Função auxiliar para encontrar a fase atual com base na pontuação
const findCurrentStage = (score: number): StageConfig => {
    // Itera de trás para frente para encontrar a maior fase que a pontuação alcançou
    for (let i = STAGES.length - 1; i >= 0; i--) {
        if (score >= STAGES[i].scoreThreshold) {
            return STAGES[i]
        }
    }
    return STAGES[0] // Retorna a primeira fase como padrão
}

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        level: 1,
        lives: 3,
        isPlaying: false,
        isGameOver: false,
        isStageComplete: false,
        objects: [],
        currentStage: 1, // Começa na fase 1
    })

    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)

    const generateRandomObject = useCallback((): GameObject => {
        // Pega a configuração da fase atual
        const stageConfig = STAGES.find(s => s.level === gameState.currentStage) || STAGES[0]
        const { common, golden, bomb } = stageConfig.objects
        
        const randomNumber = Math.random()
        let objectData: StageObject

        if (randomNumber < 0.05) { // 5% de chance para objeto dourado
            objectData = golden
        } else if (randomNumber < 0.25) { // 20% de chance para bomba (total 25%)
            objectData = bomb
        } else { // 75% de chance para frutas comuns
            objectData = common[Math.floor(Math.random() * common.length)]
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * (SCREEN_WIDTH - 60),
            y: 0,
            type: objectData.type,
            points: objectData.points,
            svg: objectData.svg, // Passa o componente SVG
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

            // ** LÓGICA DE CONCLUSÃO DE FASE **
            if (nextStage && newScore >= nextStage.scoreThreshold) {
                // O jogador atingiu a pontuação para a próxima fase!
                return {
                ...prev,
                score: newScore, // Mantém a pontuação para exibir no modal
                isPlaying: false, // Para o jogo
                isStageComplete: true, // Ativa o modal de sucesso
                objects: prev.objects.filter(obj => obj.id !== objectId), // Remove o objeto tocado
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

    // MODIFICADO: Aceita um parâmetro para a fase inicial
    const startGame = useCallback((stageToStart: number = 1) => {
        // Encontra a pontuação inicial e o nível para aquela fase
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

    // NOVO: Função para avançar para a próxima fase
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
            isStageComplete: false, // Reseta o estado de conclusão
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
            
            // A taxa de spawn agora é afetada pelo modificador da fase
            const spawnInterval = Math.max(
                (baseInterval - levelReduction - scoreReduction) / stageConfig.spawnRateModifier, 
                150 // Um limite mínimo ainda mais rápido
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
        gameState.currentStage, // Adicione currentStage às dependências
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