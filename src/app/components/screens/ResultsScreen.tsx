import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { ResultadoView } from '../ResultadoView';
import { Trophy, ArrowLeft } from 'lucide-react';
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

      <ResultadoView result={result} />

      <Button size="lg" variant="gold" className="w-full" onClick={onViewRanking}>
        <Trophy className="size-5" aria-hidden="true" />
        Ver ranking completo
      </Button>
    </div>
  );
}
