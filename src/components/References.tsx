import React from 'react'
import { Text, StyleSheet } from 'react-native'

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
      bottom: 6,
      left: 0,
      right: 0,
      fontSize: 10,
      fontFamily: 'PixelifySans-Regular',
      textAlign: 'center',
   }
})