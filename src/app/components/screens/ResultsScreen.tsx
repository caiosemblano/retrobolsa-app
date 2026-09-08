import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { RentabilityChart } from '../RentabilityChart';
import { Trophy, TrendingUp, TrendingDown, Eye, Award, ArrowLeft } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { Result } from '../../types';

interface ResultsScreenProps { onViewRanking: () => void; onBack: () => void; }

export function ResultsScreen({ onViewRanking, onBack }: ResultsScreenProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioService.getLastResult().then((response) => setResult(response.data)).catch(() => undefined).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-muted-foreground">
        O resultado ainda não está disponível.
      </div>
    );
  }

  const isPositive = result.rentability >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Button>

      <div>
        <h1 className="font-display text-3xl">Resultados da rodada</h1>
        <p className="text-muted-foreground">Veja como sua carteira performou</p>
      </div>

      {/* Placar */}
      <Card className={`rise-in gap-4 p-6 ${isPositive ? 'border-gain/40 glow-primary' : 'border-loss/40 glow-loss'}`}>
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

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/70 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <TrendIcon className="size-3.5" aria-hidden="true" />
              Rentabilidade total
            </div>
            <div className={`tabular font-display text-2xl font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {isPositive ? '+' : ''}
              {result.rentability}%
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/70 p-3.5">
            <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Retorno anual</div>
            <div className={`tabular font-display text-2xl font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {result.annualReturn}% a.a.
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

      <RentabilityChart data={result.chartData} />

      {/* A revelação */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="size-5 text-gold" aria-hidden="true" />
          <h2 className="font-display text-xl">A revelação</h2>
        </div>

        <Card className="gap-3 border-gold/30 p-6">
          <h3 className="font-display text-lg">Sua carteira revelada</h3>
          {result.revealedAssets.length ? (
            <div className="space-y-3">
              {result.revealedAssets.map((asset) => (
                <div key={asset.id} className="rounded-xl border border-border bg-muted/70 p-4">
                  <div className="mb-1 text-sm text-muted-foreground">
                    Você investiu em “{asset.anonymousName}”
                  </div>
                  <div className="flex items-center gap-2 font-display font-semibold text-gold">
                    <TrendingUp className="size-4 shrink-0" aria-hidden="true" />
                    <span>{asset.realName ? `era ${asset.realName}` : 'nome ainda não revelado'}</span>
                  </div>
                  {asset.sector && (
                    <Badge variant="secondary" className="mt-2">
                      {asset.sector}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Os ativos serão revelados ao final da rodada.</p>
          )}
        </Card>

        <Card className="gap-2 p-4">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-info" aria-hidden="true" />
            <h4 className="font-display">Período simulado</h4>
          </div>
          <p className="text-muted-foreground">
            Período histórico: <span className="tabular text-info">{result.period}</span>.
          </p>
        </Card>
      </section>

      <Button size="lg" variant="gold" className="w-full" onClick={onViewRanking}>
        <Trophy className="size-5" aria-hidden="true" />
        Ver ranking completo
      </Button>
    </div>
  );
}
