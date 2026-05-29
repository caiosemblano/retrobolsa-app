import api from './api';
import { UserProfile } from '../types';

/**
 * Serviço de perfil do usuário — dados autenticados via JWT.
 */
export const userService = {
  /**
   * Retorna o perfil completo do usuário autenticado.
   * Inclui pontuação total, conquistas e estatísticas de competição.
   */
  getProfile: () => api.get<UserProfile>('/api/users/profile'),
};
