import { useEffect, useState } from 'react';
import { CompetitionCard } from '../CompetitionCard';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { TrendingUp, Target } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { rankingService } from '../../services/rankingService';
import { userService } from '../../services/userService';
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
  const [myUsername, setMyUsername] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getProfile().then((response) => setMyUsername(response.data.username)).catch(() => undefined);
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

  if (loading) return <div className="p-8 text-center text-slate-600">Carregando competição...</div>;
  if (error || !competition) {
    return <div className="max-w-4xl mx-auto p-4 text-center text-slate-600">{error || 'Nenhuma competição ativa encontrada.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Competições</h1>
        <p className="text-slate-600">Participe e teste suas estratégias de investimento</p>
      </div>
      <div className="mb-8">
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
      </div>
      <Separator className="my-8" />
      {result ? (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-green-600" /><h2 className="text-slate-900">Seu Último Resultado</h2></div>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><div className="text-slate-600 text-sm mb-1">Sua Posição</div><div className="text-green-700 flex items-center gap-2"><Target className="w-5 h-5" /><span>{result.rank}º lugar</span></div></div>
                <div><div className="text-slate-600 text-sm mb-1">Rentabilidade</div><div className="text-green-700">{result.rentability}% ({result.annualReturn}% a.a.)</div></div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg mb-4"><div className="text-slate-600 text-sm mb-1">Valor Final da Carteira</div><div className="text-green-800">R$ {result.portfolioValue.toLocaleString('pt-BR')}</div></div>
              <button onClick={onViewResults} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">Ver Detalhes Completos</button>
            </Card>
          </div>
          <Separator className="my-8" />
        </>
      ) : <p className="mb-8 text-sm text-slate-500">Você ainda não possui um resultado. Submeta uma carteira para participar.</p>}
      <div>
        <h2 className="text-slate-900 mb-4">Ranking da Rodada</h2>
        {ranking.length ? ranking.slice(0, 5).map((entry) => (
          <RankingItem
            key={`${entry.rank}-${entry.username}`}
            entry={{ ...entry, isCurrentUser: entry.username === myUsername }}
            showRentability
          />
        )) : <p className="text-slate-500">Ainda não há participantes classificados.</p>}
      </div>
    </div>
  );
}
