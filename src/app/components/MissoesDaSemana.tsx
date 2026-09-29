import { useEffect, useState } from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import { Card } from './ui/card';
import { missionService, SemanaDeMissoes } from '../services/missionService';

/** Na tela inicial: as 3 missões da semana, com a barra de progresso de cada uma. */
export function MissoesDaSemana() {
  const [semana, setSemana] = useState<SemanaDeMissoes | null>(null);

  useEffect(() => {
    missionService
      .week()
      .then((response) => setSemana(response.data))
      .catch(() => undefined); // As missões são um extra: sem elas, a tela segue.
  }, []);

  if (!semana || semana.missions.length === 0) return null;
  const cumpridas = semana.missions.filter((missao) => missao.completed).length;

  return (
    <section aria-labelledby="missoes-titulo">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="missoes-titulo" className="flex items-center gap-2 font-display text-xl">
          <Target className="size-5 text-gold" aria-hidden="true" />
          Missões da semana
        </h2>
        <span className="tabular text-sm text-muted-foreground">
          {cumpridas} de {semana.missions.length} cumpridas · novas na segunda-feira
        </span>
      </div>
      <Card className="gap-4 p-4">
        <ul className="space-y-4">
          {semana.missions.map((missao) => {
            const pct = Math.round((missao.progress / missao.target) * 100);
            return (
              <li key={missao.code} className="space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-medium">
                      {missao.completed && <CheckCircle2 className="size-4 shrink-0 text-gain" aria-hidden="true" />}
                      {missao.title}
                    </div>
                    <p className="text-xs text-muted-foreground">{missao.description}</p>
                  </div>
                  <span className="tabular shrink-0 text-xs font-semibold text-gold">+{missao.xp} XP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    role="progressbar"
                    aria-label={missao.title}
                    aria-valuemin={0}
                    aria-valuemax={missao.target}
                    aria-valuenow={missao.progress}
                    aria-valuetext={missao.completed ? 'Cumprida' : `${missao.progress} de ${missao.target}`}
                    className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${
                        missao.completed ? 'bg-gain' : 'bg-gold'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="tabular w-16 shrink-0 text-right text-xs text-muted-foreground">
                    {missao.completed ? 'Cumprida!' : `${missao.progress} de ${missao.target}`}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
