import { describe, expect, it } from 'vitest';
import { mapResult } from './portfolioService';

const resposta = {
  rank: 2,
  rentability: '10.50',
  annualReturn: '5.12',
  portfolioValue: '110500.00',
  chartData: [
    { year: 2020, value: '100000.00' },
    { year: 2021, value: '105000.00' },
  ],
  revealedAssets: [
    {
      id: 'a1',
      anonymousName: 'Empresa A',
      realName: 'Vale S.A.',
      type: 'stock',
      amountInvested: '50000.00',
      finalValue: '60500.00',
      returnPct: '21.00',
      contribution: '10.50',
      revealNote: 'Maior produtora de minério de ferro do mundo.',
    },
    { id: 't1', anonymousName: 'Título 1', type: 'bond', amountInvested: '10', finalValue: '11', revealNote: null },
  ],
  period: '2020-2022',
  benchmarks: [{ code: 'CDI', name: 'CDI', totalReturn: '7.31', chartData: [{ year: 2020, value: '100000.00' }] }],
  roundStats: {
    participants: 3,
    medianReturn: '8.25',
    bestAsset: { anonymousName: 'Empresa A', realName: null, returnPct: '21.00' },
  },
  debrief: null,
  tips: [{ code: 'VENCEU_CDI', message: 'Sua carteira rendeu 10,5%...', moduleId: null, articleId: null }],
};

describe('mapResult', () => {
  it('converte os números e traz referências, estatísticas e dicas', () => {
    const resultado = mapResult(resposta as never);

    expect(resultado.rentability).toBe(10.5);
    expect(resultado.chartData).toEqual([{ year: 2020, value: 100000 }, { year: 2021, value: 105000 }]);
    expect(resultado.benchmarks).toEqual([
      { code: 'CDI', name: 'CDI', totalReturn: 7.31, chartData: [{ year: 2020, value: 100000 }] },
    ]);
    expect(resultado.roundStats).toEqual({
      participants: 3,
      medianReturn: 8.25,
      bestAsset: { anonymousName: 'Empresa A', realName: undefined, returnPct: 21 },
    });
    expect(resultado.debrief).toBeUndefined();
    expect(resultado.tips).toEqual([
      { code: 'VENCEU_CDI', message: 'Sua carteira rendeu 10,5%...', moduleId: undefined, articleId: undefined },
    ]);
  });

  it('traz o rendimento, a contribuição e a frase de cada ativo', () => {
    const [vale, titulo] = mapResult(resposta as never).revealedAssets;

    expect(vale).toMatchObject({ returnPct: 21, contribution: 10.5, revealNote: 'Maior produtora de minério de ferro do mundo.' });
    expect(titulo.returnPct).toBeUndefined();
    expect(titulo.revealNote).toBeUndefined();
  });

  it('resposta antiga, sem os campos novos, continua funcionando', () => {
    const { benchmarks, roundStats, tips, debrief, ...antiga } = resposta;
    const resultado = mapResult(antiga as never);

    expect(resultado.benchmarks).toEqual([]);
    expect(resultado.tips).toEqual([]);
    expect(resultado.roundStats).toBeUndefined();
  });
});
