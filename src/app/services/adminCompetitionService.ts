import api from './api';

export interface AdminCompetition {
  id: string;
  roundNumber: number;
  status: string;
  scenarioTitle?: string;
  startYear: number;
  endYear: number;
}

/** Ativo como o admin vê ao montar uma rodada: com o nome real e os anos que têm retorno. */
export interface AdminAsset {
  id: string;
  anonymousName: string;
  realName?: string | null;
  ticker?: string | null;
  type: 'stock' | 'bond';
  sector?: string | null;
  bondType?: string | null;
  /** Anos com retorno anual na base, em ordem crescente. */
  years: number[];
}

export interface NovaRodadaPayload {
  roundNumber: number;
  budget: number;
  scenarioTitle: string;
  scenarioDescription?: string;
  startYear: number;
  endYear: number;
  /** Data e hora locais, no formato do input datetime-local (2026-10-05T23:59). */
  endsAt: string;
  assetIds: string[];
}

export const adminCompetitionService = {
  list: () => api.get<AdminCompetition[]>('/api/admin/competitions'),
  assets: () => api.get<AdminAsset[]>('/api/admin/competitions/assets'),
  create: (payload: NovaRodadaPayload) => api.post<AdminCompetition>('/api/admin/competitions', payload),
  nextRound: () => api.post<void>('/api/admin/competitions/next-round'),
  start: (id: string) => api.post<void>(`/api/admin/competitions/${id}/start`),
  close: (id: string) => api.post<void>(`/api/admin/competitions/${id}/close`),
  simulate: (id: string) => api.post<void>(`/api/admin/competitions/${id}/simulate`),
  quickSimulate: (id: string) => api.post<void>(`/api/admin/competitions/${id}/quick-simulate`),
  reveal: (id: string) => api.post<void>(`/api/admin/competitions/${id}/reveal`),
  reset: () => api.post<void>('/api/admin/competitions/reset'),
};
