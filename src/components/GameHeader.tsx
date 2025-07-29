import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';

interface GameHeaderProps {
  score: number;
  level: number;
  lives: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ score, level, lives }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.scoreText}>Pontuação: {score}</Text>
        <Text style={styles.levelText}>Nível {level}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.livesLabel}>Vidas:</Text>
        <View style={styles.heartsContainer}>
          {Array.from({ length: 3 }, (_, index) => (
            <Heart
              key={index}
              size={20}
              color={index < lives ? '#EF4444' : '#D1D5DB'}
              fill={index < lives ? '#EF4444' : 'transparent'}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftSection: {
    alignItems: 'flex-start',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  levelText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  livesLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});