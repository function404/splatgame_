import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   ImageBackground,
   TouchableOpacity,
   SafeAreaView,
   Dimensions,
} from 'react-native'
import { ChevronLeft, ChevronRight, Lock, Play, Undo2 } from 'lucide-react-native'
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated'

import { References } from '@/src/components/References'
import { STAGES, StageConfig } from '@/src/config/stages'
import { ColorsTheme } from '@/src/theme/colors'
import { horizontalScale, isTablet, verticalScale } from '@/src/theme/scaling'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface StageSelectorProps {
   unlockedStages: number[]
   newlyUnlockedStage: number | null
   onStartGame: (level: number) => void
   onGoBack: () => void
}

export const StageSelector: React.FC<StageSelectorProps> = ({
   unlockedStages,
   newlyUnlockedStage,
   onStartGame,
   onGoBack,
}) => {
   const [currentIndex, setCurrentIndex] = useState(0)
   const flatListRef = useRef<FlatList>(null)
   const playButtonScale = useSharedValue(1)

   useEffect(() => {
      if (newlyUnlockedStage !== null) {
         const newIndex = STAGES.findIndex(s => s.level === newlyUnlockedStage)
         if (newIndex !== -1) {
            setTimeout(() => {
               flatListRef.current?.scrollToIndex({ 
                  animated: true, index: newIndex 
               })
               playButtonScale.value = withSequence(
                  withTiming(1.2, { duration: 300 }),
                  withTiming(1, { duration: 400 }),
                  withTiming(1.2, { duration: 300 }),
                  withTiming(1, { duration: 400 }),
               )
            }, 150)
         }
      }
   }, [newlyUnlockedStage, playButtonScale])

   const animatedPlayButtonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: playButtonScale.value }],
   }))

   const handleScrollToIndex = (index: number) => {
      if (flatListRef.current && index >= 0 && index < STAGES.length) {
         flatListRef.current.scrollToIndex({ animated: true, index });
      }
   }

   const handlePrevStage = () => handleScrollToIndex(currentIndex - 1)
   const handleNextStage = () => handleScrollToIndex(currentIndex + 1)

   const onViewableItemsChanged = useRef(({ viewableItems }: { 
      viewableItems: Array<{ index: number | null }> 
   }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
         setCurrentIndex(viewableItems[0].index)
      }
   }).current

   const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

   const renderCarouselItem = useCallback(({ item }: { item: StageConfig }) => {
      const isUnlocked = unlockedStages.includes(item.level)

      return (
         <ImageBackground
            source={item.backgroundStageImage}
            style={styles.carouselItem}
            resizeMode="stretch"
         >
            <View style={styles.carouselOverlay}>
               {!isUnlocked && (
                  <View style={styles.lockedInfo}>
                     <Lock color={ColorsTheme.white} size={60} />
                     <Text style={styles.lockedText}>
                        Requer {item.scoreThreshold} pontos
                     </Text>
                  </View>
               )}
            </View>
         </ImageBackground>
      )
   }, [unlockedStages])
  
   const getItemLayout = (_data: any, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
   })

   const currentSelection = STAGES[currentIndex]
   const isCurrentUnlocked = unlockedStages.includes(currentSelection.level)

   return (
      <View style={styles.container}>
         <FlatList
            ref={flatListRef}
            data={STAGES}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.level.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={getItemLayout}
            initialNumToRender={1}
            windowSize={3}
         />

         <SafeAreaView style={styles.controlsOverlay}>
            <TouchableOpacity onPress={onGoBack} style={styles.buttonGoBack}>
               <Undo2 size={24} color={ColorsTheme.white} />
            </TouchableOpacity>

            <View style={styles.footer}>
               <View style={styles.bottomControls}>
                  <TouchableOpacity
                     onPress={handlePrevStage}
                     disabled={currentIndex === 0}
                     style={[
                        styles.buttonSide, 
                        currentIndex === 0 && styles.navButtonDisabled
                     ]}
                  >
                     <ChevronLeft size={24} color={ColorsTheme.white} />
                  </TouchableOpacity>

                  <Animated.View style={animatedPlayButtonStyle}>
                     <TouchableOpacity
                        style={[
                           styles.buttonCenter, 
                           !isCurrentUnlocked && styles.playButtonDisabled
                        ]}
                        disabled={!isCurrentUnlocked}
                        onPress={() => onStartGame(currentSelection.level)}
                     >
                        <Play 
                           size={42} 
                           color={
                              isCurrentUnlocked ? 
                              ColorsTheme.white : 
                              ColorsTheme.grey300
                           } 
                        />
                        <Text 
                           style={[
                              styles.playButtonText, 
                              !isCurrentUnlocked && 
                              { color: ColorsTheme.grey300 }
                           ]}
                        >
                           {isCurrentUnlocked ? 'Jogar' : 'Bloqueado'}
                        </Text>
                     </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity
                     onPress={handleNextStage}
                     disabled={currentIndex === STAGES.length - 1}
                     style={[
                        styles.buttonSide, 
                        currentIndex === STAGES.length - 1 && 
                        styles.navButtonDisabled
                     ]}
                  >
                     <ChevronRight size={24} color={ColorsTheme.white} />
                  </TouchableOpacity>
               </View>

               <View style={styles.paginationContainer}>
                  {STAGES.map((stage, index) => {
                     const isUnlocked = unlockedStages.includes(stage.level)
                     const isActive = index === currentIndex

                     return (
                        <TouchableOpacity
                           key={stage.level}
                           onPress={() => handleScrollToIndex(index)}
                           style={[
                              styles.paginationDot,
                              isActive && styles.paginationDotActive,
                              !isUnlocked && styles.paginationDotLocked,
                           ]}
                        />
                     )
                  })}
               </View>
            </View>
            <References color={ColorsTheme.blue500} withSchool />
         </SafeAreaView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: ColorsTheme.green500,
   },
   carouselItem: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
   },
   carouselOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
   },
   lockedInfo: {      
      justifyContent: 'center',
      alignItems: 'center',
   },
   lockedText: {
      fontSize: isTablet ? 22 : 18,
      color: ColorsTheme.white,
      fontFamily: 'PixelifySans-Bold',
      marginTop: verticalScale(10),
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: horizontalScale(12),
      paddingVertical: verticalScale(6),
      borderRadius: 8,
   },
   controlsOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'space-between',
      paddingHorizontal: horizontalScale(20),
   },
   footer: {
      alignSelf: 'center',
      position: 'absolute',
      bottom: verticalScale(25),
      width: '100%',
   },
   paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: verticalScale(20),
   },
   paginationDot: {
      width: isTablet ? 16 : 12,
      height: isTablet ? 16 : 12,
      borderRadius: isTablet ? 8 : 6,
      backgroundColor: ColorsTheme.orange50,
      marginHorizontal: horizontalScale(8),
   },
   paginationDotActive: {
      backgroundColor: ColorsTheme.orange100,
      transform: [{ scale: 1.4 }],
   },
   paginationDotLocked: {
      backgroundColor: ColorsTheme.orange10,
   },
   bottomControls: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around', 
      alignItems: 'center',
      alignSelf: 'center',
   },
   buttonGoBack: {
      width: isTablet ? 72 : 60,
      height: isTablet ? 72 : 60,
      borderRadius: 15,
      backgroundColor: ColorsTheme.orange100,
      position: 'absolute',
      top: verticalScale(16),
      left: horizontalScale(16),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
   },
   buttonSide: {
      width: isTablet ? 80 : 70,
      height: isTablet ? 80 : 70,
      borderRadius: 25,
      backgroundColor: ColorsTheme.blue200,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: ColorsTheme.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 8,
   },
   buttonCenter: {
      width: isTablet ? 120 : 110,
      height: isTablet ? 120 : 110,
      borderRadius: 40,
      backgroundColor: ColorsTheme.orange100,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: ColorsTheme.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 10,
   },
   playButtonText: {
      textAlign: 'center',
      color: ColorsTheme.white,
      fontSize: isTablet ? 20 : 16,
      fontFamily: 'PixelifySans-Medium',
   },
   navButtonDisabled: {
      opacity: 0.5,
   },
   playButtonDisabled: {
      backgroundColor: ColorsTheme.grey200,
   },
})