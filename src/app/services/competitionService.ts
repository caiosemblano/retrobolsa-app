import api from './api';
import { Asset, Competition } from '../types';

interface ApiAsset {
  id: string;
  type: string;
  anonymousName: string;
  sector?: string;
  bondType?: string;
  rate?: number | string;
  indicators?: {
    pl?: number | string;
    lvp?: number | string;
    lucroPositivo?: boolean;
    cagrLucro?: number | string;
    cagrReceita?: number | string;
    margemEbitda?: number | string;
  };
}

interface ApiCompetition {
  id: string;
  round: number;
  status: string;
  daysLeft?: number;
  budget?: number | string;
  scenarioTitle?: string;
  scenarioDescription?: string;
  startYear?: number;
  endYear?: number;
  endsAt?: string;
  assets: ApiAsset[];
}

const toNumber = (value?: number | string) =>
  value === undefined || value === null ? undefined : Number(value);

export function mapCompetition(data: ApiCompetition): Competition {
  const assets: Asset[] = (data.assets || []).map((asset) => ({
    id: asset.id,
    type: asset.type === 'bond' ? 'bond' : 'stock',
    anonymousName: asset.anonymousName,
    sector: asset.sector,
    bondType: asset.bondType,
    rate: toNumber(asset.rate),
    indicators: asset.indicators
      ? {
          pl: toNumber(asset.indicators.pl),
          lvp: toNumber(asset.indicators.lvp),
          lucroPositivo: asset.indicators.lucroPositivo,
          cagrLucro: toNumber(asset.indicators.cagrLucro),
          cagrReceita: toNumber(asset.indicators.cagrReceita),
          margemEbitda: toNumber(asset.indicators.margemEbitda),
        }
      : undefined,
  }));

  return {
    id: data.id,
    round: data.round,
    status: data.status as Competition['status'],
    daysLeft: data.daysLeft,
    budget: toNumber(data.budget) ?? 100000,
    scenarioDescription: data.scenarioDescription,
    startYear: data.startYear,
    endYear: data.endYear,
    endsAt: data.endsAt,
    economicContext: {
      title: data.scenarioTitle || `Cenário econômico da rodada ${data.round}`,
      indicators: data.scenarioDescription
        ? [{ name: 'Contexto da rodada', value: data.scenarioDescription, icon: 'Globe' }]
        : [],
    },
    assets,
  };
}

export const competitionService = {
  getActive: async () => {
    const response = await api.get<ApiCompetition>('/api/competitions/active');
    return { ...response, data: mapCompetition(response.data) };
  },

  /** Rodada mais recente independente do status — usado quando não há rodada aberta no momento. */
  getLatest: async () => {
    const response = await api.get<ApiCompetition>('/api/competitions/latest');
    return { ...response, data: mapCompetition(response.data) };
  },
};
