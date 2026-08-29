import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  expiresIn: number;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', payload);
    await AsyncStorage.setItem('retrobolsa_token', res.data.token);
    return res.data;
  },

  register: (payload: RegisterPayload) =>
    api.post('/api/auth/register', payload),

  logout: async () => {
    await AsyncStorage.removeItem('retrobolsa_token');
    await AsyncStorage.removeItem('retrobolsa_user');
  },

  getToken: () => AsyncStorage.getItem('retrobolsa_token'),
};
