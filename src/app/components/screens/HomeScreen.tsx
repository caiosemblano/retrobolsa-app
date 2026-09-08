import { useEffect, useState } from 'react';
import { CompetitionCard } from '../CompetitionCard';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { TrendingUp, TrendingDown, Target, Trophy, Wallet, Inbox } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { rankingService } from '../../services/rankingService';
import { useAuth } from '../../contexts/AuthContext';
import { markCurrentUser } from '../../utils/ranking';
import { Competition, RankingEntry, Result } from '../../types';

interface HomeScreenProps {
  onStartCompetition: () => void;
  onViewResults: () => void;
  onViewSimulationStatus: () => void;
}

export function HomeScreen({ onStartCompetition, onViewResults, onViewSimulationStatus }: HomeScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    Promise.allSettled([
      competitionService.getActive().catch(() => competitionService.getLatest()),
      portfolioService.getLastResult(),
      rankingService.get('quinzenal'),
    ]).then(([competitionResponse, resultResponse, rankingResponse]) => {
      if (competitionResponse.status === 'fulfilled') setCompetition(competitionResponse.value.data);
      else setError('Nenhuma competição encontrada.');
      if (resultResponse.status === 'fulfilled') setResult(resultResponse.value.data);
      if (rankingResponse.status === 'fulfilled') setRanking(rankingResponse.value.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4 pb-24">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="mx-auto max-w-4xl p-4 pb-24">
        <Card className="items-center gap-3 p-10 text-center">
          <Inbox className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">{error || 'Nenhuma competição ativa encontrada.'}</p>
        </Card>
      </div>
    );
  }

  const isPositive = result ? result.rentability >= 0 : true;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 pb-24">
      <div>
        <h1 className="font-display text-3xl">Competições</h1>
        <p className="text-muted-foreground">Monte sua carteira e dispute o topo do ranking</p>
      </div>

      <CompetitionCard
        competition={competition}
        onAction={
          competition.status === 'simulated' || competition.status === 'revealed'
            ? onViewResults
            : competition.status === 'closed' || competition.status === 'simulating'
            ? onViewSimulationStatus
            : onStartCompetition
        }
      />

      {result ? (
        <section>
          <div className="mb-4 flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="size-5 text-gain" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-5 text-loss" aria-hidden="true" />
            )}
            <h2 className="font-display text-xl">Seu último resultado</h2>
          </div>

          <Card
            className={`gap-4 p-6 ${isPositive ? 'border-gain/35 glow-primary' : 'border-loss/35 glow-loss'}`}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/70 p-3.5">
                <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  <Target className="size-3.5" aria-hidden="true" />
                  Sua posição
                </div>
                <div className="tabular font-display text-2xl font-semibold text-gold">
                  {result.rank}º
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/70 p-3.5">
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Rentabilidade
                </div>
                <div
                  className={`tabular font-display text-2xl font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}
                >
                  {isPositive ? '+' : ''}
                  {result.rentability}%
                </div>
                <div className="tabular text-xs text-muted-foreground">
                  {result.annualReturn}% a.a.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/70 p-3.5">
              <Wallet className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Valor final da carteira
                </div>
                <div className="tabular font-display text-lg font-semibold text-foreground">
                  R$ {result.portfolioValue.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            <Button onClick={onViewResults} className="w-full" variant={isPositive ? 'default' : 'outline'}>
              Ver detalhes completos
            </Button>
          </Card>
        </section>
      ) : (
        <Card className="items-center gap-2 p-6 text-center">
          <p className="text-muted-foreground text-sm">
            Você ainda não possui um resultado. Submeta uma carteira para participar.
          </p>
        </Card>
      )}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="size-5 text-gold" aria-hidden="true" />
          <h2 className="font-display text-xl">Ranking da rodada</h2>
        </div>
        {ranking.length ? (
          markCurrentUser(ranking.slice(0, 5), user?.username).map((entry) => (
            <RankingItem key={`${entry.rank}-${entry.username}`} entry={entry} showRentability />
          ))
        ) : (
          <Card className="items-center gap-2 p-6 text-center">
            <p className="text-muted-foreground text-sm">Ainda não há participantes classificados.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
