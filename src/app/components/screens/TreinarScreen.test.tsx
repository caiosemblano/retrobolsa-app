import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TreinarScreen } from './TreinarScreen';
import { practiceService } from '../../services/practiceService';
import { PracticeRound } from '../../types';

vi.mock('../../services/practiceService', () => ({ practiceService: { list: vi.fn() } }));

const rodadas: PracticeRound[] = [
  { id: 'r1', round: 1, scenarioTitle: 'Boom das Commodities', startYear: 2004, endYear: 2011, assetCount: 12, runs: 0 },
  { id: 'r2', round: 2, scenarioTitle: 'Nova Matriz Econômica', startYear: 2011, endYear: 2014, assetCount: 10, runs: 3, bestReturn: -4.25 },
];

const renderizar = async (dados: PracticeRound[]) => {
  vi.mocked(practiceService.list).mockResolvedValue({ data: dados } as never);
  const onEscolher = vi.fn();
  render(<TreinarScreen onEscolher={onEscolher} onBack={vi.fn()} />);
  await screen.findByRole('heading', { name: 'Treinar com rodadas passadas' });
  return { onEscolher, user: userEvent.setup() };
};

describe('TreinarScreen', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lista as rodadas passadas com o período vivido e os treinos do jogador', async () => {
    await renderizar(rodadas);

    const itens = await screen.findAllByRole('listitem');
    expect(itens).toHaveLength(2);
    expect(itens[0]).toHaveTextContent('Rodada 1 · 2004–2010');
    expect(itens[0]).toHaveTextContent('Boom das Commodities');
    expect(itens[0]).toHaveTextContent('12 ativos para escolher');
    expect(itens[0]).toHaveTextContent('Você ainda não treinou nesta rodada');
    // "2011-2014" na API: os anos simulados são 2011, 2012 e 2013.
    expect(itens[1]).toHaveTextContent('Rodada 2 · 2011–2013');
    expect(itens[1]).toHaveTextContent('Você treinou 3 vezes · melhor resultado: -4,3%');
  });

  it('escolher uma rodada abre o treino dela', async () => {
    const { onEscolher, user } = await renderizar(rodadas);

    const segunda = (await screen.findAllByRole('listitem'))[1];
    await user.click(within(segunda).getByRole('button', { name: 'Treinar a rodada 2' }));
    expect(onEscolher).toHaveBeenCalledWith('r2');
  });

  it('sem rodadas encerradas, explica quando elas aparecem', async () => {
    await renderizar([]);
    expect(await screen.findByText(/Ainda não há rodadas encerradas para treinar/)).toBeInTheDocument();
  });
});
