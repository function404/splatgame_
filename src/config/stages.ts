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

   // stage 2
   import HourglassSvg from '@/assets/images/fase2svgs/ampulheta.svg'
   import NegativeGraphSvg from '@/assets/images/fase2svgs/grafico-negativo.svg'
   import GraphSvg from '@/assets/images/fase2svgs/grafico.svg'
   import IdeaSvg from '@/assets/images/fase2svgs/ideia.svg'
   import BookSvg from '@/assets/images/fase2svgs/livro.svg'
   import SheetSvg from '@/assets/images/fase2svgs/planilha.svg'
   import ClipboardSvg from '@/assets/images/fase2svgs/prancheta.svg'
   
   export interface StageObject {
      svg: React.FC<SvgProps>
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
         golden: { svg: HamburgerSvg, points: 80, type: 'golden' },
         bomb: { svg: RottenFoodSvg, points: -50, type: 'bomb' },
      },
   },
   {
      level: 2,
      name: 'Administração',
      scoreThreshold: 800,
      backgroundImage: require('@/assets/images/fase2.png'),
      backgroundStageImage: require('@/assets/images/fase2-menu.png'),
      speedModifier: 1.15,
      spawnRateModifier: 1.2,
      objects: {
         normal: [
            { svg: HourglassSvg, points: 25, type: 'normal' },
            { svg: SheetSvg, points: 20, type: 'normal' },
            { svg: GraphSvg, points: 15, type: 'normal' },
            { svg: ClipboardSvg, points: 15, type: 'normal' },
            { svg: BookSvg, points: 10, type: 'normal' },
         ],
         golden: { svg: IdeaSvg, points: 100, type: 'golden' },
         bomb: { svg: NegativeGraphSvg, points: -60, type: 'bomb' }, 
      },
   },
   {
      level: 3,
      name: 'Enfermagem',
      scoreThreshold: 2000,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      backgroundStageImage:require('@/assets/images/fase1-menu.png'), // 3
      speedModifier: 1.25,
      spawnRateModifier: 1.3,
      objects: {
         normal: [
            { svg: HamburgerSvg, points: 35, type: 'normal' },
            { svg: HamburgerSvg, points: 30, type: 'normal' },
         ],
         golden: { svg: HamburgerSvg, points: 120, type: 'golden' },
         bomb: { svg: RottenFoodSvg, points: -75, type: 'bomb' },
      },
   },
   {
      level: 4,
      name: 'Análise e Des. de Sistemas',
      scoreThreshold: 3500,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      backgroundStageImage:require('@/assets/images/fase2-menu.png'), // 4
      speedModifier: 1.35,
      spawnRateModifier: 1.4,
      objects: {
         normal: [
            { svg: HamburgerSvg, points: 40, type: 'normal' },
            { svg: HamburgerSvg, points: 35, type: 'normal' },
         ],
         golden: { svg: HamburgerSvg, points: 150, type: 'golden' },
         bomb: { svg: RottenFoodSvg, points: -90, type: 'bomb' },
      },
   },
   {
      level: 5,
      name: 'Senac Hub Tech',
      scoreThreshold: 5500,
      completionScore: 8000,
      backgroundImage: require('@/assets/images/homeBackground.png'),
      backgroundStageImage:require('@/assets/images/fase1-menu.png'), //
      speedModifier: 1.45,
      spawnRateModifier: 1.5,
      objects: {
         normal: [
            { svg: HamburgerSvg, points: 50, type: 'normal' },
            { svg: HamburgerSvg, points: 45, type: 'normal' },
         ],
         golden: { svg: HamburgerSvg, points: 200, type: 'golden' },
         bomb: { svg: RottenFoodSvg, points: -100, type: 'bomb' },
      },
   },
]