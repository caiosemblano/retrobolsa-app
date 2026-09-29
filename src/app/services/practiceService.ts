import api from './api';
import { mapCompetition } from './competitionService';
import { mapResult } from './portfolioService';
import { Portfolio, PracticeRound } from '../types';

interface ApiPracticeRound {
  id: string;
  round: number;
  scenarioTitle?: string | null;
  startYear: number;
  endYear: number;
  assetCount: number;
  runs: number;
  bestReturn?: number | string | null;
}

const alocacoes = (carteira: Portfolio) =>
  Object.entries(carteira).map(([assetId, amount]) => ({ assetId, amount }));

/** Modo treino: rodadas já reveladas, remontadas quantas vezes o jogador quiser, sem valer ranking. */
export const practiceService = {
  list: async () => {
    const response = await api.get<ApiPracticeRound[]>('/api/practice');
    const data: PracticeRound[] = response.data.map((rodada) => ({
      id: rodada.id,
      round: rodada.round,
      scenarioTitle: rodada.scenarioTitle ?? undefined,
      startYear: rodada.startYear,
      endYear: rodada.endYear,
      assetCount: rodada.assetCount,
      runs: rodada.runs,
      bestReturn: rodada.bestReturn === undefined || rodada.bestReturn === null ? undefined : Number(rodada.bestReturn),
    }));
    return { ...response, data };
  },

  /** Os dados de montagem da rodada: ativos anônimos e o cenário do ano inicial. */
  round: async (competitionId: string) => {
    const response = await api.get<Parameters<typeof mapCompetition>[0]>(`/api/practice/${competitionId}`);
    return { ...response, data: mapCompetition(response.data) };
  },

  practice: async (competitionId: string, carteira: Portfolio) => {
    const response = await api.post<Parameters<typeof mapResult>[0]>(`/api/practice/${competitionId}`, {
      allocations: alocacoes(carteira),
    });
    return { ...response, data: mapResult(response.data) };
  },
};
