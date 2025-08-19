import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, StatusBar, ImageBackground, ActivityIndicator, Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Trophy, Medal, Award, Undo2, ChevronDown } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { db } from '@/src/firebase/config'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

import { TNavigationProp } from '@/src/navigation/types'
import { User } from '@/src/types/game'
import { horizontalScale, isTablet, verticalScale } from '@/src/theme/scaling'
import { ColorsTheme } from '@/src/theme/colors'
import { auth } from '@/src/firebase/config'

type LeaderboardEntry = Pick<User, 'userId' | 'username' | 'highScore'>

export default function LeaderboardScreen() {
  const navigation = useNavigation<TNavigationProp>()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadLeaderboard = useCallback(async () => {
    try {
      const usersCollectionRef = collection(db, 'users')
      const q = query(usersCollectionRef, orderBy('highScore', 'desc'), limit(50))
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

    const isCurrentUser = item.userId === auth.currentUser?.uid

    const borderColor =
      rank === 1 ? ColorsTheme.yellow100 :
      rank === 2 ? ColorsTheme.grey250 :
      rank === 3 ? ColorsTheme.brown100 :
      ColorsTheme.orange100

    return (
      <View style={[
        styles.leaderboardItem, 
          {
            borderLeftColor: borderColor,
            borderBottomColor: borderColor
          },
        ]}
      >
        <View style={styles.rankContainer}>{getRankIcon(rank)}</View>
        <View style={styles.playerInfo}>
          <View style={styles.playerNameContainer}>
            <Text style={styles.playerName} numberOfLines={1}>{item.username}</Text>
            {isCurrentUser && <Text style={styles.youTag}>(Você)</Text>}
          </View>
          <Text style={styles.scoreText}>{item.highScore.toLocaleString()} pts</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={ColorsTheme.orange50} barStyle="dark-content" />
      
      <ImageBackground
        source={require('@/assets/images/homeBackground.png')}
        style={styles.background}
        resizeMode='stretch'
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.buttonGoBack}
            >
              <Undo2 size={24} color={ColorsTheme.white} />
            </TouchableOpacity>

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
          <>
            <View style={styles.listWrapper}>
              <FlatList
                style={{ height: '100%' }}
                data={leaderboard}
                renderItem={renderLeaderboardItem}
                keyExtractor={(item) => item.userId}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={ColorsTheme.white}
                  />
                }
              />
            </View>
          </>
        )}
      </View>
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
  safeArea: {
    flex: 1,
    backgroundColor: ColorsTheme.orange50
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: verticalScale(10),
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(16),
  },
  buttonGoBack: {
    width: isTablet ? 72 : 60,
    height: isTablet ? 72 : 60,
    borderRadius: 15,
    backgroundColor: ColorsTheme.orange100,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: horizontalScale(18),
    top: verticalScale(18),
  },
  title: {
    fontSize: isTablet ? 72 : 32,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue200,
    textAlign: 'center',
    marginTop: verticalScale(15),
    ...textShadow
  },
  subtitle: {
    fontSize:  isTablet ? 32 : 18,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.orange100,
    textAlign: 'center',
    marginTop: verticalScale(4),
    ...textShadow
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: isTablet ? 20 : 16,
    color: ColorsTheme.white,
    fontFamily: 'PixelifySans-Regular',
    marginTop: verticalScale(10),
    ...textShadow
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  emptyTitle: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.white,
    marginTop: verticalScale(16),
    ...textShadow
  },
  emptySubtitle: {
    fontSize: isTablet ? 28 : 24,
    fontFamily: 'PixelifySans-Regular',
    color: ColorsTheme.white,
    textAlign: 'center',
    marginTop: verticalScale(8),
    ...textShadow
  },
  listContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(20),
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorsTheme.orange10,
    padding: verticalScale(12),
    marginBottom: verticalScale(12),
    borderRadius: 8,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    width: isTablet ? 32 : 28,
    height: isTablet ? 32 : 28,
    backgroundColor: ColorsTheme.blue100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ColorsTheme.blue200,
    borderRadius: isTablet ? 28 : 14,
  },
  rankNumberText: {
    fontSize: isTablet ? 18 : 14,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue500,
  },
  playerInfo: {
    flex: 1,
    marginLeft: verticalScale(16),
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    fontSize: isTablet ? 22 : 18,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue500,
  },
  youTag: {
    fontSize: isTablet ? 18 : 14,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.green350,
    marginLeft: verticalScale(8),
  },
  scoreText: {
    fontSize: isTablet ? 18 : 14,
    fontFamily: 'PixelifySans-Regular',
    color: ColorsTheme.blue200,
    marginTop: verticalScale(2),
  },
  listWrapper: {
    height: verticalScale(535),
    marginTop: verticalScale(25),
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
})