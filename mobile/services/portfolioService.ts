import api from './api';
import { Result, SubmitPortfolioResponse } from '../types';

export interface SubmitPortfolioPayload {
  competitionId: string;
  allocations: Array<{ assetId: string; amount: number }>;
}

export const portfolioService = {
  submit: async (payload: SubmitPortfolioPayload) => {
    const response = await api.post<SubmitPortfolioResponse>('/api/portfolios', payload);
    return response.data;
  },

  getLastResult: () => api.get<Result>('/api/portfolios/my-last-result'),

  getHistory: () => api.get('/api/portfolios/history'),
};
