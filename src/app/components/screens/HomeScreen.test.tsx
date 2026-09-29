import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { HomeScreen } from './HomeScreen';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { rankingService } from '../../services/rankingService';
import { Competition, Result } from '../../types';

vi.mock('../../services/competitionService', () => ({ competitionService: { getActive: vi.fn(), getLatest: vi.fn() } }));
vi.mock('../../services/portfolioService', () => ({ portfolioService: { getLastResult: vi.fn() } }));
vi.mock('../../services/rankingService', () => ({ rankingService: { get: vi.fn() } }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ user: { username: 'ana' } }) }));

const rodada: Competition = {
  id: 'c1', round: 1, status: 'revealed', budget: 100000, assets: [],
  economicContext: { title: 'Boom das Commodities', indicators: [] },
};

const resultado = (rentability: number, cdi?: number): Result => ({
  rank: 1, rentability, annualReturn: 5, portfolioValue: 100000 + rentability * 1000, chartData: [],
  revealedAssets: [], period: '2020-2022', tips: [],
  benchmarks: cdi === undefined ? [] : [{ code: 'CDI', name: 'CDI', totalReturn: cdi, chartData: [] }],
});

const renderizar = async (dados: Result) => {
  vi.mocked(competitionService.getActive).mockResolvedValue({ data: rodada } as never);
  vi.mocked(portfolioService.getLastResult).mockResolvedValue({ data: dados } as never);
  vi.mocked(rankingService.get).mockResolvedValue({ data: [] } as never);
  render(
    <MemoryRouter>
      <HomeScreen onStartCompetition={vi.fn()} onViewResults={vi.fn()} onViewSimulationStatus={vi.fn()} />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { name: 'Seu último resultado' });
};

describe('HomeScreen: último resultado', () => {
  beforeEach(() => vi.clearAllMocks());

  it('compara com o CDI', async () => {
    await renderizar(resultado(10.5, 7.31));
    expect(screen.getByText(/Você ×/)).toHaveTextContent('Você × CDI: 3,2 p.p. acima (o CDI rendeu 7,3% no período)');
  });

  it('abaixo do CDI também aparece', async () => {
    await renderizar(resultado(-4, 12));
    expect(screen.getByText(/Você ×/)).toHaveTextContent('16 p.p. abaixo');
  });

  it('sem CDI (rodada sem dados), a linha não aparece', async () => {
    await renderizar(resultado(10));
    expect(screen.queryByText(/Você ×/)).not.toBeInTheDocument();
  });
});
