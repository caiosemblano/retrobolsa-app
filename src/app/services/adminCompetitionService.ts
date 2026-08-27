import api from './api';

export interface AdminCompetition {
  id: string;
  roundNumber: number;
  status: string;
  scenarioTitle?: string;
  startYear: number;
  endYear: number;
}

export const adminCompetitionService = {
  list: () => api.get<AdminCompetition[]>('/api/admin/competitions'),
  nextRound: () => api.post<void>('/api/admin/competitions/next-round'),
  start: (id: string) => api.post<void>(`/api/admin/competitions/${id}/start`),
  close: (id: string) => api.post<void>(`/api/admin/competitions/${id}/close`),
  simulate: (id: string) => api.post<void>(`/api/admin/competitions/${id}/simulate`),
  reveal: (id: string) => api.post<void>(`/api/admin/competitions/${id}/reveal`),
  reset: () => api.post<void>('/api/admin/competitions/reset'),
};
