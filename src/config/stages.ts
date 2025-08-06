import { ImageSourcePropType } from 'react-native'
import { SvgProps } from 'react-native-svg'

// stage 1
import CakeSvg from '@/assets/images/fase1svgs/bolo.svg'
import MeathSvg from '@/assets/images/fase1svgs/carne.svg'
import RottenFoodSvg from '@/assets/images/fase1svgs/comida-podre.svg'
import HamburgerSvg from '@/assets/images/fase1svgs/hamburguer.svg'
import PastaSvg from '@/assets/images/fase1svgs/macarrao.svg'
import EggSvg from '@/assets/images/fase1svgs/ovo-frito.svg'
import BreadSvg from '@/assets/images/fase1svgs/pao.svg'

const PlaceholderSvg: React.FC<SvgProps> = () => null 

export interface StageObject {
   svg: React.FC<SvgProps>
   points: number
   type: 'normal' | 'bomb' | 'golden'
}

export interface StageConfig {
   level: number
   name: string
   scoreThreshold: number
   backgroundImage: ImageSourcePropType
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
      speedModifier: 1.0,
      spawnRateModifier: 1.0,
      objects: {
         normal: [
            { svg: CakeSvg, points: 20, type: 'normal' },
            { svg: MeathSvg, points: 15, type: 'normal' },
            { svg: PastaSvg, points: 10, type: 'normal' },
            { svg: EggSvg, points: 10, type: 'normal' },
            { svg: BreadSvg, points: 5, type: 'normal' },
         ],
         golden: { svg: HamburgerSvg, points: 100, type: 'golden' },
         bomb: { svg: RottenFoodSvg, points: -50, type: 'bomb' },
      },
   },
   {
      level: 2,
      name: 'Administração',
      scoreThreshold: 500,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.2,
      spawnRateModifier: 1.2,
      objects: {
         normal: [
            { svg: PlaceholderSvg, points: 20, type: 'normal' },
            { svg: PlaceholderSvg, points: 25, type: 'normal' },
         ],
         golden: { svg: PlaceholderSvg, points: 150, type: 'golden' },
         bomb: { svg: PlaceholderSvg, points: -75, type: 'bomb' }, 
      },
   },
   {
      level: 3,
      name: 'Enfermagem',
      scoreThreshold: 1200,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.3,
      spawnRateModifier: 1.3,
      objects: {
         normal: [
            { svg: PlaceholderSvg, points: 30, type: 'normal' },
            { svg: PlaceholderSvg, points: 35, type: 'normal' },
         ],
         golden: { svg: PlaceholderSvg, points: 200, type: 'golden' },
         bomb: { svg: PlaceholderSvg, points: -100, type: 'bomb' },
      },
   },
      {
      level: 4,
      name: 'Analise e Desenvolvimento de Sistemas',
      scoreThreshold: 1900,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.4,
      spawnRateModifier: 1.4,
      objects: {
         normal: [
            { svg: PlaceholderSvg, points: 30, type: 'normal' },
            { svg: PlaceholderSvg, points: 35, type: 'normal' },
         ],
         golden: { svg: PlaceholderSvg, points: 200, type: 'golden' },
         bomb: { svg: PlaceholderSvg, points: -100, type: 'bomb' },
      },
   },
      {
      level: 5,
      name: 'Senac Hub Tech',
      scoreThreshold: 2600,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      speedModifier: 1.6,
      spawnRateModifier: 1.6,
      objects: {
         normal: [
            { svg: PlaceholderSvg, points: 30, type: 'normal' },
            { svg: PlaceholderSvg, points: 35, type: 'normal' },
         ],
         golden: { svg: PlaceholderSvg, points: 200, type: 'golden' },
         bomb: { svg: PlaceholderSvg, points: -100, type: 'bomb' },
      },
   },
]