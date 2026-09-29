import { Card } from './ui/card';
import { RentabilityChart } from './RentabilityChart';
import { ComparacaoReferencias } from './ComparacaoReferencias';
import { ComoFoiARodada, DicasDaRodada, OQueAconteceu, OQueMaisPesou } from './ResultadoDetalhado';
import { Dumbbell, Eye, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { Result } from '../types';
import { formatarNumero } from '../utils/numero';

interface ResultadoViewProps {
  result: Result;
  /** Treino: sem posição no ranking, e a rodada é comparada com as carteiras de quem jogou de verdade. */
  treino?: boolean;
}

/** O resultado completo de uma carteira: placar, gráfico, referências, a revelação e as dicas. */
export function ResultadoView({ result, treino = false }: ResultadoViewProps) {
  const isPositive = result.rentability >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* Placar */}
      <Card className={`rise-in gap-4 p-6 ${isPositive ? 'border-gain/40 glow-primary' : 'border-loss/40 glow-loss'}`}>
        {treino ? (
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-2xl border border-info/30 bg-info-soft text-info"
            >
              <Dumbbell className="size-7" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Treino</div>
              <div className="text-sm text-muted-foreground">Não conta para o ranking nem para os pontos.</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-2xl border border-gold/30 bg-gold-soft text-gold"
            >
              <Trophy className="size-7" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Sua posição</div>
              <div className="tabular font-display text-4xl font-bold text-gold">{result.rank}º</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/70 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <TrendIcon className="size-3.5" aria-hidden="true" />
              Rentabilidade total
            </div>
            <div className={`tabular font-display text-2xl font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {isPositive ? '+' : ''}
              {formatarNumero(result.rentability, 2)}%
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/70 p-3.5">
            <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Retorno anual</div>
            <div className={`tabular font-display text-2xl font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {formatarNumero(result.annualReturn, 2)}% a.a.
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/70 p-3.5">
          <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Valor final</div>
          <div className="tabular font-display text-2xl font-semibold text-foreground">
            R$ {result.portfolioValue.toLocaleString('pt-BR')}
          </div>
        </div>
      </Card>

      <RentabilityChart data={result.chartData} benchmarks={result.benchmarks} />
      <ComparacaoReferencias rentabilidade={result.rentability} benchmarks={result.benchmarks} />

      {/* A revelação */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="size-5 text-gold" aria-hidden="true" />
          <h2 className="font-display text-xl">A revelação</h2>
        </div>

        <OQueMaisPesou ativos={result.revealedAssets} />
        <OQueAconteceu texto={result.debrief} periodo={result.period} />
        <ComoFoiARodada stats={result.roundStats} rentabilidade={result.rentability} treino={treino} />
      </section>

      <DicasDaRodada dicas={result.tips} />
    </div>
  );
}
