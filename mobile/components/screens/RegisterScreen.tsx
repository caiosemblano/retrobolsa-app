import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { Icon } from '../Icon';

interface RegisterScreenProps {
  onBackToLogin: () => void;
}

export function RegisterScreen({ onBackToLogin }: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !email || !senha || !confirmarSenha) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ username, email, senha, confirmarSenha });
      
      setSuccessMsg('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        onBackToLogin();
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrorMsg('Erro ao realizar cadastro. Verifique se o e-mail/usuário já existe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToLogin} style={styles.backButton}>
          <Icon name="ChevronLeft" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
      </View>

      <View style={styles.formContainer}>
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Seu nome"
          autoCapitalize="words"
        />

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

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="Confirme sua senha"
          secureTextEntry
        />

        <Button
          variant="primary"
          size="lg"
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.registerBtn}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.registerBtnText}>Cadastrar</Text>
          )}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#0f172a',
  },
  registerBtn: {
    marginTop: 8,
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    color: '#16a34a',
    fontSize: 14,
    textAlign: 'center',
  },
});
