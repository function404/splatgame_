import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated'

import { ColorsTheme } from '@/src/theme/colors'
import { isTablet, verticalScale } from '@/src/theme/scaling'

interface DangerLineProps {
  y: number
  width: number
}

export const DangerLine: React.FC<DangerLineProps> = ({ y, width }) => {
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 1000 }),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: y,
          width: width,
        },
        animatedStyle
      ]}
    >
      <View style={styles.line} />
      <Text style={styles.text}>ZONA DE PERIGO</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: '100%',
    height: verticalScale(3),
    backgroundColor: ColorsTheme.red,
    marginBottom: verticalScale(5),
  },
  text: {
    fontSize: isTablet ? 16 : 12,
    fontWeight: 'bold',
    color: ColorsTheme.red,
    letterSpacing: 1,
  },
})