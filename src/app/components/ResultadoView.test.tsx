import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ResultadoView } from './ResultadoView';
import { Result } from '../types';

const resultado = (overrides: Partial<Result> = {}): Result => ({
  rank: 0,
  rentability: 16.7,
  annualReturn: 8.03,
  portfolioValue: 116700,
  chartData: [
    { year: 2020, value: 100000 },
    { year: 2022, value: 116700 },
  ],
  period: '2020-2022',
  revealedAssets: [
    { id: 'a1', type: 'stock', anonymousName: 'Empresa A', realName: 'Vale S.A.', amountInvested: 60000, finalValue: 72600, returnPct: 21, contribution: 12.6 },
  ],
  benchmarks: [],
  roundStats: { participants: 5, medianReturn: 8.25 },
  tips: [],
  ...overrides,
});

const renderizar = (dados: Result, treino?: boolean) =>
  render(
    <MemoryRouter>
      <ResultadoView result={dados} treino={treino} />
    </MemoryRouter>,
  );

describe('ResultadoView', () => {
  it('na rodada de verdade mostra a posição no ranking', () => {
    renderizar(resultado({ rank: 3 }));
    expect(screen.getByText('Sua posição')).toBeInTheDocument();
    expect(screen.getByText('3º')).toBeInTheDocument();
    expect(screen.getByText('5 carteiras; a do meio rendeu +8,3%. A sua ficou acima dela.')).toBeInTheDocument();
  });

  it('o valor final sai sempre com os centavos', () => {
    renderizar(resultado({ portfolioValue: 77512.8 }));
    expect(screen.getByText('R$ 77.512,80')).toBeInTheDocument();
  });

  it('no treino não há posição, e a comparação é com quem jogou a rodada de verdade', () => {
    renderizar(resultado(), true);
    expect(screen.queryByText('Sua posição')).not.toBeInTheDocument();
    expect(screen.getByText('Não conta para o ranking nem para os pontos.')).toBeInTheDocument();
    expect(screen.getByText('+16,7%')).toBeInTheDocument();
    expect(
      screen.getByText('5 carteiras jogaram esta rodada; a do meio rendeu +8,3%. O seu treino ficou acima dela.'),
    ).toBeInTheDocument();
  });

  it('no treino de uma rodada com um só jogador, não diz que a carteira é a dele', () => {
    renderizar(resultado({ roundStats: { participants: 1, medianReturn: 20 } }), true);
    expect(
      screen.getByText('Uma carteira jogou esta rodada e rendeu +20%. O seu treino ficou abaixo dela.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Só a sua carteira participou desta rodada.')).not.toBeInTheDocument();
  });
});
