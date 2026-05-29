import api from './api';
import { Competition } from '../types';

/**
 * Serviço de competições — busca rodadas da API.
 */
export const competitionService = {
  /** Retorna a rodada ativa com todos os ativos e contexto econômico. */
  getActive: () => api.get<Competition>('/api/competitions/active'),

  /** Retorna uma rodada específica pelo ID. */
  getById: (id: string) => api.get<Competition>(`/api/competitions/${id}`),
};
