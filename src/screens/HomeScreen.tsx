import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, StatusBar, ActivityIndicator, Modal, Pressable } from 'react-native'
import { Play, Bolt, Trophy, LogOut, X, UserIcon, Mail } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { auth, db } from '@/src/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

import { TNavigationProp } from '@/src/navigation/types'
import { User } from '@/src/types/game'
import { ColorsTheme } from '@/src/theme/colors'
import { AppVersion } from '@/src/utils/AppVersion'


export default function HomeScreen() {
  const navigation = useNavigation<TNavigationProp>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false)

  const loadUserStats = useCallback(async () => {
    setLoading(true)
    const firebaseUser = auth.currentUser

    if (firebaseUser) {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUser(userDoc.data() as User)
        } else {
          console.log("Documento do usuário não encontrado no Firestore.")
          await signOut(auth)
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        Alert.alert('Erro', 'Não foi possível carregar seus dados.')
      }
    }
    setLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadUserStats()
    }, [loadUserStats])
  )

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Você tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth)
            setSettingsModalVisible(false)
          } catch (error) {
            console.error('Erro ao fazer logout:', error)
            Alert.alert('Erro', 'Não foi possível sair da sua conta.')
          }
        },
      },
    ])
  }

  const handlePlayPress = () => {
    if (!user) {
      Alert.alert('Aguarde', 'Carregando dados do usuário...')
      return
    }
    navigation.navigate('Game')
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ColorsTheme.orange50 }}>
        <ActivityIndicator size="large" color={ColorsTheme.white} />
      </View>
    )
  }

  const renderSettingsModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isSettingsModalVisible}
      onRequestClose={() => setSettingsModalVisible(false)}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <X size={24} color={ColorsTheme.blue500} />
            </TouchableOpacity>
          </View>

          {user && (
            <View style={styles.modalContent}>
              <View style={styles.userInfoContainer}>
                <UserIcon size={20} color={ColorsTheme.blue500} />
                <Text style={styles.userInfoText}>{user.username}</Text>
              </View>

              <View style={styles.userInfoContainer}>
                <Mail size={20} color={ColorsTheme.blue500} />
                <Text style={styles.userInfoText}>{user.email}</Text>
              </View>

              <View style={styles.statBoxModal}>
                <Text style={styles.statLabel}>Seu Recorde</Text>
                <Text style={styles.statValue}>{user.highScore}</Text>
              </View>

              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
                activeOpacity={0.8}
              >
                <LogOut size={20} color={ColorsTheme.red300} />
                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
              </TouchableOpacity>

              <AppVersion />
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange50 }}>
      <StatusBar backgroundColor={ColorsTheme.orange100} barStyle="dark-content" />
      
      {renderSettingsModal()}

      <ImageBackground
        source={require('@/assets/images/homeBackground.png')}
        resizeMode='cover'
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Splat
            <Text style={styles.titleGame}>{` Game`}</Text>
          </Text>
          {user ? (
            <Text style={styles.subtitle}>
              Tente a sorte,
              <Text style={styles.subtitleUser}>{` ${user.username}!`}</Text>
            </Text>
          ) : (
            <Text style={styles.subtitle}>Bem-vindo!</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setSettingsModalVisible(true)}
            style={styles.buttonSide}
            activeOpacity={0.8}
          >
            <Bolt size={24} color={ColorsTheme.white} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handlePlayPress}
            style={styles.buttonCenter}
          >
            <Play size={42} color={ColorsTheme.white} />
            <Text style={styles.playButtonText}>Jogar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Leaderboard')}
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
  textShadowOffset: { width: -1, height: 1 },
  textShadowRadius: 3
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 58,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue200,
    ...textShadow
  },
  titleGame: {
    color: ColorsTheme.orange100,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24,
    color: ColorsTheme.orange100,
    fontFamily: 'PixelifySans-Bold',
    paddingHorizontal: 16,
    ...textShadow
  },
  subtitleUser: {
    color: ColorsTheme.blue200,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 40,
  },
  statLabel: {
    fontSize: 14,
    color: ColorsTheme.grey300,
    marginBottom: 4,
    fontFamily: 'PixelifySans-Medium',
  },
  statValue: {
    fontSize: 24,
    color: ColorsTheme.blue500,
    fontFamily: 'PixelifySans-Regular',
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
    elevation: 8,
  },
  buttonCenter: {
    width: 110,
    height: 110,
    borderRadius: 40,
    backgroundColor: ColorsTheme.orange100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  playButtonText: {
    textAlign: 'center',
    color: ColorsTheme.white,
    fontSize: 16,
    fontFamily: 'PixelifySans-Medium',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: ColorsTheme.orange50,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: ColorsTheme.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.blue500,
  },
  modalContent: {
    width: '100%',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: ColorsTheme.blue100,
    padding: 10,
    borderRadius: 8,
  },
  userInfoText: {
    fontSize: 16,
    fontFamily: 'PixelifySans-Medium',
    color: ColorsTheme.blue500,
    marginLeft: 10,
  },
  statBoxModal: {
    backgroundColor: ColorsTheme.blue100,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    backgroundColor: ColorsTheme.red100,
    borderWidth: 2,
    borderColor: ColorsTheme.red200,
    marginTop: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'PixelifySans-Bold',
    color: ColorsTheme.red300,
  },
})
