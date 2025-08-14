import React from 'react'
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity } from 'react-native'
import { Heart, Pause } from 'lucide-react-native'
import { ColorsTheme } from '@/src/theme/colors'

interface GameHeaderProps {
  score: number
  level: number
  lives: number
  onPause: () => void
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  level, 
  lives,
  onPause,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('@/assets/images/nuvem-header.png')}
        style={styles.container}
        resizeMode='repeat' 
      >
        <View style={styles.contentContainer}>
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

          <TouchableOpacity onPress={onPause} style={styles.pauseButton}>
            <Pause size={28} color={ColorsTheme.white} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const textShadow = {
  textShadowColor: ColorsTheme.black,
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 3
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0, 
    backgroundColor: 'transparent'
  },
  container: {
    width: '100%',
    height: 110,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: -10,
  },
  leftSection: {
    marginTop: -25,
    alignItems: 'flex-start',
  },
  rightSection: {
    marginTop: -25,
    alignItems: 'center',
  },
  pauseButton: {
    marginTop: -25,
    padding: 10,
    backgroundColor: ColorsTheme.orange60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ColorsTheme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.white,
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
    marginTop: 4,
  },
})