import React, { useState, useEffect, useRef } from 'react'
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   ImageBackground,
   TouchableOpacity,
   SafeAreaView,
   Dimensions,
   Animated,
} from 'react-native'
import { ChevronLeft, ChevronRight, Lock, Play, Undo2 } from 'lucide-react-native'

import { STAGES, StageConfig } from '@/src/config/stages'
import { ColorsTheme } from '@/src/theme/colors'

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
   const playButtonAnim = useRef(new Animated.Value(1)).current

   useEffect(() => {
      if (newlyUnlockedStage !== null) {
         const newIndex = STAGES.findIndex(s => s.level === newlyUnlockedStage)
         if (newIndex !== -1) {
            setTimeout(() => {
               flatListRef.current?.scrollToIndex({ animated: true, index: newIndex })
               
               Animated.sequence([
                  Animated.timing(playButtonAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
                  Animated.timing(playButtonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                  Animated.timing(playButtonAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
                  Animated.timing(playButtonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
               ]).start()
            }, 500)
         }
      }
   }, [newlyUnlockedStage])

   const handlePrevStage = () => {
      if (currentIndex > 0) {
         flatListRef.current?.scrollToIndex({ animated: true, index: currentIndex - 1 })
      }
   }

   const handleNextStage = () => {
      if (currentIndex < STAGES.length - 1) {
         flatListRef.current?.scrollToIndex({ animated: true, index: currentIndex + 1 })
      }
   }

   const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
         setCurrentIndex(viewableItems[0].index)
      }
   }).current

   const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

   const renderCarouselItem = ({ item }: { item: StageConfig }) => {
      const isUnlocked = unlockedStages.includes(item.level)

      return (
         <ImageBackground
            source={item.backgroundStageImage}
            style={styles.carouselItem}
            resizeMode="cover"
         >
            <View style={styles.carouselOverlay}>
               {!isUnlocked && (
                  <View style={styles.lockedInfo}>
                     <Lock color={ColorsTheme.white} size={60} />
                     <Text style={styles.lockedText}>Requer {item.scoreThreshold} pontos</Text>
                  </View>
               )}
            </View>
         </ImageBackground>
      )
   }

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
         />

         <SafeAreaView style={styles.controlsOverlay}>
            <TouchableOpacity onPress={onGoBack} style={styles.buttonGoBack}>
               <Undo2 size={24} color={ColorsTheme.white} />
            </TouchableOpacity>

            <View style={styles.bottomControls}>
               <TouchableOpacity
                  onPress={handlePrevStage}
                  disabled={currentIndex === 0}
                  style={[styles.buttonSide, currentIndex === 0 && styles.navButtonDisabled]}
               >
                  <ChevronLeft size={24} color={ColorsTheme.white} />
               </TouchableOpacity>

               <Animated.View style={{ transform: [{ scale: playButtonAnim }] }}>
                  <TouchableOpacity
                     style={[styles.buttonCenter, !isCurrentUnlocked && styles.playButtonDisabled]}
                     disabled={!isCurrentUnlocked}
                     onPress={() => onStartGame(currentSelection.level)}
                  >
                     <Play size={42} color={isCurrentUnlocked ? ColorsTheme.white : ColorsTheme.grey300} />
                     <Text style={styles.playButtonText}>
                        {isCurrentUnlocked ? 'Jogar' : 'Bloqueado'}
                     </Text>
                  </TouchableOpacity>
               </Animated.View>

               <TouchableOpacity
                  onPress={handleNextStage}
                  disabled={currentIndex === STAGES.length - 1}
                  style={[styles.buttonSide, currentIndex === STAGES.length - 1 && styles.navButtonDisabled]}
               >
                  <ChevronRight size={24} color={ColorsTheme.white} />
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'black',
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
      fontSize: 18,
      color: ColorsTheme.white,
      fontWeight: '600',
      marginTop: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
   },
   controlsOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 10,
      pointerEvents: 'box-none',
   },
   bottomControls: {
      position: 'absolute',
      bottom: 25,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 40,
      alignSelf: 'center',
      pointerEvents: 'auto',
   },
   buttonGoBack: {
      width: 60,
      height: 60,
      borderRadius: 15,
      backgroundColor: ColorsTheme.blue200,
      position: 'absolute',
      top: 5,
      left: 5,
      alignItems: 'center',
      justifyContent: 'center'
   },
   buttonSide: {
      width: 70,
      height: 70,
      borderRadius: 25,
      backgroundColor: ColorsTheme.blue200,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: ColorsTheme.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 8,
      pointerEvents: 'auto',
   },
   buttonCenter: {
      width: 110,
      height: 110,
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
      fontSize: 16,
      fontFamily: 'PixelifySans-Medium',
   },
   navButtonDisabled: {
      opacity: 0.4,
   },
   playButtonDisabled: {
      backgroundColor: ColorsTheme.grey200,
   },
})
