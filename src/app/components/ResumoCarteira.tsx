import { Lightbulb } from 'lucide-react';
import { Asset, Portfolio } from '../types';
import { Card } from './ui/card';
import { formatarPercentual } from '../utils/numero';

export interface Resumo {
  investido: number;
  emAcoes: number;
  emTitulos: number;
  parado: number;
  quantidade: number;
  dicas: string[];
}

const reais = (valor: number) => `R$ ${valor.toLocaleString('pt-BR')}`;

/**
 * Como a carteira está distribuída e o que vale a pena notar. As dicas descrevem
 * a carteira sem dizer o que comprar: a decisão continua sendo do aluno.
 */
export function resumirCarteira(assets: Asset[], portfolio: Portfolio, budget: number): Resumo {
  const alocacoes = assets
    .map((asset) => ({ asset, valor: portfolio[asset.id] || 0 }))
    .filter(({ valor }) => valor > 0);
  const investido = alocacoes.reduce((soma, { valor }) => soma + valor, 0);
  const emAcoes = alocacoes.filter(({ asset }) => asset.type === 'stock').reduce((s, { valor }) => s + valor, 0);
  const emTitulos = investido - emAcoes;
  const parado = Math.max(budget - investido, 0);
  const maior = alocacoes.reduce((max, { valor }) => Math.max(max, valor), 0);

  const dicas: string[] = [];
  if (alocacoes.length === 1) {
    dicas.push('Toda a carteira está em um único ativo: se ele for mal, não há outro para compensar.');
  } else if (investido > 0 && maior / investido > 0.6) {
    dicas.push(
      `${formatarPercentual((maior / investido) * 100, 0)} do que você investiu está num só ativo: se ele for mal, a carteira inteira sente.`,
    );
  }
  if (emAcoes > 0 && emTitulos === 0) {
    dicas.push('Só ações: a chance de ganhar muito é maior, e a de perder também.');
  } else if (emTitulos > 0 && emAcoes === 0) {
    dicas.push('Só títulos: a carteira oscila menos, mas tende a ganhar menos quando a bolsa sobe.');
  }
  if (investido > 0 && parado > 0) {
    dicas.push(`${reais(parado)} vão ficar parados e não rendem nada durante a rodada.`);
  }

  return { investido, emAcoes, emTitulos, parado, quantidade: alocacoes.length, dicas };
}

interface ResumoCarteiraProps {
  assets: Asset[];
  portfolio: Portfolio;
  budget: number;
}

export function ResumoCarteira({ assets, portfolio, budget }: ResumoCarteiraProps) {
  const resumo = resumirCarteira(assets, portfolio, budget);
  if (resumo.investido === 0) return null;

  const fatias = [
    { rotulo: 'Ações', valor: resumo.emAcoes, cor: 'bg-info' },
    { rotulo: 'Títulos', valor: resumo.emTitulos, cor: 'bg-gain' },
    { rotulo: 'Parado', valor: resumo.parado, cor: 'bg-muted-foreground/40' },
  ].filter(({ valor }) => valor > 0);

  return (
    <Card className="gap-3 p-4" aria-labelledby="resumo-carteira-titulo">
      <h2 id="resumo-carteira-titulo" className="font-display text-base">
        Sua carteira: {resumo.quantidade} {resumo.quantidade === 1 ? 'ativo' : 'ativos'}
      </h2>

      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        {fatias.map(({ rotulo, valor, cor }) => (
          <div key={rotulo} className={cor} style={{ width: `${(valor / budget) * 100}%` }} />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {fatias.map(({ rotulo, valor, cor }) => (
          <li key={rotulo} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${cor}`} aria-hidden="true" />
            {rotulo}: <span className="tabular font-semibold">{formatarPercentual((valor / budget) * 100, 0)}</span>
          </li>
        ))}
      </ul>

      {resumo.dicas.length > 0 && (
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {resumo.dicas.map((dica) => (
            <li key={dica} className="flex gap-2">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{dica}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
