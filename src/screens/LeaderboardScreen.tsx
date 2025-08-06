import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Trophy, Medal, Award, Undo2 } from 'lucide-react-native'

import { RootStackNavigationProp } from '@/src/navigation/types'

import { LocalStorageService } from '@/src/services/localStorage'

import { LeaderboardEntry } from '@/src/types/game'

import { ColorsTheme } from '@/src/theme/colors'

export default function LeaderboardScreen() {
  const navigation = useNavigation<RootStackNavigationProp>()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadLeaderboard = async () => {
    try {
      const topScores = await LocalStorageService.getTopScores(20)
      setLeaderboard(topScores)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard()
    }, [loadLeaderboard])
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await loadLeaderboard()
    setRefreshing(false)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} color={ColorsTheme.yellow100} />
      case 2:
        return <Medal size={24} color={ColorsTheme.grey250} />
      case 3:
        return <Award size={24} color={ColorsTheme.brown100} />
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankNumberText}>{rank}</Text>
          </View>
        )
    }
  }

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 1
    const date = new Date(item.timestamp)
    
    const borderColor =
      rank === 1 ? ColorsTheme.yellow100 :
      rank === 2 ? ColorsTheme.grey250 :
      rank === 3 ? ColorsTheme.brown100 :
      'transparent'

    return (
      <View style={[
        styles.leaderboardItem, 
        { 
          borderLeftWidth: rank <= 3 ? 4 : 0, 
          borderLeftColor: borderColor 
        }
      ]}>
        <View style={styles.rankContainer}>
          {getRankIcon(rank)}
        </View>
        
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.username}</Text>
          <Text style={styles.scoreText}>{item.score.toLocaleString()} pts</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {!isNaN(date.getTime()) ? date.toLocaleDateString() : 'Data inválida'}
          </Text>
        </View>
      </View>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Classificação</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando pontuações...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.buttonGoBack}
      >
        <Undo2 size={24} color={ColorsTheme.white} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Classificação</Text>
        <Text style={styles.subtitle}>Melhores jogadores</Text>
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Trophy size={48} color={ColorsTheme.blue200} />
          <Text style={styles.emptyTitle}>Sem pontuações ainda</Text>
          <Text style={styles.emptySubtitle}>Seja o primeiro a definir um recorde!</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsTheme.blue100,
    paddingTop: 60,
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ColorsTheme.blue500,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: ColorsTheme.grey300,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorsTheme.blue500,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorsTheme.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: ColorsTheme.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ColorsTheme.grey300,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorsTheme.blue500,
  },
  scoreText: {
    fontSize: 14,
    color: ColorsTheme.blue200,
    fontWeight: '500',
    marginTop: 2,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: ColorsTheme.blue400,
  },
})