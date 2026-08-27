import api from './api';
import { UserProfile } from '../types';

interface ApiProfile {
  username: string;
  email: string;
  role?: string;
  totalScore: number;
  bestRank?: number;
  competitions: number;
  history?: Array<{
    roundNumber: number;
    scenarioTitle: string;
    totalReturn: number | string;
    finalValue: number | string;
    rank: number;
    submittedAt: string;
  }>;
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
        role: response.data.role,
        totalPoints: response.data.totalScore,
        bestRank: response.data.bestRank ?? 0,
        completedCompetitions: response.data.competitions,
        avatar: '',
        favoriteAsset: '',
        achievements: [],
        history: (response.data.history || []).map((h) => ({
          roundNumber: h.roundNumber,
          scenarioTitle: h.scenarioTitle,
          totalReturn: Number(h.totalReturn),
          finalValue: Number(h.finalValue),
          rank: h.rank,
          submittedAt: h.submittedAt,
        })),
      } satisfies UserProfile,
    };
  },
};
