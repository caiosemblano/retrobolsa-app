import api from './api';
import { RankingEntry } from '../types';

interface ApiRanking {
  username: string;
  rank: number;
  totalReturn?: number | string;
  totalScore?: number;
}

interface ApiMyRank {
  username: string;
  globalRank: number;
  totalGlobalPlayers: number;
  totalScore: number;
  competitionsPlayed: number;
  activeRoundRank?: number | null;
  activeRoundNumber?: number | null;
  activeRoundStatus?: string | null;
}

interface ApiSeasonInfo {
  seasonNumber: number;
  roundStart: number;
  roundEnd: number;
}

export interface MyRankSummary {
  username: string;
  globalRank: number;
  totalGlobalPlayers: number;
  points: number;
  competitionsPlayed: number;
  activeRoundRank?: number;
  activeRoundNumber?: number;
  activeRoundStatus?: string;
}

export interface SeasonInfo {
  seasonNumber: number;
  roundStart: number;
  roundEnd: number;
}

const mapRanking = (item: ApiRanking): RankingEntry => ({
  rank: item.rank,
  username: item.username,
  points: Number(item.totalScore ?? item.totalReturn ?? 0),
  rentability: item.totalReturn === undefined ? undefined : Number(item.totalReturn),
});

export type RankingType = 'quinzenal' | 'season' | 'general';

/** Página padrão do ranking global — mesmo default do backend. */
export const GLOBAL_PAGE_SIZE = 50;

/**
 * Serviço de rankings — carrega classificações por tipo de período.
 */
export const rankingService = {
  /**
   * Retorna a lista de jogadores classificados pelo tipo de ranking.
   * @param type 'quinzenal' | 'season' | 'general'
   */
  get: async (type: RankingType) => {
    const response = await api.get<ApiRanking[]>(`/api/rankings?type=${type}`);
    return { ...response, data: response.data.map(mapRanking) };
  },

  /** Retorna uma página do ranking global (base 0). */
  getGlobalPage: async (page: number, limit: number = GLOBAL_PAGE_SIZE) => {
    const response = await api.get<ApiRanking[]>('/api/rankings/global', {
      params: { page, limit },
    });
    return { ...response, data: response.data.map(mapRanking) };
  },

  /** Posição do usuário autenticado, independente da página carregada da lista. */
  getMyRank: async () => {
    const response = await api.get<ApiMyRank>('/api/rankings/me');
    const data: MyRankSummary = {
      username: response.data.username,
      globalRank: response.data.globalRank,
      totalGlobalPlayers: response.data.totalGlobalPlayers,
      points: Number(response.data.totalScore),
      competitionsPlayed: response.data.competitionsPlayed,
      activeRoundRank: response.data.activeRoundRank ?? undefined,
      activeRoundNumber: response.data.activeRoundNumber ?? undefined,
      activeRoundStatus: response.data.activeRoundStatus ?? undefined,
    };
    return { ...response, data };
  },

  /** Número e faixa de rodadas da temporada atual. */
  getSeasonInfo: async () => {
    const response = await api.get<ApiSeasonInfo>('/api/rankings/season/current');
    const data: SeasonInfo = {
      seasonNumber: response.data.seasonNumber,
      roundStart: response.data.roundStart,
      roundEnd: response.data.roundEnd,
    };
    return { ...response, data };
  },
};
