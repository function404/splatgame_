import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { GameObject } from '@/src/types/game'
import { ColorsTheme } from '@/src/theme/colors'

interface FallingObjectProps {
  object: GameObject
  onTap: (id: string) => void
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const FallingObject: React.FC<FallingObjectProps> = ({ 
  object, 
  onTap 
}) => {
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

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        {
          left: object.x,
          top: object.y,
          backgroundColor: 
            object.type === 'bomb' ? ColorsTheme.red100 : ColorsTheme.green100
        },
        animatedStyle
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{object.emoji}</Text>
      {(object.type === 'fruit' || object.type === 'golden') && (
        <Text style={styles.points}>+{object.points}</Text>
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
    borderWidth: 2,
    borderColor: ColorsTheme.grey200,
    shadowColor: ColorsTheme.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  points: {
    position: 'absolute',
    top: -7,
    right: -15,
    fontSize: 12,
    fontWeight: 'bold',
    color: ColorsTheme.green200,
  },
})