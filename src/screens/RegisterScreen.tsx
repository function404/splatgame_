import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ImageBackground, StatusBar, ActivityIndicator, ScrollView } from 'react-native';
import { User, Mail, Lock, CheckCircle, Phone } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '@/src/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { TNavigationProp } from '@/src/navigation/types';
import { ColorsTheme } from '@/src/theme/colors';

export default function RegisterScreen() {
    const navigation = useNavigation<TNavigationProp>();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert('Campos incompletos', 'Por favor, preencha todos os campos.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Senhas não conferem', 'As senhas digitadas não são iguais.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Senha fraca', 'A senha precisa ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Usuário criado no Auth:', user.uid);

            await setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                username: username.trim(),
                email: email,
                phone: phone.trim(),
                highScore: 0,
                createdAt: new Date(),
            });

            await setDoc(doc(db, "usernames", username.trim().toLowerCase()), {
                userId: user.uid
            });

            console.log('Dados do usuário e nome de usuário salvos no Firestore!');
            navigation.navigate('Login');

        } catch (error: any) {
            let errorMessage = 'Ocorreu um erro ao tentar criar a conta.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este e-mail já está em uso por outra conta.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'O formato do e-mail é inválido.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'A senha é muito fraca.';
            }
            Alert.alert('Erro no Registro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ColorsTheme.orange100 }}>
            <StatusBar backgroundColor={ColorsTheme.orange100} barStyle="light-content" />
            <ImageBackground
                source={require('@/assets/images/homeBackground.png')}
                resizeMode='cover'
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Splat
                            <Text style={styles.titleGame}>{` Game`}</Text>
                        </Text>
                        <Text style={styles.subtitle}>Crie sua conta para jogar</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <User color={ColorsTheme.grey300} size={20} style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nome de Jogador"
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor={ColorsTheme.grey300}
                            autoCapitalize="words"
                        />
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
                        <Phone color={ColorsTheme.grey300} size={20} style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Telefone"
                            value={phone}
                            onChangeText={setPhone}
                            placeholderTextColor={ColorsTheme.grey300}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Lock color={ColorsTheme.grey300} size={20} style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Senha (mín. 6 caracteres)"
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor={ColorsTheme.grey300}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Lock color={ColorsTheme.grey300} size={20} style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholderTextColor={ColorsTheme.grey300}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleRegister}
                        style={styles.registerButton}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={ColorsTheme.white} />
                        ) : (
                            <>
                                <CheckCircle size={20} color={ColorsTheme.white} />
                                <Text style={styles.registerButtonTextAction}>Criar Conta</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
                        <Text style={styles.loginLinkText}>
                            Já tem uma conta? <Text style={{ fontWeight: 'bold' }}>Faça login</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const textShadow = {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3
};

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
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsTheme.green400,
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
    registerButtonTextAction: {
        color: ColorsTheme.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 24,
        paddingBottom: 20,
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 16,
        color: ColorsTheme.white,
        ...textShadow
    },
});
