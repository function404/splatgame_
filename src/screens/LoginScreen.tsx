import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ImageBackground, StatusBar, ActivityIndicator } from 'react-native'
import { Mail, Lock, LogIn } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { auth } from '@/src/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { TNavigationProp } from '@/src/navigation/types'
import { ColorsTheme } from '@/src/theme/colors'

export default function LoginScreen() {
    const navigation = useNavigation<TNavigationProp>()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos vazios', 'Por favor, preencha o e-mail e a senha.')
            return
        }

        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            console.log('Login bem-sucedido:', user.uid)
            navigation.navigate('Home')

        } catch (error: any) {
            let errorMessage = 'Ocorreu um erro ao tentar fazer o login.'
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = 'E-mail ou senha inválidos.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'O formato do e-mail é inválido.'
            }
            Alert.alert('Erro no Login', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const navigateToRegister = () => {
        navigation.navigate('Register')
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange100 }}>
            <StatusBar backgroundColor={ColorsTheme.orange100} barStyle="light-content" />
            <ImageBackground
                source={require('@/assets/images/homeBackground.png')}
                resizeMode='cover'
                style={{ flex: 1, justifyContent: 'center' }}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Splat
                        <Text style={styles.titleGame}>
                            {` Game`}
                        </Text>
                    </Text>
                    <Text style={styles.subtitle}>Faça login para continuar</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Mail color={ColorsTheme.grey300} size={20} style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor={ColorsTheme.grey300}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock color={ColorsTheme.grey300} size={20} style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor={ColorsTheme.grey300}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.loginButton}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={ColorsTheme.white} />
                    ) : (
                        <>
                            <LogIn size={20} color={ColorsTheme.white} />
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToRegister} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>
                        Não tem uma conta? <Text style={{ fontWeight: 'bold' }}>Registre-se</Text>
                    </Text>
                </TouchableOpacity>

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
        marginBottom: 30,
        paddingHorizontal: 16,
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
        fontSize: 22,
        color: ColorsTheme.white,
        fontFamily: 'PixelifySans-Medium',
        ...textShadow,
        marginTop: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginHorizontal: 24,
        backgroundColor: ColorsTheme.white,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: ColorsTheme.grey100,
    },
    icon: {
        marginLeft: 16,
    },
    textInput: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        fontSize: 16,
        color: ColorsTheme.blue500,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsTheme.blue200,
        marginHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
        gap: 10,
        shadowColor: ColorsTheme.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    loginButtonText: {
        color: ColorsTheme.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    registerButtonText: {
        fontSize: 16,
        color: ColorsTheme.white,
        ...textShadow
    },
})
