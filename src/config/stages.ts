// src/config/stages.ts
import { ImageSourcePropType } from 'react-native'
import { SvgProps } from 'react-native-svg'


// ---- PASSO IMPORTANTE ----
// Você precisará criar seus componentes SVG e importá-los aqui.
// Exemplo: import AppleSvg from '@/assets/svgs/Apple'
// Por enquanto, usaremos um placeholder.

import CakeSvg from '@/assets/images/grastronomy/bolo.svg'
import MeathSvg from '@/assets/images/grastronomy/carne.svg'
import RottenFoodSvg from '@/assets/images/grastronomy/comida-podre.svg'
import HamburgerSvg from '@/assets/images/grastronomy/hamburguer.svg'
import PastaSvg from '@/assets/images/grastronomy/macarrao.svg'
import EggSvg from '@/assets/images/grastronomy/ovo-frito.svg'
import BreadSvg from '@/assets/images/grastronomy/pao.svg'


const PlaceholderSvg: React.FC<SvgProps> = () => null 

// Definição de um objeto de jogo específico da fase
export interface StageObject {
   svg: React.FC<SvgProps> // O componente SVG a ser renderizado
   points: number
   type: 'normal' | 'bomb' | 'golden'
}

// Definição da estrutura de uma fase
export interface StageConfig {
   level: number
   name: string
   scoreThreshold: number // Pontuação necessária para alcançar esta fase
   backgroundImage: ImageSourcePropType
   speedModifier: number // Multiplicador para a velocidade base dos objetos
   spawnRateModifier: number // Multiplicador para a taxa de surgimento (números maiores = mais rápido)
   objects: {
      common: StageObject[]
      golden: StageObject
      bomb: StageObject
   }
}

// Array com a configuração de todas as fases
export const STAGES: StageConfig[] = [
   {
      level: 1,
      name: 'Gastronomia',
      scoreThreshold: 0,
      // Crie a pasta assets/images e coloque suas imagens lá
      backgroundImage: require('@/assets/images/fase1.png'),
      speedModifier: 1.0,
      spawnRateModifier: 1.0,
      objects: {
         common: [
            { svg: CakeSvg, points: 20, type: 'normal' },
            { svg: MeathSvg, points: 15, type: 'normal' },
            { svg: PastaSvg, points: 10, type: 'normal' },
            { svg: EggSvg, points: 10, type: 'normal' },
            { svg: BreadSvg, points: 5, type: 'normal' },
         ],
         golden: { svg: HamburgerSvg, points: 100, type: 'golden' }, // Substitua por GoldenAppleSvg
         bomb: { svg: RottenFoodSvg, points: -50, type: 'bomb' }, // Substitua por BombSvg
      },
   },
   {
      level: 2,
      name: 'Administração',
      scoreThreshold: 500,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.2,
      spawnRateModifier: 1.3,
      objects: {
         common: [
            { svg: PlaceholderSvg, points: 20, type: 'normal' }, // Substitua por KiwiSvg
            { svg: PlaceholderSvg, points: 25, type: 'normal' }, // Substitua por PineappleSvg
         ],
         golden: { svg: PlaceholderSvg, points: 150, type: 'golden' }, // Substitua por GoldenBananaSvg
         bomb: { svg: PlaceholderSvg, points: -75, type: 'bomb' }, // Substitua por CoconutBombSvg 
      },
   },
   // --- Adicione as fases 3, 4 e 5 aqui, seguindo o mesmo padrão ---
   // Exemplo Fase 3:
   {
      level: 3,
      name: 'Enfermagem',
      scoreThreshold: 1200,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.5,
      spawnRateModifier: 1.6,
      objects: {
         common: [
            { svg: PlaceholderSvg, points: 30, type: 'normal' }, // Substitua por StrawberrySvg
            { svg: PlaceholderSvg, points: 35, type: 'normal' }, // Substitua por GrapesSvg
         ],
         golden: { svg: PlaceholderSvg, points: 200, type: 'golden' }, // Substitua por GoldenGrapesSvg
         bomb: { svg: PlaceholderSvg, points: -100, type: 'bomb' }, // Substitua por PepperBombSvg
      },
   },
      {
      level: 4,
      name: 'ADS',
      scoreThreshold: 1200,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.5,
      spawnRateModifier: 1.6,
      objects: {
         common: [
            { svg: PlaceholderSvg, points: 30, type: 'normal' }, // Substitua por StrawberrySvg
            { svg: PlaceholderSvg, points: 35, type: 'normal' }, // Substitua por GrapesSvg
         ],
         golden: { svg: PlaceholderSvg, points: 200, type: 'golden' }, // Substitua por GoldenGrapesSvg
         bomb: { svg: PlaceholderSvg, points: -100, type: 'bomb' }, // Substitua por PepperBombSvg
      },
   },
      {
      level: 5,
      name: 'Senac Hub Tech',
      scoreThreshold: 1200,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.5,
      spawnRateModifier: 1.6,
      objects: {
         common: [
            { svg: PlaceholderSvg, points: 30, type: 'normal' }, // Substitua por StrawberrySvg
            { svg: PlaceholderSvg, points: 35, type: 'normal' }, // Substitua por GrapesSvg
         ],
         golden: { svg: PlaceholderSvg, points: 200, type: 'golden' }, // Substitua por GoldenGrapesSvg
         bomb: { svg: PlaceholderSvg, points: -100, type: 'bomb' }, // Substitua por PepperBombSvg
      },
   },
  // ... e assim por diante
]