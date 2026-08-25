import api from './api';
import { UserProfile } from '../types';

interface ApiProfile {
  username: string;
  email: string;
  totalScore: number;
  bestRank?: number;
  competitions: number;
}

/**
 * Serviço de perfil do usuário — dados autenticados via JWT.
 */
export const userService = {
  /**
   * Retorna o perfil completo do usuário autenticado.
   * Inclui pontuação total, conquistas e estatísticas de competição.
   */
  getProfile: async () => {
    const response = await api.get<ApiProfile>('/api/users/profile');
    return {
      ...response,
      data: {
        username: response.data.username,
        email: response.data.email,
        totalPoints: response.data.totalScore,
        bestRank: response.data.bestRank ?? 0,
        completedCompetitions: response.data.competitions,
        avatar: '',
        favoriteAsset: '',
        achievements: [],
      } satisfies UserProfile,
    };
  },
};
