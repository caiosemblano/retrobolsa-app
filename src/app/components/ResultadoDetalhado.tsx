import { Link } from 'react-router';
import { BookOpenText, Lightbulb, PlayCircle, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Asset, RoundStats, Tip } from '../types';
import { formatarNumero } from '../utils/numero';
import { rotas } from '../routes';

const pct = (valor: number, casas = 1) => `${valor > 0 ? '+' : ''}${formatarNumero(valor, casas)}%`;
const reais = (valor: number) => `R$ ${Math.round(valor).toLocaleString('pt-BR')}`;

/**
 * A API manda "2011-2014": o motor simula de 2011 até o fim de 2013, e 2014 é só o
 * ponto final do gráfico. Para o aluno, os anos vividos são 2011–2013, como no título da rodada.
 */
export function anosSimulados(periodo: string): string {
  const anos = periodo.match(/^(\d{4})-(\d{4})$/);
  if (!anos) return periodo;
  const [inicio, fim] = [Number(anos[1]), Number(anos[2]) - 1];
  return fim > inicio ? `${inicio}–${fim}` : `${inicio}`;
}

function comparacaoComAMediana(stats: RoundStats, rentabilidade: number): string | null {
  if (stats.medianReturn === undefined || stats.participants === 0) return null;
  if (stats.participants === 1) return 'Só a sua carteira participou desta rodada.';
  const posicao =
    rentabilidade > stats.medianReturn ? 'acima dela' : rentabilidade < stats.medianReturn ? 'abaixo dela' : 'exatamente nela';
  return `${stats.participants} carteiras; a do meio rendeu ${pct(stats.medianReturn)}. A sua ficou ${posicao}.`;
}

/** Cada ativo da carteira, do que mais somou ao que mais tirou, com o nome real e o que aconteceu com ele. */
export function OQueMaisPesou({ ativos }: { ativos: Asset[] }) {
  const ordenados = [...ativos].sort((a, b) => (b.contribution ?? 0) - (a.contribution ?? 0));

  return (
    <Card className="gap-3 border-gold/30 p-6">
      <h3 className="font-display text-lg">O que mais pesou na sua carteira</h3>
      {ordenados.length ? (
        <ul className="space-y-3">
          {ordenados.map((ativo) => {
            const subiu = (ativo.returnPct ?? 0) >= 0;
            const contribuicao = ativo.contribution ?? 0;
            return (
              <li key={ativo.id} className="rounded-xl border border-border bg-muted/70 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <div>
                    <div className="text-sm text-muted-foreground">Você investiu em “{ativo.anonymousName}”</div>
                    <div className="font-display font-semibold text-gold">
                      {ativo.realName ? `era ${ativo.realName}` : 'o nome aparece na revelação'}
                    </div>
                  </div>
                  {ativo.returnPct !== undefined && (
                    <span className={`tabular font-display text-lg font-semibold ${subiu ? 'text-gain' : 'text-loss'}`}>
                      {pct(ativo.returnPct)}
                    </span>
                  )}
                </div>
                <p className="tabular mt-1 text-sm text-muted-foreground">
                  {reais(ativo.amountInvested ?? 0)} viraram {reais(ativo.finalValue ?? 0)}:{' '}
                  {contribuicao >= 0 ? 'somou' : 'tirou'} {formatarNumero(Math.abs(contribuicao), 1)} p.p.{' '}
                  {contribuicao >= 0 ? 'à' : 'da'} carteira.
                </p>
                {ativo.revealNote && <p className="mt-2 text-sm">{ativo.revealNote}</p>}
                {ativo.sector && (
                  <Badge variant="secondary" className="mt-2">
                    {ativo.sector}
                  </Badge>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground">Os ativos serão revelados ao final da rodada.</p>
      )}
    </Card>
  );
}

/** O que aconteceu de verdade no período (só vem da API depois da revelação). */
export function OQueAconteceu({ texto, periodo }: { texto?: string; periodo: string }) {
  if (!texto) return null;
  return (
    <Card className="gap-2 border-info/30 p-6">
      <div className="flex items-center gap-2">
        <BookOpenText className="size-5 text-info" aria-hidden="true" />
        <h3 className="font-display text-lg">O que aconteceu de verdade</h3>
      </div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Período {anosSimulados(periodo)}</p>
      <p className="max-w-prose leading-relaxed">{texto}</p>
    </Card>
  );
}

/** Como foi a rodada para todos: mediana e o melhor ativo, para se situar além da posição. */
export function ComoFoiARodada({ stats, rentabilidade }: { stats?: RoundStats; rentabilidade: number }) {
  if (!stats || (stats.participants === 0 && !stats.bestAsset)) return null;
  const melhor = stats.bestAsset;
  const mediana = comparacaoComAMediana(stats, rentabilidade);

  return (
    <Card className="gap-2 p-6">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-info" aria-hidden="true" />
        <h3 className="font-display text-lg">Como foi a rodada</h3>
      </div>
      <ul className="space-y-1.5 text-sm">
        {mediana && <li className="tabular">{mediana}</li>}
        {melhor && (
          <li>
            Melhor ativo do período:{' '}
            <span className="font-semibold">
              {melhor.anonymousName}
              {melhor.realName ? ` (${melhor.realName})` : ''}
            </span>
            , com <span className="tabular font-semibold">{pct(melhor.returnPct, 0)}</span>. Ninguém sabia disso no começo: é
            por isso que se diversifica.
          </li>
        )}
      </ul>
    </Card>
  );
}

/** As lições da carteira, cada uma com a aula do assunto quando ela existe. */
export function DicasDaRodada({ dicas }: { dicas: Tip[] }) {
  if (!dicas.length) return null;

  return (
    <Card className="gap-3 border-gold/30 p-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-5 text-gold" aria-hidden="true" />
        <h3 className="font-display text-lg">Para a próxima rodada</h3>
      </div>
      <ul className="space-y-3">
        {dicas.map((dica) => (
          <li key={dica.code} className="rounded-xl border border-border bg-muted/70 p-4">
            <p className="text-sm leading-relaxed">{dica.message}</p>
            {dica.moduleId && dica.articleId && (
              <Link
                to={rotas.aula(dica.moduleId, dica.articleId)}
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PlayCircle className="size-4" aria-hidden="true" />
                Assistir à aula
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
