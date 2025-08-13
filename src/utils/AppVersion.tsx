import { Text, StyleSheet } from 'react-native'
import Constants from 'expo-constants'
import { ColorsTheme } from '@/src/theme/colors'

interface IAppVersionProps {
   isWhite?: boolean
}

export const AppVersion = ({ isWhite }: IAppVersionProps) => {
   const appVersion = Constants.expoConfig?.version

   return (
      <Text 
         style={[
            styles.versionText, 
            isWhite && { 
               color: ColorsTheme.white,
               textShadowColor: 'rgba(0, 0, 0, 0.75)',
               textAlign: 'center',
            }
         ]}
      >
         v{appVersion}
      </Text>
   )
}

const styles = StyleSheet.create({
   versionText: {
      fontSize: 16,
      color: ColorsTheme.blue500,
      textAlign: 'right',
      marginTop: 10,
      marginRight: 2,
      fontFamily: 'PixelifySans-Medium',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 3
   },
})