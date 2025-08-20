import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { horizontalScale, isTablet, verticalScale } from '@/src/theme/scaling'

interface IReferencesProps {
   color?: string
   withSchool?: boolean
}

export const References: React.FC<IReferencesProps> = ({ 
   color,
   withSchool
}) => {
   return (
      <>
         {withSchool ? (
            <Text style={[styles.containerText, { color }]}>
               Lincoln | Gustavo | Felipe G. | Felipe V. | ADS 2024 - 2026 | SENAC Joinville
            </Text>
         ) : (
            <Text style={[styles.containerText, { color }]}>
               Lincoln | Gustavo | Felipe G. | Felipe V. | ADS 2024 - 2026
            </Text>
         )}
      </>
   )
}

const styles = StyleSheet.create({
   containerText: {
      position: 'absolute',
      bottom: verticalScale(6),
      left: horizontalScale(0),
      right: horizontalScale(0),
      fontSize: isTablet ? 14 : 10,
      fontFamily: 'PixelifySans-Regular',
      textAlign: 'center',
   }
})