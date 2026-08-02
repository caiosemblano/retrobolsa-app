import api from './api';
import { Competition, CompetitionApiResponse } from '../types';
import { CreditCard, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

const mapCompetitionResponse = (apiData: CompetitionApiResponse): Competition => {
  return {
    ...apiData,
    status: apiData.status as 'open' | 'closed' | 'simulating',
    economicContext: {
      title: apiData.scenarioTitle,
      indicators: [
        { name: 'Cenário', value: apiData.scenarioDescription, icon: 'Info' },
        // TODO: Backend could return these dynamically in the future
      ],
    },
    period: `${apiData.startYear} a ${apiData.endYear}`,
  };
};

/**
 * Serviço de competições — busca rodadas da API.
 */
export const competitionService = {
  /** Retorna a rodada ativa com todos os ativos e contexto econômico. */
  getActive: async (): Promise<Competition> => {
    const response = await api.get<CompetitionApiResponse>('/api/competitions/active');
    return mapCompetitionResponse(response.data);
  },

  /** Retorna uma rodada específica pelo ID. */
  getById: async (id: string): Promise<Competition> => {
    const response = await api.get<CompetitionApiResponse>(`/api/competitions/${id}`);
    return mapCompetitionResponse(response.data);
  },
};
