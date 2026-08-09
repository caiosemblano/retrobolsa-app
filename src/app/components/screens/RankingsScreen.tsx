import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/card';
import { Trophy, Loader2, AlertCircle } from 'lucide-react';
import { rankingService, RankingType } from '../../services/rankingService';
import { RankingEntry } from '../../types';

export function RankingsScreen() {
  const [activeTab, setActiveTab] = useState<RankingType>('quinzenal');
  const [rankings, setRankings] = useState<Record<RankingType, RankingEntry[]>>({
    quinzenal: [],
    season: [],
    general: [],
  });
  const [loadingTabs, setLoadingTabs] = useState<Record<RankingType, boolean>>({
    quinzenal: true,
    season: false,
    general: false,
  });
  const [errors, setErrors] = useState<Record<RankingType, string | null>>({
    quinzenal: null,
    season: null,
    general: null,
  });

  const fetchRanking = async (type: RankingType) => {
    if (rankings[type].length > 0) return;

    setLoadingTabs(prev => ({ ...prev, [type]: true }));
    setErrors(prev => ({ ...prev, [type]: null }));

    try {
      const res = await rankingService.get(type);
      setRankings(prev => ({ ...prev, [type]: res.data }));
    } catch {
      setErrors(prev => ({
        ...prev,
        [type]: 'Não foi possível carregar o ranking. Tente novamente.',
      }));
    } finally {
      setLoadingTabs(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    fetchRanking('quinzenal');
  }, []);

  const handleTabChange = (value: string) => {
    const type = value as RankingType;
    setActiveTab(type);
    fetchRanking(type);
  };

  const renderTabContent = (type: RankingType, showRentability: boolean) => {
    if (loadingTabs[type]) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-slate-600 text-sm">Carregando ranking...</p>
        </div>
      );
    }

    if (errors[type]) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-slate-700 text-sm text-center">{errors[type]}</p>
          <button
            onClick={() => fetchRanking(type)}
            className="mt-3 text-blue-600 text-sm hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    if (rankings[type].length === 0) {
      return (
        <Card className="p-6 text-center bg-slate-50 border-dashed">
          <p className="text-slate-600">Nenhum ranking disponível ainda.</p>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {rankings[type].map((entry) => (
          <RankingItem key={entry.rank} entry={entry} showRentability={showRentability} />
        ))}
      </div>
    );
  };

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

      <Tabs defaultValue="quinzenal" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="quinzenal">Quinzenal</TabsTrigger>
          <TabsTrigger value="season">Temporada</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="quinzenal" className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="text-slate-900 mb-1">Rodada Atual</h3>
            <p className="text-slate-600 text-sm">
              Classificação baseada na rentabilidade da última rodada completada
            </p>
          </div>
          {renderTabContent('quinzenal', true)}
        </TabsContent>

        <TabsContent value="season" className="space-y-3">
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="text-slate-900 mb-1">Temporada Atual</h3>
            <p className="text-slate-600 text-sm">
              Soma dos pontos das 5 rodadas quinzenais da temporada
            </p>
          </div>
          {renderTabContent('season', false)}
        </TabsContent>

        <TabsContent value="general" className="space-y-3">
          <div className="bg-orange-50 p-4 rounded-lg mb-4">
            <h3 className="text-slate-900 mb-1">Ranking Geral</h3>
            <p className="text-slate-600 text-sm">
              Pontuação acumulada de todas as temporadas
            </p>
          </div>
          {renderTabContent('general', false)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
