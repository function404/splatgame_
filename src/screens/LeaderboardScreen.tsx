import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, StatusBar, ImageBackground } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Trophy, Medal, Award, Undo2 } from 'lucide-react-native'

import { TNavigationProp } from '@/src/navigation/types'

import { LocalStorageService } from '@/src/services/localStorage'

import { LeaderboardEntry } from '@/src/types/game'

import { ColorsTheme } from '@/src/theme/colors'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LeaderboardScreen() {
  const navigation = useNavigation<TNavigationProp>()
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
        return <Trophy size={28} color={ColorsTheme.yellow100} />
      case 2:
        return <Medal size={28} color={ColorsTheme.grey250} />
      case 3:
        return <Award size={28} color={ColorsTheme.brown100} />
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
      ColorsTheme.orange100

    return (
      <View style={[
        styles.leaderboardItem, 
        { 
          borderLeftWidth: rank <= 3 ? 5 : 2, 
          borderLeftColor: borderColor,
          borderBottomWidth: rank <= 3 ? 5 : 2,
          borderBottomColor: borderColor
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Classificação</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando pontuações...</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange100 }}>
      <StatusBar backgroundColor={ColorsTheme.orange100} barStyle="light-content" />
      <ImageBackground 
        source={require('@/assets/images/homeBackground.png')}
        style={styles.container}
        resizeMode='cover'
      >
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
            <Trophy size={48} color={ColorsTheme.yellow100} />
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
      </ImageBackground> 
    </SafeAreaView>
  )
}

const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 3
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: -25,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue200,
    textAlign: 'center',
    ...textShadow
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.orange100,
    textAlign: 'center',
    marginTop: 4,
    ...textShadow
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    fontFamily: 'PixelifySans-Regular',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 150,
  },
  emptyTitle: {
    fontSize: 28,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.white,
    marginTop: 16,
    ...textShadow
  },
  emptySubtitle: {
    fontSize: 24,
    fontFamily: 'PixelifySans-Regular',
    color: ColorsTheme.white,
    textAlign: 'center',
    marginTop: 8,
    ...textShadow
  },
  listContainer: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorsTheme.white,
    padding: 16,
    marginBottom: 12,
    // borderWidth: 2,
    // borderColor: ColorsTheme.orange100,
    // borderBottomWidth: 5,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    width: 28,
    height: 28,
    backgroundColor: ColorsTheme.blue100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ColorsTheme.blue200,
  },
  rankNumberText: {
    fontSize: 14,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue500,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue500,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'PixelifySans-Regular',
    color: ColorsTheme.blue200,
    marginTop: 2,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'PixelifySans-Regular',
    color: ColorsTheme.blue400,
  },
})
