import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://bagged-chatty-suds.ngrok-free.dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('retrobolsa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      Alert.alert('Erro', 'Falha de conexão com o servidor.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        await AsyncStorage.removeItem('retrobolsa_token');
        await AsyncStorage.removeItem('retrobolsa_user');
        break;

      case 400:
        if (data.erro && Array.isArray(data.erro)) {
          Alert.alert('Erro', data.erro.join('\n'));
        } else {
          Alert.alert('Erro', data.erro || 'Requisição inválida.');
        }
        break;

      case 500:
        Alert.alert('Erro', 'Erro interno no servidor. Tente novamente mais tarde.');
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
