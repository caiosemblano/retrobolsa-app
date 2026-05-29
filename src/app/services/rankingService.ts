import api from './api';
import { RankingEntry } from '../types';

export type RankingType = 'quinzenal' | 'season' | 'general';

/**
 * Serviço de rankings — carrega classificações por tipo de período.
 */
export const rankingService = {
  /**
   * Retorna a lista de jogadores classificados pelo tipo de ranking.
   * @param type 'quinzenal' | 'season' | 'general'
   */
  get: (type: RankingType) =>
    api.get<RankingEntry[]>(`/api/rankings?type=${type}`),
};
