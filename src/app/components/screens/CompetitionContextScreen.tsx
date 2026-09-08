import { useEffect, useState } from 'react';
import { EconomicIndicatorCard } from '../EconomicIndicatorCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types';

interface CompetitionContextScreenProps { onNext: () => void; onBack: () => void; }

export function CompetitionContextScreen({ onNext, onBack }: CompetitionContextScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    competitionService.getActive().then((response) => setCompetition(response.data)).catch(() => undefined).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-muted-foreground">
        Não foi possível carregar o contexto da rodada.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Button>

      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-info/30 bg-info-soft text-info"
        >
          <FileText className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight">{competition.economicContext.title}</h1>
          <p className="text-muted-foreground text-sm">Analise o contexto antes de escolher seus ativos</p>
        </div>
      </div>

      <Card className="gap-2 border-info/30 p-6 glow-info">
        <h2 className="font-display text-lg">Contexto histórico anônimo</h2>
        <p className="max-w-prose text-muted-foreground">
          {competition.scenarioDescription || 'Use os dados da rodada para montar sua carteira.'}
        </p>
      </Card>

      <section>
        <h2 className="mb-4 font-display text-xl">Indicadores econômicos</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {competition.economicContext.indicators.map((indicator, index) => (
            <EconomicIndicatorCard key={index} indicator={indicator} />
          ))}
        </div>
      </section>

      <Button size="lg" className="w-full" onClick={onNext}>
        Escolher ativos
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
