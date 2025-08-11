import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, StatusBar, ImageBackground, ActivityIndicator, Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Trophy, Medal, Award, Undo2 } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { db } from '@/src/firebase/config'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

import { TNavigationProp } from '@/src/navigation/types'
import { User } from '@/src/types/game'
import { ColorsTheme } from '@/src/theme/colors'

type LeaderboardEntry = Pick<User, 'userId' | 'username' | 'highScore'>

export default function LeaderboardScreen() {
  const navigation = useNavigation<TNavigationProp>()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadLeaderboard = useCallback(async () => {
    try {
      const usersCollectionRef = collection(db, 'users')

      const q = query(usersCollectionRef, orderBy('highScore', 'desc'), limit(20))

      const querySnapshot = await getDocs(q)

      const topScores = querySnapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data(),
      })) as LeaderboardEntry[]

      setLeaderboard(topScores)

    } catch (error) {
      console.error('Erro ao carregar o placar:', error)
      Alert.alert("Erro", "Não foi possível carregar a classificação.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
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
          <Text style={styles.scoreText}>{item.highScore.toLocaleString()} pts</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange50 }}>
      <StatusBar backgroundColor={ColorsTheme.orange50} barStyle="dark-content" />
      
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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ColorsTheme.white} />
            <Text style={styles.loadingText}>Carregando pontuações...</Text>
          </View>
        ) : leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Trophy size={48} color={ColorsTheme.yellow100} />
            <Text style={styles.emptyTitle}>Sem pontuações ainda</Text>
            <Text style={styles.emptySubtitle}>Seja o primeiro a definir um recorde!</Text>
          </View>
        ) : (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={ColorsTheme.white}
              />
            }
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  )
}

const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: -1, height: 1 },
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
    top: 10,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue200,
    textAlign: 'center',
    ...textShadow
  },
  subtitle: {
    fontSize: 18,
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
    color: ColorsTheme.white,
    fontFamily: 'PixelifySans-Regular',
    marginTop: 10,
    ...textShadow
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 80,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorsTheme.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 5,
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
    borderRadius: 14,
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
})
