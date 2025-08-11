import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ImageBackground, StatusBar } from 'react-native'
import { Play, Bolt, Trophy, RotateCcw, Save } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TNavigationProp } from '@/src/navigation/types'

import { LocalStorageService } from '@/src/services/localStorage'

import { User } from '@/src/types/game'

import { ColorsTheme } from '@/src/theme/colors'

export default function HomeScreen() {
  const navigation = useNavigation<TNavigationProp>()
  const [user, setUser] = useState<User | null>(null)
  const [usernameInput, setUsernameInput] = useState('')

  const loadUserStats = useCallback(async () => {
    try {
      const mockUserId = 'user_123'
      const userData = await LocalStorageService.getUser(mockUserId)
      setUser(userData)
      if (userData) {
        setUsernameInput(userData.username)
      } else {
        setUsernameInput('')
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadUserStats()
    }, [loadUserStats])
  )

  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) {
      Alert.alert('Nome inválido', 'Por favor, digite um nome.')
      return
    }

    const mockUserId = 'user_123'
    const newUser: User = {
      userId: mockUserId,
      username: usernameInput.trim(),
      highScore: user?.highScore || 0,
      createdAt: user?.createdAt || new Date(),
    }

    await LocalStorageService.createUser(newUser)
    setUser(newUser)
    Alert.alert('Sucesso!', 'Seu nome foi salvo.')
  }

  const handleResetData = async () => {
    Alert.alert(
      'Resetar Jogo?',
      'Isso apagará seu nome, seu recorde e todo o placar. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            await LocalStorageService.resetAllData()
            setUser(null)
            setUsernameInput('')
            Alert.alert('Tudo resetado!', 'Comece uma nova jornada.')
          },
        },
      ]
    )
  }

  const handlePlayPress = () => {
    if (!user) {
      Alert.alert('Defina um nome', 'Por favor, salve um nome de usuário antes de jogar.')
      return
    }
    navigation.navigate('Game')
  }

  const handleLeaderboardPress = () => {
    navigation.navigate('Leaderboard')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange100 }}>
      <StatusBar backgroundColor={ColorsTheme.orange100} barStyle="light-content" />
      <ImageBackground 
        source={require('@/assets/images/homeBackground.png')}
        resizeMode='cover'
        style={{ flex: 1 }} 
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Splat

            <Text style={styles.titleGame}>
              {` Game`}
            </Text>
          </Text>

          {user ? (
            <Text style={styles.subtitle}>
              Tente a sorte,

              <Text style={styles.subtitleUser}>
                {` ${user.username}!`}
              </Text>
            </Text>
          ) : (
            <Text style={styles.subtitle}>Defina seu nome para começar</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu nome de jogador"
            value={usernameInput}
            onChangeText={setUsernameInput}
            placeholderTextColor={ColorsTheme.grey300}
            maxLength={22}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveUsername}>
            <Save size={20} color={ColorsTheme.white} />
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Recorde</Text>
              <Text style={styles.statValue}>{user.highScore}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          onPress={handleResetData}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            borderRadius: 12,
            gap: 8,
            marginHorizontal: 16,
            backgroundColor: ColorsTheme.red100,
            borderWidth: 2,
            borderColor: ColorsTheme.red200,      
          }} 
          activeOpacity={0.8}
        >
          <RotateCcw size={20} color={ColorsTheme.red300} />
          <Text style={styles.resetButtonText}>Resetar Jogo</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Settings', 'Configurações em breve!')}
            style={styles.buttonSide}
            activeOpacity={0.8} 
          >
            <Bolt size={24} color={ColorsTheme.white}/>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handlePlayPress}
            style={styles.buttonCenter}
          >
            <Play size={42} color={ColorsTheme.white}/>
            <Text style={styles.playButtonText}>Jogar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLeaderboardPress}
            style={styles.buttonSide}
            activeOpacity={0.8} 
          >
            <Trophy size={24} color={ColorsTheme.white} />
          </TouchableOpacity>
        </View>
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
  // header
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 58,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue200,
    ...textShadow
  },
  titleGame: {
    alignItems: 'center',
    textAlign: 'center',
    color: ColorsTheme.orange100,
  },
  subtitle: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 26,
    color: ColorsTheme.orange100,
    fontFamily: 'PixelifySans-Bold',
    paddingHorizontal: 16,
    ...textShadow
  },
  subtitleUser: {
    color: ColorsTheme.blue200,
  },
  // input name
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: ColorsTheme.grey100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: ColorsTheme.white,
    color: ColorsTheme.blue500,
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: ColorsTheme.green400,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: ColorsTheme.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: ColorsTheme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statLabel: {
    fontSize: 14,
    color: ColorsTheme.grey300,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorsTheme.blue500,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  buttonSide: {
    width: 70,
    height: 70,
    borderRadius: 25,
    backgroundColor: ColorsTheme.blue200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ColorsTheme.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonCenter: {
    width: 110,
    height: 110,
    borderRadius: 40,
    backgroundColor: ColorsTheme.orange100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ColorsTheme.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  playButtonText: {
    textAlign: 'center',
    color: ColorsTheme.white,
    fontSize: 16,
    fontFamily: 'PixelifySans-Medium',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorsTheme.red300,
  },
})