import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from './api';
import { rankingService } from './rankingService';

vi.mock('./api', () => ({
  default: { get: vi.fn() },
}));

const mockedGet = vi.mocked(api.get);

describe('rankingService', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('mapeia totalScore para points no ranking por tipo', async () => {
    mockedGet.mockResolvedValue({
      data: [{ username: 'ana', rank: 1, totalScore: 36 }],
    } as never);

    const { data } = await rankingService.get('season');

    expect(mockedGet).toHaveBeenCalledWith('/api/rankings?type=season');
    expect(data).toEqual([
      { rank: 1, username: 'ana', points: 36, rentability: undefined },
    ]);
  });

  it('usa totalReturn como pontos e rentabilidade quando não há totalScore', async () => {
    mockedGet.mockResolvedValue({
      data: [{ username: 'bruno', rank: 2, totalReturn: '12.40' }],
    } as never);

    const { data } = await rankingService.get('quinzenal');

    expect(data[0].points).toBe(12.4);
    expect(data[0].rentability).toBe(12.4);
  });

  it('pagina o ranking global com page e limit', async () => {
    mockedGet.mockResolvedValue({ data: [] } as never);

    await rankingService.getGlobalPage(2);

    expect(mockedGet).toHaveBeenCalledWith('/api/rankings/global', {
      params: { page: 2, limit: 50 },
    });
  });

  it('mapeia o resumo da posição do usuário autenticado', async () => {
    mockedGet.mockResolvedValue({
      data: {
        username: 'ana',
        globalRank: 7,
        totalGlobalPlayers: 120,
        totalScore: 36,
        competitionsPlayed: 2,
        activeRoundRank: 3,
        activeRoundNumber: 6,
        activeRoundStatus: 'simulated',
      },
    } as never);

    const { data } = await rankingService.getMyRank();

    expect(mockedGet).toHaveBeenCalledWith('/api/rankings/me');
    expect(data.globalRank).toBe(7);
    expect(data.points).toBe(36);
    expect(data.activeRoundRank).toBe(3);
  });

  it('converte campos nulos da rodada ativa em undefined', async () => {
    mockedGet.mockResolvedValue({
      data: {
        username: 'novato',
        globalRank: 99,
        totalGlobalPlayers: 120,
        totalScore: 0,
        competitionsPlayed: 0,
        activeRoundRank: null,
        activeRoundNumber: null,
        activeRoundStatus: null,
      },
    } as never);

    const { data } = await rankingService.getMyRank();

    expect(data.activeRoundRank).toBeUndefined();
    expect(data.activeRoundNumber).toBeUndefined();
  });

  it('busca a temporada atual', async () => {
    mockedGet.mockResolvedValue({
      data: { seasonNumber: 2, roundStart: 5, roundEnd: 8 },
    } as never);

    const { data } = await rankingService.getSeasonInfo();

    expect(mockedGet).toHaveBeenCalledWith('/api/rankings/season/current');
    expect(data).toEqual({ seasonNumber: 2, roundStart: 5, roundEnd: 8 });
  });
});
