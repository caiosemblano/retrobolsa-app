import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ResultsScreen } from './ResultsScreen';
import { portfolioService } from '../../services/portfolioService';
import { Result } from '../../types';

vi.mock('../../services/portfolioService', () => ({
  portfolioService: { getLastResult: vi.fn() },
}));

const resultado = (overrides: Partial<Result> = {}): Result => ({
  rank: 2,
  rentability: 10.5,
  annualReturn: 5.12,
  portfolioValue: 110500,
  chartData: [
    { year: 2020, value: 100000 },
    { year: 2022, value: 110500 },
  ],
  period: '2020-2022',
  revealedAssets: [
    {
      id: 't1', type: 'bond', anonymousName: 'Título 1', realName: 'Tesouro Selic 2025',
      amountInvested: 40000, finalValue: 38000, returnPct: -5, contribution: -2, revealNote: 'Acompanhou a Selic.',
    },
    {
      id: 'a1', type: 'stock', anonymousName: 'Empresa A', realName: 'Vale S.A.', sector: 'Mineração',
      amountInvested: 60000, finalValue: 72500, returnPct: 20.83, contribution: 12.5,
      revealNote: 'Maior produtora de minério de ferro do mundo.',
    },
  ],
  benchmarks: [],
  roundStats: {
    participants: 5,
    medianReturn: 8.25,
    bestAsset: { anonymousName: 'Empresa C', realName: 'WEG S.A.', returnPct: 425.9 },
  },
  debrief: 'A Selic caiu de 13,75% para 2% ao ano, e a renda fixa passou a render pouco.',
  tips: [
    {
      code: 'PERDEU_PARA_INFLACAO',
      message: 'Sua carteira rendeu 10,5%, menos que a inflação do período (15,0%).',
      moduleId: 'aaaaaaaa-0003-0000-0000-000000000003',
      articleId: 'bbbbbbbb-0008-0000-0000-000000000008',
    },
    { code: 'CONCENTRADA', message: '60% do que você investiu estava em Empresa A.' },
  ],
  ...overrides,
});

const renderizar = async (dados: Result) => {
  vi.mocked(portfolioService.getLastResult).mockResolvedValue({ data: dados } as never);
  render(
    <MemoryRouter>
      <ResultsScreen onViewRanking={vi.fn()} onBack={vi.fn()} />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { name: 'Resultados da rodada' });
};

const secao = (titulo: string) => screen.getByRole('heading', { name: titulo }).closest('[data-slot="card"]') as HTMLElement;

describe('ResultsScreen', () => {
  beforeEach(() => vi.clearAllMocks());

  it('"O que mais pesou" começa pelo ativo que mais somou e explica cada um', async () => {
    await renderizar(resultado());

    const itens = within(secao('O que mais pesou na sua carteira')).getAllByRole('listitem');
    expect(itens[0]).toHaveTextContent('era Vale S.A.');
    expect(itens[0]).toHaveTextContent('+20,8%');
    expect(itens[0]).toHaveTextContent('R$ 60.000 viraram R$ 72.500: somou 12,5 p.p. à carteira.');
    expect(itens[0]).toHaveTextContent('Maior produtora de minério de ferro do mundo.');
    expect(itens[1]).toHaveTextContent('era Tesouro Selic 2025');
    expect(itens[1]).toHaveTextContent('tirou 2 p.p. da carteira.');
  });

  it('conta o que aconteceu de verdade e como foi a rodada', async () => {
    await renderizar(resultado());

    expect(secao('O que aconteceu de verdade')).toHaveTextContent('A Selic caiu de 13,75% para 2% ao ano');
    const rodada = secao('Como foi a rodada');
    expect(rodada).toHaveTextContent('5 carteiras; a do meio rendeu +8,3%. A sua ficou acima dela.');
    expect(rodada).toHaveTextContent('Melhor ativo do período: Empresa C (WEG S.A.), com +426%.');
  });

  it('as dicas levam à aula do assunto quando ela existe', async () => {
    await renderizar(resultado());

    const dicas = within(secao('Para a próxima rodada')).getAllByRole('listitem');
    expect(dicas[0]).toHaveTextContent('menos que a inflação do período');
    expect(within(dicas[0]).getByRole('link', { name: 'Assistir à aula' })).toHaveAttribute(
      'href',
      '/aprender/aaaaaaaa-0003-0000-0000-000000000003/bbbbbbbb-0008-0000-0000-000000000008',
    );
    expect(within(dicas[1]).queryByRole('link')).not.toBeInTheDocument();
  });

  it('antes da revelação não há história nem nomes, e seções vazias não aparecem', async () => {
    await renderizar(resultado({
      debrief: undefined,
      tips: [],
      roundStats: { participants: 0 },
      revealedAssets: [{ id: 'a1', type: 'stock', anonymousName: 'Empresa A', amountInvested: 100000, finalValue: 110500, returnPct: 10.5, contribution: 10.5 }],
    }));

    expect(screen.queryByRole('heading', { name: 'O que aconteceu de verdade' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Como foi a rodada' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Para a próxima rodada' })).not.toBeInTheDocument();
    expect(secao('O que mais pesou na sua carteira')).toHaveTextContent('o nome aparece na revelação');
  });
});
