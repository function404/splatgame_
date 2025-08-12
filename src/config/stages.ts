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
   
// stage 3
import NeedleSvg from '@/assets/images/fase3svgs/agulha.svg'
import BloodBagSvg from '@/assets/images/fase3svgs/bolsa-sangue.svg'
import RedCrossSvg from '@/assets/images/fase3svgs/cruz-vermelha.svg'
import SkeletonSvg from '@/assets/images/fase3svgs/esqueleto.svg'
import HospitalSvg from '@/assets/images/fase3svgs/hospital.svg'
import RemedySvg from '@/assets/images/fase3svgs/remedio.svg'
import VirusSvg from '@/assets/images/fase3svgs/virus.svg'

// stage 4
import CSvg from '@/assets/images/fase4svgs/c.svg'
import CssSvg from '@/assets/images/fase4svgs/css.svg'
import HtmlSvg from '@/assets/images/fase4svgs/html.svg'
import JavaSvg from '@/assets/images/fase4svgs/java.svg'
import ReactSvg from '@/assets/images/fase4svgs/react.svg'
import RubySvg from '@/assets/images/fase4svgs/ruby.svg'
import BugSvg from '@/assets/images/fase4svgs/bug.svg'

// stage 5
import BrainSvg from '@/assets/images/fase5svgs/cerebro.svg'
import ChipSvg from '@/assets/images/fase5svgs/chip.svg'
import HackerSvg from '@/assets/images/fase5svgs/hacker.svg'
import HologramSvg from '@/assets/images/fase5svgs/holograma.svg'
import MicrophoneSvg from '@/assets/images/fase5svgs/microfone.svg'
import BuildingSvg from '@/assets/images/fase5svgs/predio.svg'
import RobotSvg from '@/assets/images/fase5svgs/robo.svg'

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
      spawnRateModifier: 1.11,
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
      backgroundImage: require('@/assets/images/fase3.png'),
      backgroundStageImage:require('@/assets/images/fase3-menu.png'),
      speedModifier: 1.25,
      spawnRateModifier: 1.13,
      objects: {
         normal: [
            { svg: NeedleSvg, points: 30, type: 'normal' },
            { svg: SkeletonSvg, points: 25, type: 'normal' },
            { svg: HospitalSvg, points: 20, type: 'normal' },
            { svg: RedCrossSvg, points: 20, type: 'normal' },
            { svg: BloodBagSvg, points: 15, type: 'normal' },
         ],
         golden: { svg: RemedySvg, points: 120, type: 'golden' },
         bomb: { svg: VirusSvg, points: -75, type: 'bomb' },
      },
   },
   {
      level: 4,
      name: 'Análise e Des. de Sistemas',
      scoreThreshold: 3500,
      backgroundImage: require('@/assets/images/fase4.png'),
      backgroundStageImage:require('@/assets/images/fase4-menu.png'),
      speedModifier: 1.35,
      spawnRateModifier: 1.14,
      objects: {
         normal: [
            { svg: CSvg, points: 35, type: 'normal' },
            { svg: CssSvg, points: 30, type: 'normal' },
            { svg: HtmlSvg, points: 25, type: 'normal' },
            { svg: JavaSvg, points: 25, type: 'normal' },
            { svg: RubySvg, points: 20, type: 'normal' },
         ],
         golden: { svg: ReactSvg, points: 15, type: 'golden' },
         bomb: { svg: BugSvg, points: -90, type: 'bomb' },
      },
   },
   {
      level: 5,
      name: 'Senac Hub Tech',
      scoreThreshold: 5500,
      completionScore: 8000,
      backgroundImage: require('@/assets/images/fase5.png'),
      backgroundStageImage:require('@/assets/images/fase5-menu.png'),
      speedModifier: 1.45,
      spawnRateModifier: 1.15,
      objects: {
         normal: [
            { svg: HologramSvg, points: 45, type: 'normal' },
            { svg: ChipSvg, points: 40, type: 'normal' },
            { svg: MicrophoneSvg, points: 35, type: 'normal' },
            { svg: BrainSvg, points: 35, type: 'normal' },
            { svg: BuildingSvg, points: 30, type: 'normal' },
         ],
         golden: { svg: RobotSvg, points: 200, type: 'golden' },
         bomb: { svg: HackerSvg, points: -100, type: 'bomb' },
      },
   },
]