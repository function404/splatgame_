import { Dimensions } from 'react-native'

/**
 * Scaling
*/
const { width, height } = Dimensions.get('window')

/**
 * Base do tamnho se o dispositivo é um celular
*/
const baseWidth = 375
const baseHeight = 812

/**
 * Base se o dispositivo é um tablet
*/
const isTablet = width >= 768 && height >= 1024

/**
 * Horizontal and Vertical Scaling
 * Funções de escala ajustadas para celulares e tablets
*/
const horizontalScale = (size: number) => {
    return isTablet ? size * 1.6 : (width / baseWidth) * size
}
  
const verticalScale = (size: number) => {
    return isTablet ? size * 1.6 : (height / baseHeight) * size
}

/**
 * Button Scale
*/
const BUTTON_SCALE = 0.7

/**
 * Export
*/
export { width, height, isTablet, horizontalScale, verticalScale, BUTTON_SCALE }
