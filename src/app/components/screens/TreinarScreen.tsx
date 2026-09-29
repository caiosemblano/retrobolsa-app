import { useEffect, useState } from 'react';
import { ArrowLeft, Dumbbell, History, Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { anosSimulados } from '../ResultadoDetalhado';
import { practiceService } from '../../services/practiceService';
import { PracticeRound } from '../../types';
import { formatarNumero } from '../../utils/numero';

interface TreinarScreenProps {
  onEscolher: (rodadaId: string) => void;
  onBack: () => void;
}

const pct = (valor: number) => `${valor > 0 ? '+' : ''}${formatarNumero(valor, 1)}%`;

/** As rodadas que já acabaram, para remontar a carteira e ver na hora o que teria acontecido. */
export function TreinarScreen({ onEscolher, onBack }: TreinarScreenProps) {
  const [rodadas, setRodadas] = useState<PracticeRound[] | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    practiceService
      .list()
      .then((response) => setRodadas(response.data))
      .catch(() => setErro(true));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Button>

      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-info/30 bg-info-soft text-info"
        >
          <Dumbbell className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight">Treinar com rodadas passadas</h1>
          <p className="text-sm text-muted-foreground">
            Remonte a carteira de uma rodada que já acabou e veja na hora o que teria acontecido.
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        O treino não vale para o ranking nem para os pontos. O primeiro treino em cada rodada dá XP.
      </p>

      {erro ? (
        <Card className="items-center gap-3 p-10 text-center">
          <p className="text-muted-foreground">Não foi possível carregar as rodadas de treino.</p>
        </Card>
      ) : !rodadas ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : rodadas.length === 0 ? (
        <Card className="items-center gap-3 p-10 text-center">
          <Inbox className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">
            Ainda não há rodadas encerradas para treinar. Quando uma rodada for revelada, ela aparece aqui.
          </p>
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {rodadas.map((rodada) => (
            <li key={rodada.id}>
              <Card className="h-full gap-3 p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rodada {rodada.round} · {anosSimulados(`${rodada.startYear}-${rodada.endYear}`)}
                </div>
                <h2 className="font-display text-lg leading-tight">
                  {rodada.scenarioTitle || `Rodada ${rodada.round}`}
                </h2>
                <p className="text-sm text-muted-foreground">{rodada.assetCount} ativos para escolher</p>
                <p className="flex items-center gap-1.5 text-sm">
                  <History className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {rodada.runs > 0 ? (
                    <span>
                      Você treinou {rodada.runs} {rodada.runs === 1 ? 'vez' : 'vezes'}
                      {rodada.bestReturn !== undefined && (
                        <>
                          {' '}
                          · melhor resultado:{' '}
                          <span
                            className={`tabular font-semibold ${rodada.bestReturn >= 0 ? 'text-gain' : 'text-loss'}`}
                          >
                            {pct(rodada.bestReturn)}
                          </span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Você ainda não treinou nesta rodada</span>
                  )}
                </p>
                <Button className="mt-auto w-full" onClick={() => onEscolher(rodada.id)}>
                  <Dumbbell className="size-4" aria-hidden="true" />
                  Treinar a rodada {rodada.round}
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
