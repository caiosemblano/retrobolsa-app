import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RankingItem } from '../RankingItem';
import { Trophy } from 'lucide-react';
import { rankingService, RankingType } from '../../services/rankingService';
import { RankingEntry } from '../../types';

const tabs: Array<{ key: string; type: RankingType }> = [
  { key: 'quinzenal', type: 'quinzenal' },
  { key: 'temporada', type: 'season' },
  { key: 'geral', type: 'general' },
];

export function RankingsScreen() {
  const [rankings, setRankings] = useState<Record<string, RankingEntry[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all(tabs.map((tab) => rankingService.get(tab.type).then((response) => [tab.key, response.data] as const)))
      .then((values) => setRankings(Object.fromEntries(values)))
      .catch(() => setError('Não foi possível carregar os rankings.'))
      .finally(() => setLoading(false));
  }, []);
  return <div className="max-w-4xl mx-auto p-4 pb-20"><div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg"><Trophy className="w-8 h-8 text-white" /></div><div><h1 className="text-slate-900 mb-1">Rankings</h1><p className="text-slate-600">Veja sua posição entre os investidores</p></div></div>{loading ? <p className="text-center text-slate-600">Carregando rankings...</p> : error ? <p className="text-center text-slate-600">{error}</p> : <Tabs defaultValue="quinzenal" className="w-full"><TabsList className="grid w-full grid-cols-3 mb-6"><TabsTrigger value="quinzenal">Quinzenal</TabsTrigger><TabsTrigger value="temporada">Temporada</TabsTrigger><TabsTrigger value="geral">Geral</TabsTrigger></TabsList>{tabs.map((tab) => <TabsContent key={tab.key} value={tab.key} className="space-y-3">{(rankings[tab.key] || []).length ? rankings[tab.key].map((entry) => <RankingItem key={`${entry.rank}-${entry.username}`} entry={entry} showRentability={tab.key === 'quinzenal'} />) : <p className="text-slate-500">Ainda não há participantes classificados.</p>}</TabsContent>)}</Tabs>}</div>;
}
