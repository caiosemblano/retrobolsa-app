import api from './api';
import { Result } from '../types';

export interface SubmitPortfolioPayload {
  competitionId: string;
  allocations: Array<{ assetId: string; amount: number }>;
}

interface ApiResult {
  rank: number;
  rentability: number | string;
  annualReturn: number | string;
  portfolioValue: number | string;
  chartData?: Array<{ year: number; value: number | string }>;
  revealedAssets?: Array<Record<string, unknown> & {
    id: string;
    anonymousName: string;
    type: string;
  }>;
  period: string;
}

export function mapResult(data: ApiResult): Result {
  return {
    rank: data.rank,
    rentability: Number(data.rentability),
    annualReturn: Number(data.annualReturn),
    portfolioValue: Number(data.portfolioValue),
    chartData: (data.chartData || []).map((point) => ({ year: point.year, value: Number(point.value) })),
    revealedAssets: (data.revealedAssets || []).map((asset) => ({
      id: asset.id,
      anonymousName: asset.anonymousName,
      realName: asset.realName as string | undefined,
      ticker: asset.ticker as string | undefined,
      type: asset.type === 'bond' ? 'bond' : 'stock',
      sector: asset.sector as string | undefined,
      bondType: asset.bondType as string | undefined,
      amountInvested: Number(asset.amountInvested || 0),
      finalValue: Number(asset.finalValue || 0),
    })),
    period: data.period,
  };
}

export const portfolioService = {
  submit: (payload: SubmitPortfolioPayload) =>
    api.post<{ message: string; warnings?: string[] }>('/api/portfolios', payload),

  getLastResult: async () => {
    const response = await api.get<ApiResult>('/api/portfolios/my-last-result');
    return { ...response, data: mapResult(response.data) };
  },
};
