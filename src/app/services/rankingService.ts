import api from './api';
import { RankingEntry } from '../types';

interface ApiRanking {
  username: string;
  rank: number;
  totalReturn?: number | string;
  totalScore?: number;
}

const mapRanking = (item: ApiRanking): RankingEntry => ({
  rank: item.rank,
  username: item.username,
  points: Number(item.totalScore ?? item.totalReturn ?? 0),
  rentability: item.totalReturn === undefined ? undefined : Number(item.totalReturn),
});

export type RankingType = 'quinzenal' | 'season' | 'general';

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
};
