import api from './api';
import { AchievementRarity, UserProfile } from '../types';

interface ApiAchievement {
  code: string;
  title: string;
  description: string;
  rarity: string;
  unlocked: boolean;
  /** LocalDateTime em ISO; null enquanto bloqueada. */
  unlockedAt?: string | null;
}

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
  /** Catálogo completo, com as desbloqueadas marcadas. */
  achievements?: ApiAchievement[];
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
        achievements: (response.data.achievements || []).map((a) => ({
          code: a.code,
          title: a.title,
          description: a.description,
          // Raridade desconhecida (API mais nova) é tratada na exibição, que cai em "comum".
          rarity: a.rarity as AchievementRarity,
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt ?? undefined,
        })),
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
