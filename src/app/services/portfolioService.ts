import api from './api';
import { Result } from '../types';

export interface SubmitPortfolioPayload {
  competitionId: string;
  allocations: Array<{ assetId: string; amount: number }>;
}

/**
 * Serviço de portfólios — submissão de carteiras e consulta de resultados.
 */
export const portfolioService = {
  /**
   * Submete as alocações do usuário para uma rodada.
   * O backend valida a soma e salva o portfólio.
   * Retorna 201 Created em sucesso.
   */
  submit: (payload: SubmitPortfolioPayload) =>
    api.post<void>('/api/portfolios', payload),

  /**
   * Retorna o resultado da última competição do usuário autenticado.
   * Inclui rentabilidade, série temporal para o gráfico e revelação dos ativos.
   */
  getLastResult: () => api.get<Result>('/api/portfolios/my-last-result'),

  /** Retorna o histórico de portfólios do usuário. */
  getHistory: () => api.get('/api/portfolios/history'),
};
