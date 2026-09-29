import api from './api';
import { ChartPoint, Portfolio, Result } from '../types';

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
  benchmarks?: Array<{ code: string; name: string; totalReturn: number | string; chartData?: ApiPoint[] }>;
  roundStats?: {
    participants: number;
    medianReturn?: number | string | null;
    bestAsset?: { anonymousName: string; realName?: string | null; returnPct: number | string } | null;
  } | null;
  debrief?: string | null;
  tips?: Array<{ code: string; message: string; moduleId?: string | null; articleId?: string | null }>;
}

type ApiPoint = { year: number; value: number | string };

const toPoints = (points?: ApiPoint[]): ChartPoint[] =>
  (points || []).map((point) => ({ year: point.year, value: Number(point.value) }));

/** A API manda null para campos vazios; no app eles viram undefined. */
const opcional = <T,>(valor: T | null | undefined): T | undefined => valor ?? undefined;
const numeroOpcional = (valor?: number | string | null) =>
  valor === undefined || valor === null ? undefined : Number(valor);

export function mapResult(data: ApiResult): Result {
  return {
    rank: data.rank,
    rentability: Number(data.rentability),
    annualReturn: Number(data.annualReturn),
    portfolioValue: Number(data.portfolioValue),
    chartData: toPoints(data.chartData),
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
      returnPct: numeroOpcional(asset.returnPct as number | string | null),
      contribution: numeroOpcional(asset.contribution as number | string | null),
      revealNote: opcional(asset.revealNote as string | null),
    })),
    period: data.period,
    benchmarks: (data.benchmarks || []).map((benchmark) => ({
      code: benchmark.code,
      name: benchmark.name,
      totalReturn: Number(benchmark.totalReturn),
      chartData: toPoints(benchmark.chartData),
    })),
    roundStats: data.roundStats
      ? {
          participants: data.roundStats.participants,
          medianReturn: numeroOpcional(data.roundStats.medianReturn),
          bestAsset: data.roundStats.bestAsset
            ? {
                anonymousName: data.roundStats.bestAsset.anonymousName,
                realName: opcional(data.roundStats.bestAsset.realName),
                returnPct: Number(data.roundStats.bestAsset.returnPct),
              }
            : undefined,
        }
      : undefined,
    debrief: opcional(data.debrief),
    tips: (data.tips || []).map((tip) => ({
      code: tip.code,
      message: tip.message,
      moduleId: opcional(tip.moduleId),
      articleId: opcional(tip.articleId),
    })),
  };
}

/** A carteira enviada na rodada aberta, como a API devolve. */
interface ApiCurrentPortfolio {
  competitionId: string;
  allocations: Array<{ assetId: string; amount: number | string }>;
}

export interface CurrentPortfolio {
  competitionId: string;
  portfolio: Portfolio;
}

export const portfolioService = {
  submit: (payload: SubmitPortfolioPayload) =>
    api.post<{ message: string; warnings?: string[] }>('/api/portfolios', payload),

  /** Troca as alocações da carteira já enviada, enquanto a rodada está aberta. */
  update: (payload: SubmitPortfolioPayload) =>
    api.put<{ message: string; warnings?: string[] }>('/api/portfolios', payload),

  /** A carteira enviada na rodada aberta; null se não há rodada aberta ou se ainda não enviou (204). */
  getCurrent: async (): Promise<CurrentPortfolio | null> => {
    const response = await api.get<ApiCurrentPortfolio | ''>('/api/portfolios/current');
    if (response.status === 204 || !response.data) return null;
    return {
      competitionId: response.data.competitionId,
      portfolio: Object.fromEntries(
        response.data.allocations.map((allocation) => [allocation.assetId, Number(allocation.amount)]),
      ),
    };
  },

  getLastResult: async () => {
    const response = await api.get<ApiResult>('/api/portfolios/my-last-result');
    return { ...response, data: mapResult(response.data) };
  },
};
