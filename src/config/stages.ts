import { ImageSourcePropType } from 'react-native'

export interface StageObject {
   svg: string
   points: number
   type: 'normal' | 'bomb' | 'golden'
}

export interface StageConfig {
   level: number
   name: string
   scoreThreshold: number
   completionScore?: number
   backgroundImage: ImageSourcePropType
   backgroundStageImage: ImageSourcePropType
   speedModifier: number
   spawnRateModifier: number
   objects: {
      normal: StageObject[]
      golden: StageObject
      bomb: StageObject
   }
}

export const STAGES: StageConfig[] = [
   {
      level: 1,
      name: 'Gastronomia',
      scoreThreshold: 0,
      backgroundImage: require('@/assets/images/fase1.png'),
      backgroundStageImage: require('@/assets/images/fase1-menu.png'),
      speedModifier: 1.8,
      spawnRateModifier: 1.15,
      objects: {
         normal: [
            { svg: 'bolo.svg', points: 40, type: 'normal' },
            { svg: 'carne.svg', points: 30, type: 'normal' },
            { svg: 'macarrao.svg', points: 25, type: 'normal' },
            { svg: 'ovo-frito.svg', points: 25, type: 'normal' },
            { svg: 'pao.svg', points: 20, type: 'normal' },
         ],
         golden: { svg: 'hamburguer.svg', points: 120, type: 'golden' },
         bomb: { svg: 'comida-podre.svg', points: -50, type: 'bomb' },
      },
   },
   {
      level: 2,
      name: 'Administração',
      scoreThreshold: 800,
      backgroundImage: require('@/assets/images/fase2.png'),
      backgroundStageImage: require('@/assets/images/fase2-menu.png'),
      speedModifier: 2.2,
      spawnRateModifier: 1.2,
      objects: {
         normal: [
            { svg: 'ampulheta.svg', points: 50, type: 'normal' },
            { svg: 'planilha.svg', points: 40, type: 'normal' },
            { svg: 'grafico.svg', points: 30, type: 'normal' },
            { svg: 'prancheta.svg', points: 30, type: 'normal' },
            { svg: 'livro.svg', points: 25, type: 'normal' },
         ],
         golden: { svg: 'ideia.svg', points: 200, type: 'golden' },
         bomb: { svg: 'grafico-negativo.svg', points: -60, type: 'bomb' },
      },
   },
   {
      level: 3,
      name: 'Enfermagem',
      scoreThreshold: 1200,
      backgroundImage: require('@/assets/images/fase3.png'),
      backgroundStageImage:require('@/assets/images/fase3-menu.png'),
      speedModifier: 2.8,
      spawnRateModifier: 1.3,
      objects: {
         normal: [
            { svg: 'agulha.svg', points: 60, type: 'normal' },
            { svg: 'esqueleto.svg', points: 50, type: 'normal' },
            { svg: 'hospital.svg', points: 40, type: 'normal' },
            { svg: 'cruz-vermelha.svg', points: 40, type: 'normal' },
            { svg: 'bolsa-sangue.svg', points: 35, type: 'normal' },
         ],
         golden: { svg: 'remedio.svg', points: 280, type: 'golden' },
         bomb: { svg: 'virus.svg', points: -75, type: 'bomb' },
      },
   },
   {
      level: 4,
      name: 'Análise e Des. de Sistemas',
      scoreThreshold: 1800,
      backgroundImage: require('@/assets/images/fase4.png'),
      backgroundStageImage:require('@/assets/images/fase4-menu.png'),
      speedModifier: 3.5,
      spawnRateModifier: 1.4,
      objects: {
         normal: [
            { svg: 'c.svg', points: 70, type: 'normal' },
            { svg: 'css.svg', points: 60, type: 'normal' },
            { svg: 'html.svg', points: 50, type: 'normal' },
            { svg: 'java.svg', points: 50, type: 'normal' },
            { svg: 'ruby.svg', points: 45, type: 'normal' },
         ],
         golden: { svg: 'react.svg', points: 360, type: 'golden' },
         bomb: { svg: 'bug.svg', points: -90, type: 'bomb' },
      },
   },
   {
      level: 5,
      name: 'Senac Hub Tech',
      scoreThreshold: 2800,
      completionScore: 3600,
      backgroundImage: require('@/assets/images/fase5.png'),
      backgroundStageImage:require('@/assets/images/fase5-menu.png'),
      speedModifier: 4.1,
      spawnRateModifier: 1.5,
      objects: {
         normal: [
            { svg: 'holograma.svg', points: 80, type: 'normal' },
            { svg: 'chip.svg', points: 70, type: 'normal' },
            { svg: 'microfone.svg', points: 60, type: 'normal' },
            { svg: 'cerebro.svg', points: 60, type: 'normal' },
            { svg: 'predio.svg', points: 50, type: 'normal' },
         ],
         golden: { svg: 'robo.svg', points: 450, type: 'golden' },
         bomb: { svg: 'hacker.svg', points: -100, type: 'bomb' },
      },
   },
]