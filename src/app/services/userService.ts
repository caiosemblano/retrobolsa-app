import api from './api';
import { baixarArquivo } from '../utils/download';
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
  onboarded?: boolean;
  mustChangePassword?: boolean;
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
        onboarded: response.data.onboarded,
        mustChangePassword: response.data.mustChangePassword,
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

  /** O jogador terminou (ou pulou) o passo a passo do primeiro acesso. */
  markOnboarded: () => api.post<void>('/api/users/me/onboarded'),

  changePassword: (senhaAtual: string, novaSenha: string, confirmarSenha: string) =>
    api.post<void>('/api/users/me/password', { senhaAtual, novaSenha, confirmarSenha }),

  /** LGPD: baixa o JSON com tudo o que o RetroBolsa guarda sobre a pessoa. */
  downloadMyData: async () => {
    const response = await api.get<Blob>('/api/users/me/export', { responseType: 'blob' });
    baixarArquivo(response.data, 'meus-dados-retrobolsa.json');
  },

  /** LGPD: exclui a conta e tudo o que é dela, depois de conferir a senha. */
  deleteAccount: (senha: string) => api.delete<void>('/api/users/me', { data: { senha } }),
};
