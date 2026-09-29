import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResumoCarteira, resumirCarteira } from './ResumoCarteira';
import { Asset } from '../types';

const ativos: Asset[] = [
  { id: 'a', type: 'stock', anonymousName: 'Empresa A' },
  { id: 'b', type: 'stock', anonymousName: 'Empresa B' },
  { id: 't', type: 'bond', anonymousName: 'Título 1' },
];
const ORCAMENTO = 100000;

describe('resumirCarteira', () => {
  it('separa ações, títulos e dinheiro parado', () => {
    const resumo = resumirCarteira(ativos, { a: 30000, b: 30000, t: 20000 }, ORCAMENTO);

    expect(resumo).toMatchObject({ investido: 80000, emAcoes: 60000, emTitulos: 20000, parado: 20000, quantidade: 3 });
  });

  it('avisa quando tudo está num ativo só', () => {
    const { dicas } = resumirCarteira(ativos, { a: 100000 }, ORCAMENTO);
    expect(dicas).toContain('Toda a carteira está em um único ativo: se ele for mal, não há outro para compensar.');
  });

  it('avisa quando mais de 60% está num ativo, mas não em carteira equilibrada', () => {
    expect(resumirCarteira(ativos, { a: 70000, t: 30000 }, ORCAMENTO).dicas[0]).toMatch(/^70% do que você investiu está num só ativo/);
    expect(resumirCarteira(ativos, { a: 40000, b: 30000, t: 30000 }, ORCAMENTO).dicas).toEqual([]);
  });

  it('descreve carteira só de ações e só de títulos', () => {
    expect(resumirCarteira(ativos, { a: 50000, b: 50000 }, ORCAMENTO).dicas).toContain(
      'Só ações: a chance de ganhar muito é maior, e a de perder também.',
    );
    expect(resumirCarteira(ativos, { t: 100000 }, ORCAMENTO).dicas).toContain(
      'Só títulos: a carteira oscila menos, mas tende a ganhar menos quando a bolsa sobe.',
    );
  });

  it('avisa que o dinheiro não investido fica parado (o motor não rende o caixa)', () => {
    const { dicas } = resumirCarteira(ativos, { a: 30000, b: 30000, t: 30000 }, ORCAMENTO);
    expect(dicas).toContain('R$ 10.000 vão ficar parados e não rendem nada durante a rodada.');
  });

  it('ignora alocação em ativo que não está na rodada', () => {
    expect(resumirCarteira(ativos, { outro: 50000 }, ORCAMENTO).investido).toBe(0);
  });
});

describe('ResumoCarteira', () => {
  it('não aparece antes de investir', () => {
    const { container } = render(<ResumoCarteira assets={ativos} portfolio={{}} budget={ORCAMENTO} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('mostra a divisão da carteira e as dicas', () => {
    render(<ResumoCarteira assets={ativos} portfolio={{ a: 60000, t: 20000 }} budget={ORCAMENTO} />);

    expect(screen.getByRole('heading', { name: 'Sua carteira: 2 ativos' })).toBeInTheDocument();
    expect(screen.getByText('Ações:').parentElement).toHaveTextContent('Ações: 60%');
    expect(screen.getByText('Títulos:').parentElement).toHaveTextContent('Títulos: 20%');
    expect(screen.getByText('Parado:').parentElement).toHaveTextContent('Parado: 20%');
    expect(screen.getByText(/75% do que você investiu está num só ativo/)).toBeInTheDocument();
  });
});
