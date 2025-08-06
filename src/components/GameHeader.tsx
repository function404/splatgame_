import React from 'react'
import { View, Text, StyleSheet, ImageBackground, SafeAreaView } from 'react-native'
import { Heart } from 'lucide-react-native'
import { ColorsTheme } from '@/src/theme/colors'

interface GameHeaderProps {
  score: number
  level: number
  lives: number
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  level, 
  lives 
}) => {
  return (
    <ImageBackground 
      source={require('@/assets/images/nuvem-header.png')}
      style={styles.container}
      resizeMode='contain'
    >
      <View style={styles.leftSection}>
        <Text style={styles.scoreText}>Pontuação: {score}</Text>
        <Text style={styles.levelText}>Nível {level}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.livesLabel}>Vidas</Text>

        <View style={styles.heartsContainer}>
          {Array.from({ length: 3 }, (_, index) => (
            <Heart
              key={index}
              size={20}
              color={index < lives ? ColorsTheme.red300 : ColorsTheme.white}
              fill={index < lives ? ColorsTheme.red300 : 'transparent'}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  )
}

const textShadow = {
  textShadowColor: ColorsTheme.black,
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 3
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -10,
  },
  leftSection: {
    marginTop: -25,
    alignItems: 'flex-start',
  },
  rightSection: {
    marginTop: -25,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.white,
    ...textShadow
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: 'Tiny5-Regular',
    color: ColorsTheme.white,
    marginTop: -6,
    ...textShadow
  },
  levelText: {
    fontSize: 16,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.white,
    marginTop: 2,
    ...textShadow
  },
  livesLabel: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.white,
    ...textShadow
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
})