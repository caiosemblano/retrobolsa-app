import { useEffect, useState } from 'react';
import { CompetitionCard } from '../CompetitionCard';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { TrendingUp, Target, Loader2, AlertCircle } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { rankingService } from '../../services/rankingService';
import { Competition, Result, RankingEntry } from '../../types';

interface HomeScreenProps {
  onStartCompetition: (comp: Competition) => void;
  onViewResults: () => void;
}

export function HomeScreen({ onStartCompetition, onViewResults }: HomeScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [topRanking, setTopRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [compRes, resultRes, rankingRes] = await Promise.all([
          competitionService.getActive().catch(() => null),
          portfolioService.getLastResult().then(res => res.data).catch(() => null),
          rankingService.get('quinzenal').then(res => res.data).catch(() => [])
        ]);

        if (compRes) setCompetition(compRes);
        if (resultRes) setLastResult(resultRes);
        setTopRanking(rankingRes.slice(0, 5));
      } catch (err) {
        setError('Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600">Carregando painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-700 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Competições</h1>
        <p className="text-slate-600">Participe e teste suas estratégias de investimento</p>
      </div>

      <div className="mb-8">
        {competition ? (
          <CompetitionCard
            competition={competition}
            onAction={() => onStartCompetition(competition)}
          />
        ) : (
          <Card className="p-6 text-center bg-slate-50 border-dashed">
            <p className="text-slate-600">Não há competições ativas no momento.</p>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-slate-900">Seu Último Resultado</h2>
        </div>

        {lastResult ? (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-slate-600 text-sm mb-1">Sua Posição</div>
                <div className="text-green-700 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>{lastResult.rank}º lugar</span>
                </div>
              </div>
              <div>
                <div className="text-slate-600 text-sm mb-1">Rentabilidade</div>
                <div className="text-green-700">
                  {lastResult.rentability}% ({lastResult.annualReturn}% a.a.)
                </div>
              </div>
            </div>

            <div className="bg-white/60 p-3 rounded-lg mb-4">
              <div className="text-slate-600 text-sm mb-1">Valor Final da Carteira</div>
              <div className="text-green-800">
                R$ {lastResult.portfolioValue.toLocaleString('pt-BR')}
              </div>
            </div>

            <button
              onClick={onViewResults}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Ver Detalhes Completos
            </button>
          </Card>
        ) : (
          <Card className="p-6 text-center bg-slate-50 border-dashed">
            <p className="text-slate-600">Você ainda não possui resultados de simulação.</p>
            <p className="text-sm text-slate-500 mt-2">Participe de uma rodada para ver seu histórico!</p>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-slate-900 mb-4">Top 5 da Rodada Anterior</h2>
        {topRanking.length > 0 ? (
          <div className="space-y-2">
            {topRanking.map((entry) => (
              <RankingItem key={entry.rank} entry={entry} showRentability />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center bg-slate-50 border-dashed">
            <p className="text-slate-600">Nenhum ranking disponível ainda.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
