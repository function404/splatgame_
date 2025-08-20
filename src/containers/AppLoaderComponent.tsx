import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Font from 'expo-font'
import { Asset } from 'expo-asset'

import { IAppLoaderProps } from '@/src/containers/AppLoaderComponent.types'

import { ColorsTheme } from '@/src/theme/colors'
import { horizontalScale, isTablet, verticalScale } from '@/src/theme/scaling'

type LoadingStage = 'companySplash' | 'assetLoading' | 'ready'

export const AppLoader: React.FC<IAppLoaderProps> = ({ children }) => {
   const [loadingStage, setLoadingStage] = useState<LoadingStage>('companySplash')
   const [rawProgress, setRawProgress] = useState(0)

   const fadeAnim = useRef(new Animated.Value(0)).current
   const scaleAnim = useRef(new Animated.Value(0.5)).current

   const progressAnim = useRef(new Animated.Value(0)).current

   const companyLogo = require('@/assets/images/gl-logotipo-png.png')
   const allAssets = [
      require('@/assets/images/fase1-menu.png'),
      require('@/assets/images/fase1.png'),
      require('@/assets/images/fase2-menu.png'),
      require('@/assets/images/fase2.png'),
      require('@/assets/images/fase3-menu.png'),
      require('@/assets/images/fase3.png'),
      require('@/assets/images/fase4-menu.png'),
      require('@/assets/images/fase4.png'),
      require('@/assets/images/fase5-menu.png'),
      require('@/assets/images/fase5.png'),
      require('@/assets/images/homeBackground.png'),
      require('@/assets/images/iconSplatgame.png'),
      require('@/assets/images/nuvem-header.png'),
      companyLogo,
   ]

   const totalAssets = allAssets.length + 1

   const updateProgress = (current: number) => {
      const newProgress = current / totalAssets
      setRawProgress(newProgress)
   
      Animated.timing(progressAnim, {
         toValue: newProgress,
         duration: 300,
         useNativeDriver: false,
      }).start(() => {
         if (newProgress >= 1) {
            setTimeout(() => {
               setLoadingStage('ready')
            }, 200)
         }
      })
   }
  
   const loadAssets = useCallback(async () => {
      try {
         let current = 0
   
         await Font.loadAsync({
            'PixelifySans-Bold': require('@/assets/fonts/PixelifySans-Bold.ttf'),
            'PixelifySans-Medium': require('@/assets/fonts/PixelifySans-Medium.ttf'),
            'PixelifySans-Regular': require('@/assets/fonts/PixelifySans-Regular.ttf'),
            'PixelifySans-SemiBold': require('@/assets/fonts/PixelifySans-SemiBold.ttf'),
            'Tiny5-Regular': require('@/assets/fonts/Tiny5-Regular.ttf'),
         })
         current++
         updateProgress(current)
   
         for (const asset of allAssets) {
            await Asset.loadAsync(asset)
            current++
            updateProgress(current)
         }

      } catch (error) {
         console.warn('Erro ao carregar os assets:', error)
      }
   }, [])

   useEffect(() => {
      if (loadingStage === 'companySplash') {
         Animated.parallel([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 2000,
               useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
               toValue: 1,
               duration: 2000,
               useNativeDriver: true,
            })
         ]).start()

         const timer = setTimeout(() => {
            setLoadingStage('assetLoading')
         }, 3000)

         return () => clearTimeout(timer)
      }
   }, [loadingStage])

   useEffect(() => {
      if (loadingStage === 'assetLoading') {
         loadAssets()
      }
   }, [loadingStage, loadAssets])


   const interpolatedWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
   })

   if (loadingStage === 'companySplash') {
      return (
         <View style={styles.splashContainer}>
            <StatusBar backgroundColor={ColorsTheme.black} barStyle="light-content" />
            
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
               <Image source={companyLogo} style={styles.logo} resizeMode="contain" />
            </Animated.View>
         </View>
      )
   }

   if (loadingStage === 'assetLoading') {
      return (
         <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange50 }}>
            <ImageBackground 
               source={require('@/assets/images/homeBackground.png')}
               style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
               resizeMode='cover'
            >
               <StatusBar backgroundColor={ColorsTheme.orange100} barStyle='dark-content' />
               
               <View style={styles.container}>
                  <View style={styles.content}>
                     <Text style={styles.textLoading}>
                        {Math.round(rawProgress * 100)}%
                     </Text>

                     <Animated.View
                        style={{
                           width: interpolatedWidth,
                           height: '100%',
                           backgroundColor: ColorsTheme.blue300,
                           position: 'absolute',
                           left: 0,
                           top: 0,
                           zIndex: 1,
                        }}
                     />
                  </View>
               </View>
            </ImageBackground>
         </SafeAreaView>
      )
   }

   return <>{children}</>
}

const styles = StyleSheet.create({
   splashContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ColorsTheme.black,
   },
   logoContainer: {
      width: '70%',
      alignItems: 'center',
      justifyContent: 'center'
   },
   logo: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
   },
   container: {
      position: 'absolute',
      bottom: verticalScale(0),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
   },
   content: {
      width: '100%',
      height: 40,
      backgroundColor: ColorsTheme.blue200,
      borderTopWidth: 4,
      borderBottomWidth: 4,
      borderColor: ColorsTheme.orange50,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
   },
   textLoading: {
      fontSize: isTablet ? 28 : 24,
      color: ColorsTheme.white,
      fontWeight: '600',
      fontFamily: 'PixelifySans-Bold',
      textAlign: 'center',
      textShadowColor: ColorsTheme.black,
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 5,
      zIndex: 2,
      position: 'absolute',
   },
})
