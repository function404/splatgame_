import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native'
import { Play, Settings, Trophy, RotateCcw, Save } from 'lucide-react-native'
import { LocalStorageService } from '@/src/services/localStorage'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { MainTabsNavigationProp } from '@/src/navigation/types'
import { User } from '@/src/types/game'
import { ColorsTheme } from '@/src/theme/colors'

export default function HomeScreen() {
  const navigation = useNavigation<MainTabsNavigationProp>()
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Splat 💥</Text>
        {user ? (
          <Text style={styles.subtitle}>Bem-vindo(a) de volta, {user.username}!</Text>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.playButton]} onPress={handlePlayPress}>
          <Play size={24} color={ColorsTheme.white} />
          <Text style={styles.playButtonText}>Jogar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleLeaderboardPress}>
          <Trophy size={20} color={ColorsTheme.blue200} />
          <Text style={styles.secondaryButtonText}>Placar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => Alert.alert('Settings', 'Settings feature coming soon!')}>
          <Settings size={20} color={ColorsTheme.blue200} />
          <Text style={styles.secondaryButtonText}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleResetData}>
          <RotateCcw size={20} color={ColorsTheme.red300} />
          <Text style={styles.resetButtonText}>Resetar Jogo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsTheme.blue100,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ColorsTheme.blue500,
  },
  subtitle: {
    fontSize: 16,
    color: ColorsTheme.grey300,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
    backgroundColor: ColorsTheme.green200,
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
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  playButton: {
    backgroundColor: ColorsTheme.blue200,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorsTheme.white,
  },
  secondaryButton: {
    backgroundColor: ColorsTheme.white,
    borderWidth: 2,
    borderColor: ColorsTheme.blue200,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorsTheme.blue200,
  },
  resetButton: {
    backgroundColor: ColorsTheme.red100,
    borderWidth: 2,
    borderColor: ColorsTheme.red200,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorsTheme.red300,
  },
})