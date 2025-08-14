import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { GameObject } from '@/src/types/game'
import { ColorsTheme } from '@/src/theme/colors'
import { SvgMap } from '@/src/components/SvgMap'

interface FallingObjectProps {
  object: GameObject
  onTap: (id: string) => void
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const FallingObject: React.FC<FallingObjectProps> = ({ object, onTap }) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    position: 'absolute',
    left: object.x,
    top: object.y,
  }))

  const handlePress = () => {
    scale.value = withSpring(0.8, { damping: 2, stiffness: 200 }, () => {
      scale.value = withSpring(1)
    })
    onTap(object.id)
  }

  const pointTextStyle = object.points > 0 ? styles.morePoints : styles.fewerPoints

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <SvgMap name={object.svg} width={50} height={50} />

      <Text style={pointTextStyle}>
        {object.points > 0 ? `+${object.points}` : object.points}
      </Text>
    </AnimatedTouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    position: 'absolute',
    top: 0,
    right: -5,
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1,
  },
  morePoints: {
    position: 'absolute',
    top: 0,
    right: -5,
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1,
    color: ColorsTheme.green300,
  },
  fewerPoints: {
    position: 'absolute',
    top: 0,
    right: -5,
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1,
    color: ColorsTheme.red,
  },
})