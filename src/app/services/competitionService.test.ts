import { describe, expect, it } from 'vitest';
import { mapCompetition } from './competitionService';

const rodada = {
  id: 'c1',
  round: 1,
  status: 'open',
  budget: '100000.00',
  scenarioTitle: 'O Grande Boom das Commodities (2004–2011)',
  scenarioDescription: 'O Brasil vivia um ciclo virtuoso...',
  startYear: 2004,
  endYear: 2011,
  economicIndicators: [
    { code: 'SELIC', label: 'Taxa Selic', value: '16.50', unit: '% a.a.', year: 2003 },
    { code: 'DOLAR', label: 'Dólar', value: 2.8892, unit: 'R$', year: 2003 },
  ],
  assets: [
    {
      id: 'a1',
      type: 'stock',
      anonymousName: 'Empresa A',
      indicators: { pl: '8.30', roe: '32.10', dividendYield: '4.20', lvp: '2.66' },
    },
    { id: 't1', type: 'bond', anonymousName: 'Título 1', bondType: 'Prefixado', rate: '0.1650', indicators: null },
  ],
};

describe('mapCompetition', () => {
  it('traz os indicadores econômicos reais como números', () => {
    const { economicContext } = mapCompetition(rodada as never);

    expect(economicContext.title).toBe('O Grande Boom das Commodities (2004–2011)');
    expect(economicContext.indicators).toEqual([
      { code: 'SELIC', label: 'Taxa Selic', value: 16.5, unit: '% a.a.', year: 2003 },
      { code: 'DOLAR', label: 'Dólar', value: 2.8892, unit: 'R$', year: 2003 },
    ]);
  });

  it('não transforma mais a descrição do cenário em indicador', () => {
    const { economicContext } = mapCompetition({ ...rodada, economicIndicators: undefined } as never);
    expect(economicContext.indicators).toEqual([]);
  });

  it('converte ROE e Dividend Yield das ações', () => {
    const [acao, titulo] = mapCompetition(rodada as never).assets;

    expect(acao.indicators).toMatchObject({ pl: 8.3, roe: 32.1, dividendYield: 4.2, lvp: 2.66 });
    expect(titulo.indicators).toBeUndefined();
    expect(titulo.rate).toBe(0.165);
  });
});
