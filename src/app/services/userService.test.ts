import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from './api';
import { userService } from './userService';

vi.mock('./api', () => ({
  default: { get: vi.fn() },
}));

const mockedGet = vi.mocked(api.get);

describe('userService.getProfile', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('mapeia o perfil da API para o formato usado nas telas', async () => {
    mockedGet.mockResolvedValue({
      data: {
        username: 'ana',
        email: 'ana@retrobolsa.com',
        role: 'PLAYER',
        totalScore: 46,
        bestRank: 1,
        competitions: 2,
        history: [
          {
            roundNumber: 2,
            scenarioTitle: 'Crise de 2008',
            totalReturn: '26.00',
            finalValue: '126000.00',
            rank: 1,
            submittedAt: '2026-01-02T10:00:00',
          },
        ],
      },
    } as never);

    const { data } = await userService.getProfile();

    expect(mockedGet).toHaveBeenCalledWith('/api/users/profile');
    expect(data.username).toBe('ana');
    expect(data.totalPoints).toBe(46);
    expect(data.bestRank).toBe(1);
    expect(data.completedCompetitions).toBe(2);
    expect(data.history?.[0]).toMatchObject({
      roundNumber: 2,
      scenarioTitle: 'Crise de 2008',
      totalReturn: 26,
      finalValue: 126000,
    });
  });

  it('usa 0 como melhor posição e histórico vazio para quem nunca jogou', async () => {
    mockedGet.mockResolvedValue({
      data: {
        username: 'novato',
        email: 'novato@retrobolsa.com',
        totalScore: 0,
        competitions: 0,
      },
    } as never);

    const { data } = await userService.getProfile();

    expect(data.bestRank).toBe(0);
    expect(data.history).toEqual([]);
  });
});
