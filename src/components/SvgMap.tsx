import React from 'react'
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

const SvgComponents: { [key: string]: React.FC<SvgProps> } = {
  // Fase 1
  'bolo.svg': CakeSvg,
  'carne.svg': MeathSvg,
  'comida-podre.svg': RottenFoodSvg,
  'hamburguer.svg': HamburgerSvg,
  'macarrao.svg': PastaSvg,
  'ovo-frito.svg': EggSvg,
  'pao.svg': BreadSvg,
   // Fase 2
   'ampulheta.svg': HourglassSvg,
   'grafico-negativo.svg': NegativeGraphSvg,
   'grafico.svg': GraphSvg,
   'ideia.svg': IdeaSvg,
   'livro.svg': BookSvg,
   'planilha.svg': SheetSvg,
   'prancheta.svg': ClipboardSvg,
   // Fase 3
   'agulha.svg': NeedleSvg,
   'bolsa-sangue.svg': BloodBagSvg,
   'cruz-vermelha.svg': RedCrossSvg,
   'esqueleto.svg': SkeletonSvg,
   'hospital.svg': HospitalSvg,
   'remedio.svg': RemedySvg,
   'virus.svg': VirusSvg,
   // Fase 4
   'bug.svg': BugSvg,
   'c.svg': CSvg,
   'css.svg': CssSvg,
   'html.svg': HtmlSvg,
   'java.svg': JavaSvg,
   'react.svg': ReactSvg,
   'ruby.svg': RubySvg,
   // Fase 5
   'cerebro.svg': BrainSvg,
   'chip.svg': ChipSvg,
   'hacker.svg': HackerSvg,
   'holograma.svg': HologramSvg,
   'microfone.svg': MicrophoneSvg,
   'predio.svg': BuildingSvg,
   'robo.svg': RobotSvg,
}

interface SvgMapProps extends SvgProps {
  name: string
}

export const SvgMap: React.FC<SvgMapProps> = React.memo(({ name, ...props }) => {
  const SvgComponent = SvgComponents[name]
  return SvgComponent ? <SvgComponent {...props} /> : null
})