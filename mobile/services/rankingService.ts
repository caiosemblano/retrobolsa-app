import api from './api';
import { RankingEntry } from '../types';

export type RankingType = 'quinzenal' | 'season' | 'general';

export const rankingService = {
  get: async (type: RankingType) => {
    const res = await api.get<any[]>(`/api/rankings?type=${type}`);
    const mapped = res.data.map(item => ({
      ...item,
      points: item.totalScore !== undefined ? item.totalScore : 0,
      rentability: item.totalReturn !== undefined ? item.totalReturn : undefined,
    }));
    return { ...res, data: mapped };
  }
};
