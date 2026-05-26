import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RankingItem } from '../RankingItem';
import { Trophy } from 'lucide-react';
import { quinzenalRanking, seasonRanking, generalRanking } from '../../data/mockData';

export function RankingsScreen() {
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-slate-900 mb-1">Rankings</h1>
          <p className="text-slate-600">Veja sua posição entre os investidores</p>
        </div>
      </div>

      <Tabs defaultValue="quinzenal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="quinzenal">Quinzenal</TabsTrigger>
          <TabsTrigger value="temporada">Temporada</TabsTrigger>
          <TabsTrigger value="geral">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="quinzenal" className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="text-slate-900 mb-1">Rodada Atual</h3>
            <p className="text-slate-600 text-sm">
              Classificação baseada na rentabilidade da última rodada completada
            </p>
          </div>
          {quinzenalRanking.map((entry) => (
            <RankingItem key={entry.rank} entry={entry} showRentability />
          ))}
        </TabsContent>

        <TabsContent value="temporada" className="space-y-3">
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="text-slate-900 mb-1">Temporada Atual</h3>
            <p className="text-slate-600 text-sm">
              Soma dos pontos das 5 rodadas quinzenais da temporada
            </p>
          </div>
          {seasonRanking.map((entry) => (
            <RankingItem key={entry.rank} entry={entry} />
          ))}
        </TabsContent>

        <TabsContent value="geral" className="space-y-3">
          <div className="bg-orange-50 p-4 rounded-lg mb-4">
            <h3 className="text-slate-900 mb-1">Ranking Geral</h3>
            <p className="text-slate-600 text-sm">
              Pontuação acumulada de todas as temporadas
            </p>
          </div>
          {generalRanking.map((entry) => (
            <RankingItem key={entry.rank} entry={entry} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
