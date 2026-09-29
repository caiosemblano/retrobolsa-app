import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { TreinoScreen } from './TreinoScreen';
import { practiceService } from '../../services/practiceService';
import { Competition, Result } from '../../types';

vi.mock('../../services/practiceService', () => ({ practiceService: { round: vi.fn(), practice: vi.fn() } }));
const refresh = vi.fn();
vi.mock('../../contexts/ProgressContext', () => ({ useProgress: () => ({ progress: null, refresh }) }));

const rodada: Competition = {
  id: 'r2',
  round: 2,
  status: 'revealed',
  budget: 100000,
  startYear: 2011,
  endYear: 2014,
  scenarioDescription: 'O governo segura os juros e os preços de energia.',
  economicContext: {
    title: 'Nova Matriz Econômica',
    indicators: [{ code: 'SELIC', label: 'Taxa Selic', value: 10.75, unit: '% a.a.', year: 2010 }],
  },
  assets: [
    { id: 'a1', type: 'stock', anonymousName: 'Empresa A', sector: 'Energia' },
    { id: 't1', type: 'bond', anonymousName: 'Título 1', bondType: 'Selic', rate: 0.1075 },
  ],
};

const resultado: Result = {
  rank: 0,
  rentability: -12.4,
  annualReturn: -4.3,
  portfolioValue: 87600,
  chartData: [
    { year: 2011, value: 100000 },
    { year: 2014, value: 87600 },
  ],
  period: '2011-2014',
  revealedAssets: [
    { id: 'a1', type: 'stock', anonymousName: 'Empresa A', realName: 'Eletrobras', amountInvested: 100000, finalValue: 87600, returnPct: -12.4, contribution: -12.4 },
  ],
  benchmarks: [],
  roundStats: { participants: 8, medianReturn: 15.2 },
  tips: [],
};

const renderizar = async () => {
  vi.mocked(practiceService.round).mockResolvedValue({ data: rodada } as never);
  vi.mocked(practiceService.practice).mockResolvedValue({ data: resultado } as never);
  render(
    <MemoryRouter>
      <TreinoScreen rodadaId="r2" onVoltar={vi.fn()} />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { name: 'Monte sua carteira de treino' });
  return userEvent.setup();
};

const alocar = async (user: ReturnType<typeof userEvent.setup>, ativo: string, valor: string) => {
  await user.click(screen.getByRole('button', { name: `Investir em ${ativo}` }));
  const campo = await screen.findByLabelText('Valor a investir (R$)');
  await user.clear(campo);
  await user.type(campo, valor);
  await user.click(screen.getByRole('button', { name: 'Alocar' }));
};

describe('TreinoScreen', () => {
  beforeEach(() => vi.clearAllMocks());

  it('monta a carteira na rodada escolhida, com o cenário da época e sem valer ranking', async () => {
    await renderizar();

    expect(practiceService.round).toHaveBeenCalledWith('r2');
    expect(screen.getByText('Treino · Rodada 2 · 2011–2013')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nova Matriz Econômica' })).toBeInTheDocument();
    expect(screen.getByText('O governo segura os juros e os preços de energia.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Indicadores do ano anterior' })).toHaveTextContent('Taxa Selic: 10,75% a.a.');
    expect(screen.getByText(/não vale para o ranking/)).toBeInTheDocument();
  });

  it('simula na hora, mostra o resultado do treino e atualiza o XP', async () => {
    const user = await renderizar();
    await alocar(user, 'Empresa A', '100000');

    await user.click(screen.getByRole('button', { name: 'Ver resultado do treino' }));

    expect(practiceService.practice).toHaveBeenCalledWith('r2', { a1: 100000 });
    expect(await screen.findByRole('heading', { name: 'Resultado do treino' })).toBeInTheDocument();
    expect(screen.getByText('Não conta para o ranking nem para os pontos.')).toBeInTheDocument();
    expect(screen.getByText('era Eletrobras')).toBeInTheDocument();
    expect(
      screen.getByText('8 carteiras jogaram esta rodada; a do meio rendeu +15,2%. O seu treino ficou abaixo dela.'),
    ).toBeInTheDocument();
    expect(refresh).toHaveBeenCalled();
  });

  it('treinar de novo volta para a montagem com a mesma carteira, para ajustar', async () => {
    const user = await renderizar();
    await alocar(user, 'Empresa A', '60000');
    await user.click(screen.getByRole('button', { name: 'Ver resultado do treino' }));
    await screen.findByRole('heading', { name: 'Resultado do treino' });

    await user.click(screen.getByRole('button', { name: 'Treinar de novo' }));

    await screen.findByRole('heading', { name: 'Monte sua carteira de treino' });
    expect(screen.getByRole('button', { name: 'Alterar valor em Empresa A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remover alocação em Empresa A' })).toBeInTheDocument();
  });
});
