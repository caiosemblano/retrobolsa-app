import api from './api';
import { UserProfile } from '../types';

export const userService = {
  getProfile: async () => {
    // Simulando uma requisição à API (pois o backend ainda não tem o endpoint /api/users/profile)
    return new Promise<{ data: UserProfile }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 1,
            username: 'testuser',
            email: 'test@gmail.com',
            totalPoints: 1250,
            bestRank: 5,
            completedCompetitions: 3,
            favoriteAsset: 'PETR4',
            achievements: [
              {
                id: '1',
                title: 'Primeiros Passos',
                description: 'Realizou seu primeiro investimento simulado.',
                iconName: 'Star',
                dateEarned: '2026-08-01',
              },
              {
                id: '2',
                title: 'Top 10',
                description: 'Ficou no Top 10 de uma competição semanal.',
                iconName: 'Trophy',
                dateEarned: '2026-08-05',
              },
            ],
          },
        });
      }, 800);
    });
  },
};
