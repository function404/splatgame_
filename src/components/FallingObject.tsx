import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { GameObject } from '@/src/types/game'
import { ColorsTheme } from '@/src/theme/colors'

interface FallingObjectProps {
  object: GameObject
  onTap: (id: string) => void
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const FallingObject: React.FC<FallingObjectProps> = ({ object, onTap }) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = () => {
    scale.value = withSpring(0.8, { duration: 100 }, () => {
      scale.value = withSpring(1)
    })
    onTap(object.id)
  }

  const SvgComponent = object.svg

  if (!SvgComponent || typeof SvgComponent === 'number') {
    return null; 
  }

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        {
          left: object.x,
          top: object.y,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
    
      <SvgComponent width={50} height={50} />

      {(object.type === 'normal' || object.type === 'golden') ? (
        <Text style={styles.morePoints}>+{object.points}</Text>
      ) : (
        <Text style={styles.fewerPoints}>{object.points}</Text>
      )}
    </AnimatedTouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePoints: {
    position: 'absolute',
    top: 0,
    right: -20,
    fontSize: 14,
    fontWeight: 'bold',
    color: ColorsTheme.green300,
  },
  fewerPoints: {
    position: 'absolute',
    top: 0,
    right: -20,
    fontSize: 14,
    fontWeight: 'bold',
    color: ColorsTheme.red,
  },
})