import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { ColorsTheme } from '@/src/theme/colors';

interface DangerLineProps {
  y: number;
  width: number;
}

export const DangerLine: React.FC<DangerLineProps> = ({ y, width }) => {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: '100%',
    height: 3,
    backgroundColor: ColorsTheme.red300,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ColorsTheme.red300,
    letterSpacing: 1,
  },
});