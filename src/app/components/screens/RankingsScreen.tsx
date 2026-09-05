import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RankingItem } from '../RankingItem';
import { Trophy } from 'lucide-react';
import {
  GLOBAL_PAGE_SIZE,
  MyRankSummary,
  SeasonInfo,
  rankingService,
} from '../../services/rankingService';
import { useAuth } from '../../contexts/AuthContext';
import { markCurrentUser } from '../../utils/ranking';
import { RankingEntry } from '../../types';

export function RankingsScreen() {
  const { user } = useAuth();
  const myUsername = user?.username;

  const [quinzenal, setQuinzenal] = useState<RankingEntry[]>([]);
  const [season, setSeason] = useState<RankingEntry[]>([]);
  const [seasonInfo, setSeasonInfo] = useState<SeasonInfo>();
  const [global, setGlobal] = useState<RankingEntry[]>([]);
  const [globalPage, setGlobalPage] = useState(0);
  const [hasMoreGlobal, setHasMoreGlobal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [myRank, setMyRank] = useState<MyRankSummary>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    rankingService.getMyRank()
      .then((response) => setMyRank(response.data))
      .catch(() => undefined);
    rankingService.getSeasonInfo()
      .then((response) => setSeasonInfo(response.data))
      .catch(() => undefined);

    Promise.all([
      rankingService.get('quinzenal'),
      rankingService.get('season'),
      rankingService.getGlobalPage(0),
    ])
      .then(([quinzenalRes, seasonRes, globalRes]) => {
        setQuinzenal(quinzenalRes.data);
        setSeason(seasonRes.data);
        setGlobal(globalRes.data);
        setHasMoreGlobal(globalRes.data.length === GLOBAL_PAGE_SIZE);
      })
      .catch(() => setError('Não foi possível carregar os rankings.'))
      .finally(() => setLoading(false));
  }, []);

  const carregarMaisGlobal = async () => {
    setLoadingMore(true);
    try {
      const nextPage = globalPage + 1;
      const response = await rankingService.getGlobalPage(nextPage);
      setGlobal((current) => [...current, ...response.data]);
      setGlobalPage(nextPage);
      setHasMoreGlobal(response.data.length === GLOBAL_PAGE_SIZE);
    } catch {
      setHasMoreGlobal(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderLista = (entries: RankingEntry[], showRentability: boolean) => {
    if (!entries.length) {
      return <p className="text-slate-500">Ainda não há participantes classificados.</p>;
    }
    return markCurrentUser(entries, myUsername).map((entry) => (
      <RankingItem
        key={`${entry.rank}-${entry.username}`}
        entry={entry}
        showRentability={showRentability}
      />
    ));
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

      {myRank && (
        <div className="mb-6 p-4 rounded-lg bg-orange-50 border-2 border-orange-300">
          <div className="text-orange-700 mb-1">Sua posição</div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-700 text-sm">
            <span>
              Geral: {myRank.globalRank}º de {myRank.totalGlobalPlayers}
            </span>
            <span>{myRank.points.toLocaleString('pt-BR')} pts</span>
            <span>{myRank.competitionsPlayed} rodadas disputadas</span>
            {myRank.activeRoundRank && (
              <span>
                Rodada {myRank.activeRoundNumber}: {myRank.activeRoundRank}º
              </span>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-600">Carregando rankings...</p>
      ) : error ? (
        <p className="text-center text-slate-600">{error}</p>
      ) : (
        <Tabs defaultValue="quinzenal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="quinzenal">Quinzenal</TabsTrigger>
            <TabsTrigger value="temporada">Temporada</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>

          <TabsContent value="quinzenal" className="space-y-3">
            {renderLista(quinzenal, true)}
          </TabsContent>

          <TabsContent value="temporada" className="space-y-3">
            {seasonInfo && (
              <p className="text-slate-600 text-sm">
                Temporada {seasonInfo.seasonNumber} · Rodadas {seasonInfo.roundStart}–
                {seasonInfo.roundEnd}
              </p>
            )}
            {renderLista(season, false)}
          </TabsContent>

          <TabsContent value="geral" className="space-y-3">
            {renderLista(global, false)}
            {hasMoreGlobal && (
              <button
                type="button"
                onClick={carregarMaisGlobal}
                disabled={loadingMore}
                className="w-full p-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {loadingMore ? 'Carregando...' : 'Carregar mais'}
              </button>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
