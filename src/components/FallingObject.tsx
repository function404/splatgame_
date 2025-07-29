import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GameObject } from '@/src/types/game';

interface FallingObjectProps {
  object: GameObject;
  onTap: (id: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const FallingObject: React.FC<FallingObjectProps> = ({ object, onTap }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    onTap(object.id);
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        {
          left: object.x,
          top: object.y,
          backgroundColor: object.type === 'bomb' ? '#FEE2E2' : '#F0FDF4'
        },
        animatedStyle
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{object.emoji}</Text>
      {object.type === 'fruit' && (
        <Text style={styles.points}>+{object.points}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
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
    bottom: -15,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
});