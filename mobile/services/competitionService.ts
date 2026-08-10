import api from './api';
import { Competition, CompetitionApiResponse } from '../types';

const mapCompetitionResponse = (apiData: CompetitionApiResponse): Competition => {
  return {
    ...apiData,
    status: apiData.status as 'open' | 'closed' | 'simulating',
    economicContext: {
      title: apiData.scenarioTitle,
      indicators: [
        { name: 'Cenário', value: apiData.scenarioDescription, icon: 'Info' },
      ],
    },
    period: `${apiData.startYear} a ${apiData.endYear}`,
  };
};

export const competitionService = {
  getActive: async (): Promise<Competition> => {
    const response = await api.get<CompetitionApiResponse>('/api/competitions/active');
    return mapCompetitionResponse(response.data);
  },

  getById: async (id: string): Promise<Competition> => {
    const response = await api.get<CompetitionApiResponse>(`/api/competitions/${id}`);
    return mapCompetitionResponse(response.data);
  },

  nextRound: async (): Promise<void> => {
    await api.post('/api/competitions/admin/next-round');
  },

  resetGame: async (): Promise<void> => {
    await api.post('/api/competitions/admin/reset');
  },
};
