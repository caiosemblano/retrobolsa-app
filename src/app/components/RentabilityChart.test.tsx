import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { RentabilityChart, juntarSeries } from './RentabilityChart';
import { ComparacaoReferencias, diferenca } from './ComparacaoReferencias';
import { Benchmark } from '../types';

const carteira = [
  { year: 2020, value: 100000 },
  { year: 2021, value: 104000 },
  { year: 2022, value: 110500 },
];

const referencia = (code: string, name: string, totalReturn: number, valores: number[]): Benchmark => ({
  code,
  name,
  totalReturn,
  chartData: valores.map((value, i) => ({ year: 2020 + i, value })),
});

const referencias = [
  referencia('CDI', 'CDI', 7.31, [100000, 102750, 107312]),
  referencia('POUPANCA', 'Poupança', 5.16, [100000, 102110, 105163]),
  referencia('IBOVESPA', 'Ibovespa', -9.61, [100000, 102880, 90390]),
  referencia('IPCA', 'Inflação (IPCA)', 15.03, [100000, 104520, 115035]),
];

const renderizar = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('RentabilityChart', () => {
  it('junta a carteira e as referências por ano, como o gráfico espera', () => {
    expect(juntarSeries(carteira, referencias.slice(0, 1))).toEqual([
      { year: 2020, carteira: 100000, CDI: 100000 },
      { year: 2021, carteira: 104000, CDI: 102750 },
      { year: 2022, carteira: 110500, CDI: 107312 },
    ]);
  });

  it('a legenda mostra a carteira e as referências do gráfico (a poupança fica só na lista)', () => {
    renderizar(<RentabilityChart data={carteira} benchmarks={referencias} />);

    const legenda = screen.getByRole('list', { name: 'Legenda do gráfico' });
    expect(within(legenda).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Sua carteira',
      'CDI',
      'Ibovespa',
      'Inflação (IPCA)',
    ]);
    // Cada referência explica a si mesma.
    expect(within(legenda).getByRole('button', { name: 'O que é CDI?' })).toBeInTheDocument();
    expect(screen.getByText(/Seus R\$ 100\.000 viraram R\$ 110\.500/)).toBeInTheDocument();
  });

  it('sem referências, é o gráfico de antes, sem legenda', () => {
    renderizar(<RentabilityChart data={carteira} />);

    expect(screen.queryByRole('list', { name: 'Legenda do gráfico' })).not.toBeInTheDocument();
    expect(screen.getByText('De R$ 100.000 a R$ 110.500 no período simulado.')).toBeInTheDocument();
  });
});

describe('ComparacaoReferencias', () => {
  it('mostra quanto cada referência rendeu e quanto a carteira ficou acima ou abaixo', () => {
    renderizar(<ComparacaoReferencias rentabilidade={10.5} benchmarks={referencias} />);

    const linha = (nome: RegExp) => screen.getByRole('rowheader', { name: nome }).closest('tr')!;
    expect(linha(/Sua carteira/)).toHaveTextContent('+10,5%');
    expect(linha(/CDI/)).toHaveTextContent('+7,3%');
    expect(linha(/CDI/)).toHaveTextContent('você: 3,2 p.p. acima');
    expect(linha(/Ibovespa/)).toHaveTextContent('-9,6%');
    expect(linha(/Inflação/)).toHaveTextContent('você: 4,5 p.p. abaixo');
  });

  it('sem referências, não aparece', () => {
    const { container } = renderizar(<ComparacaoReferencias rentabilidade={10} benchmarks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calcula a diferença em pontos percentuais', () => {
    expect(diferenca(10.5, 7.31)).toEqual({ texto: '3,2 p.p. acima', acima: true });
    expect(diferenca(-5, 15.03)).toEqual({ texto: '20 p.p. abaixo', acima: false });
    expect(diferenca(7, 7)).toEqual({ texto: '0 p.p. acima', acima: true });
  });
});
