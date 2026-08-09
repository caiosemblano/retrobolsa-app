import api from './api';
import { RankingEntry } from '../types';

export type RankingType = 'quinzenal' | 'season' | 'general';

export const rankingService = {
  get: (type: RankingType) =>
    api.get<RankingEntry[]>(`/api/rankings?type=${type}`),
};
