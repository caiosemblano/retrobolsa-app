import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '../Icon';
import { Colors } from '../../constants/Colors';

interface LoginScreenProps {
  onRegister: () => void;
}

export function LoginScreen({ onRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, senha });
    } catch (error) {
      // Interceptor should show alert for invalid credentials
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="TrendingUp" size={64} color={Colors.primaryHover} />
        <Text style={styles.title}>RetroBolsa</Text>
        <Text style={styles.subtitle}>Simulador Histórico de Investimentos</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Seu e-mail"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
          secureTextEntry
        />

        <Button
          variant="primary"
          size="lg"
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.loginBtn}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.cardBackground} />
          ) : (
            <Text style={styles.loginBtnText}>Entrar</Text>
          )}
        </Button>

        <TouchableOpacity onPress={onRegister} style={styles.registerLink}>
          <Text style={styles.registerLinkText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.textPrimary,
  },
  loginBtn: {
    marginTop: 8,
    alignItems: 'center',
  },
  loginBtnText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerLinkText: {
    color: Colors.primaryHover,
    fontSize: 15,
    fontWeight: '600',
  },
});
