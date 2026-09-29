import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { RankingItem } from '../RankingItem';
import { Trophy } from 'lucide-react';
import {
  GLOBAL_PAGE_SIZE,
  MyRankSummary,
  SeasonInfo,
  rankingService,
} from '../../services/rankingService';
import { classroomService, MinhaTurma } from '../../services/classroomService';
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
  const [turmas, setTurmas] = useState<MinhaTurma[]>([]);
  const [turmaId, setTurmaId] = useState<string>();
  const [daTurma, setDaTurma] = useState<{ rodada: RankingEntry[]; temporada: RankingEntry[] } | null>(null);
  const [erroTurma, setErroTurma] = useState(false);

  useEffect(() => {
    rankingService.getMyRank()
      .then((response) => setMyRank(response.data))
      .catch(() => undefined);
    rankingService.getSeasonInfo()
      .then((response) => setSeasonInfo(response.data))
      .catch(() => undefined);
    classroomService.mine()
      .then((response) => {
        setTurmas(response.data);
        setTurmaId(response.data[0]?.id);
      })
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

  // O ranking da turma escolhida: a rodada e a temporada, só entre os alunos dela.
  useEffect(() => {
    if (!turmaId) return;
    let cancelado = false;
    setDaTurma(null);
    setErroTurma(false);
    Promise.all([rankingService.get('quinzenal', turmaId), rankingService.get('season', turmaId)])
      .then(([rodada, temporada]) => {
        if (!cancelado) setDaTurma({ rodada: rodada.data, temporada: temporada.data });
      })
      .catch(() => {
        if (!cancelado) setErroTurma(true);
      });
    return () => {
      cancelado = true;
    };
  }, [turmaId]);

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
      return (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Ainda não há participantes classificados.</p>
        </Card>
      );
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
    <div className="mx-auto max-w-4xl p-4 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold to-amber-600 text-gold-foreground shadow-[0_10px_30px_-12px_var(--gold)]"
        >
          <Trophy className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl leading-tight">Rankings</h1>
          <p className="text-muted-foreground text-sm">Veja sua posição entre os investidores</p>
        </div>
      </div>

      {myRank && (
        <Card className="mb-6 gap-2 border-primary/40 p-4 glow-primary">
          <div className="font-display font-semibold text-primary">Sua posição</div>
          <div className="tabular flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
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
        </Card>
      )}

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
        </Card>
      ) : (
        <Tabs defaultValue="quinzenal" className="w-full">
          <TabsList className={`mb-6 grid w-full ${turmas.length ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="quinzenal">Quinzenal</TabsTrigger>
            <TabsTrigger value="temporada">Temporada</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            {turmas.length > 0 && <TabsTrigger value="turma">Minha turma</TabsTrigger>}
          </TabsList>

          <TabsContent value="quinzenal">{renderLista(quinzenal, true)}</TabsContent>

          <TabsContent value="temporada">
            {seasonInfo && (
              <p className="tabular mb-3 text-sm text-muted-foreground">
                Temporada {seasonInfo.seasonNumber} · Rodadas {seasonInfo.roundStart}–
                {seasonInfo.roundEnd}
              </p>
            )}
            {renderLista(season, false)}
          </TabsContent>

          {turmas.length > 0 && (
            <TabsContent value="turma" className="space-y-6">
              {turmas.length > 1 && (
                <div className="space-y-1.5">
                  <label htmlFor="turma-ranking" className="text-sm font-medium">
                    Turma
                  </label>
                  <select
                    id="turma-ranking"
                    value={turmaId}
                    onChange={(event) => setTurmaId(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {erroTurma ? (
                <Card className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">Não foi possível carregar o ranking da turma.</p>
                </Card>
              ) : !daTurma ? (
                <Skeleton className="h-16 w-full rounded-xl" />
              ) : (
                <>
                  <section>
                    <h2 className="mb-3 font-display text-lg">Rodada</h2>
                    {renderLista(daTurma.rodada, true)}
                  </section>
                  <section>
                    <h2 className="mb-3 font-display text-lg">Temporada</h2>
                    {renderLista(daTurma.temporada, false)}
                  </section>
                </>
              )}
            </TabsContent>
          )}

          <TabsContent value="geral">
            {renderLista(global, false)}
            {hasMoreGlobal && (
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={carregarMaisGlobal}
                disabled={loadingMore}
              >
                {loadingMore ? 'Carregando...' : 'Carregar mais'}
              </Button>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
