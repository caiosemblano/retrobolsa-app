import { CompetitionCard } from '../CompetitionCard';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { TrendingUp, Target } from 'lucide-react';
import { currentCompetition, lastResult, quinzenalRanking } from '../../data/mockData';

interface HomeScreenProps {
  onStartCompetition: () => void;
  onViewResults: () => void;
}

export function HomeScreen({ onStartCompetition, onViewResults }: HomeScreenProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Competições</h1>
        <p className="text-slate-600">Participe e teste suas estratégias de investimento</p>
      </div>

      <div className="mb-8">
        <CompetitionCard
          competition={currentCompetition}
          onAction={onStartCompetition}
        />
      </div>

      <Separator className="my-8" />

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-slate-900">Seu Último Resultado</h2>
        </div>

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
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-slate-900 mb-4">Top 5 da Rodada Anterior</h2>
        <div className="space-y-2">
          {quinzenalRanking.slice(0, 5).map((entry) => (
            <RankingItem key={entry.rank} entry={entry} showRentability />
          ))}
        </div>
      </div>
    </div>
  );
}
