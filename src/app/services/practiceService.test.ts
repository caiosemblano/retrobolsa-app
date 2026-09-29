import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from './api';
import { practiceService } from './practiceService';
import { portfolioService } from './portfolioService';

vi.mock('./api', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('practiceService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lista as rodadas convertendo o melhor resultado, que pode faltar', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        { id: 'r1', round: 1, scenarioTitle: null, startYear: 2004, endYear: 2011, assetCount: 12, runs: 0, bestReturn: null },
        { id: 'r2', round: 2, scenarioTitle: 'Nova Matriz', startYear: 2011, endYear: 2014, assetCount: 10, runs: 2, bestReturn: '16.7000' },
      ],
    });

    const { data } = await practiceService.list();

    expect(api.get).toHaveBeenCalledWith('/api/practice');
    expect(data[0]).toMatchObject({ id: 'r1', scenarioTitle: undefined, runs: 0, bestReturn: undefined });
    expect(data[1]).toMatchObject({ id: 'r2', runs: 2, bestReturn: 16.7 });
  });

  it('envia a carteira de treino como lista de alocações e converte o resultado', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { rank: 0, rentability: '16.70', annualReturn: '8.03', portfolioValue: '116700.00', period: '2020-2022' },
    });

    const { data } = await practiceService.practice('r2', { a1: 60000, t1: 40000 });

    expect(api.post).toHaveBeenCalledWith('/api/practice/r2', {
      allocations: [
        { assetId: 'a1', amount: 60000 },
        { assetId: 't1', amount: 40000 },
      ],
    });
    expect(data.rentability).toBe(16.7);
    expect(data.rank).toBe(0);
  });
});

describe('portfolioService.getCurrent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('devolve a carteira enviada na rodada aberta', async () => {
    vi.mocked(api.get).mockResolvedValue({
      status: 200,
      data: { competitionId: 'c1', allocations: [{ assetId: 'a1', amount: '40000.00' }] },
    });

    expect(await portfolioService.getCurrent()).toEqual({ competitionId: 'c1', portfolio: { a1: 40000 } });
  });

  it('sem rodada aberta ou sem carteira enviada (204), devolve null', async () => {
    vi.mocked(api.get).mockResolvedValue({ status: 204, data: '' });

    expect(await portfolioService.getCurrent()).toBeNull();
  });
});
