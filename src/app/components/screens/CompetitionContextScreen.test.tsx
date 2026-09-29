import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { CompetitionContextScreen } from './CompetitionContextScreen';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types';

vi.mock('../../services/competitionService', () => ({
  competitionService: { getActive: vi.fn() },
}));

const rodada = (indicadores: Competition['economicContext']['indicators']): Competition => ({
  id: 'c1',
  round: 1,
  status: 'open',
  budget: 100000,
  scenarioDescription: 'O Brasil vivia um ciclo virtuoso impulsionado pelas commodities.',
  economicContext: { title: 'O Grande Boom das Commodities (2004–2011)', indicators: indicadores },
  assets: [],
});

const renderizar = async (competition: Competition) => {
  vi.mocked(competitionService.getActive).mockResolvedValue({ data: competition } as never);
  render(
    <MemoryRouter>
      <CompetitionContextScreen onNext={vi.fn()} onBack={vi.fn()} />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { name: 'O Grande Boom das Commodities (2004–2011)' });
};

describe('CompetitionContextScreen', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra os indicadores reais do ano anterior, formatados, com explicação ao toque', async () => {
    const user = userEvent.setup();
    await renderizar(
      rodada([
        { code: 'SELIC', label: 'Taxa Selic', value: 16.5, unit: '% a.a.', year: 2003 },
        { code: 'IPCA', label: 'Inflação (IPCA)', value: 9.3, unit: '% no ano', year: 2003 },
        { code: 'DOLAR', label: 'Dólar', value: 2.8892, unit: 'R$', year: 2003 },
        { code: 'PIB', label: 'Crescimento do PIB', value: 1.14, unit: '% no ano', year: 2003 },
      ]),
    );

    expect(screen.getByText(/Os números de 2003/)).toBeInTheDocument();
    expect(screen.getByText('16,5% a.a.')).toBeInTheDocument();
    expect(screen.getByText('9,3% no ano')).toBeInTheDocument();
    expect(screen.getByText('R$ 2,89')).toBeInTheDocument();
    expect(screen.getByText('1,14% no ano')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'O que é Taxa Selic?' }));
    expect(screen.getByText('A taxa básica de juros do país, definida pelo Banco Central.')).toBeInTheDocument();
  });

  it('sem indicadores, não mostra a seção vazia', async () => {
    await renderizar(rodada([]));
    expect(screen.queryByRole('heading', { name: 'Indicadores econômicos' })).not.toBeInTheDocument();
    expect(screen.getByText(/ciclo virtuoso/)).toBeInTheDocument();
  });
});
