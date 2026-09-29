import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { progressService, Progress, ProgressNews } from '../services/progressService';
import { missionService } from '../services/missionService';
import { AchievementBadge } from '../components/AchievementBadge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface ProgressContextValue {
  progress: Progress | null;
  /** Busca XP e novidades de novo: chame depois de uma ação que pode ter dado XP. */
  refresh: () => void;
}

// Fora do provider (telas testadas isoladamente), o hook devolve algo que não faz nada.
const ProgressContext = createContext<ProgressContextValue>({ progress: null, refresh: () => undefined });

export const useProgress = () => useContext(ProgressContext);

/**
 * Mantém o XP e o nível do jogador e comemora o que ele ganhou: ao abrir o app, a
 * cada troca de tela e quando uma tela chama `refresh()`. O que foi mostrado é
 * marcado como visto na API, então cada ganho é comemorado uma vez só.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [news, setNews] = useState<ProgressNews | null>(null);
  const buscando = useRef(false);

  const refresh = useCallback(() => {
    if (buscando.current) return;
    buscando.current = true;
    Promise.all([progressService.get(), progressService.news()])
      .then(([p, n]) => {
        setProgress(p.data);
        // Não substitui uma comemoração aberta: a próxima busca a traz, se ainda houver.
        if (n.data.items.length) setNews((atual) => atual ?? n.data);
      })
      .catch(() => undefined) // Progresso é um extra: se falhar, o jogo segue.
      .finally(() => {
        buscando.current = false;
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Abrir o app conta para a missão "volte em 2 dias" (a API conta uma vez por dia).
  useEffect(() => {
    missionService.visit().catch(() => undefined);
  }, []);

  const fechar = () => {
    if (!news) return;
    const ids = news.items.map((item) => item.id);
    setNews(null);
    progressService.acknowledge(ids).catch(() => undefined);
  };

  return (
    <ProgressContext.Provider value={{ progress, refresh }}>
      {children}
      <Dialog open={news !== null} onOpenChange={(aberto) => !aberto && fechar()}>
        {news && (
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-2xl">
                <Sparkles className="size-6 text-gold" aria-hidden="true" />
                <span className="tabular">+{news.xpGained} XP</span>
              </DialogTitle>
              <DialogDescription>Veja o que você conquistou.</DialogDescription>
            </DialogHeader>

            {news.levelUp && (
              <div className="pop-in flex items-center gap-3 rounded-xl border border-gold/40 bg-gold-soft p-4 motion-reduce:animate-none">
                <TrendingUp className="size-6 shrink-0 text-gold" aria-hidden="true" />
                <p className="font-display text-lg">
                  Você subiu para o nível {news.level}: <strong>{news.levelTitle}</strong>!
                </p>
              </div>
            )}

            {news.achievements.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {news.achievements.map((achievement) => (
                  <AchievementBadge key={achievement.code} achievement={achievement} />
                ))}
              </div>
            )}

            <ul className="space-y-1.5 text-sm" aria-label="Ganhos de XP">
              {news.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="tabular font-semibold text-gold">+{item.amount}</span>
                </li>
              ))}
            </ul>

            <DialogFooter>
              <Button className="w-full" onClick={fechar}>
                Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </ProgressContext.Provider>
  );
}
