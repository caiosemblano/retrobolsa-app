import { Flame, Star } from 'lucide-react';
import { Card } from './ui/card';
import { useProgress } from '../contexts/ProgressContext';
import { progressoNoNivel } from '../services/progressService';

/** Nível, XP até o próximo nível e semanas seguidas, no perfil. */
export function NivelCard() {
  const { progress } = useProgress();
  if (!progress) return null;

  const faltam = progress.nextLevelMinXp != null ? progress.nextLevelMinXp - progress.xp : null;
  const pct = Math.round(progressoNoNivel(progress));

  return (
    <Card className="gap-4 border-gold/25 p-6" aria-labelledby="nivel-titulo">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="tabular grid size-14 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gold-soft font-display text-2xl font-bold text-gold"
        >
          {progress.level}
        </span>
        <div className="min-w-0">
          <h2 id="nivel-titulo" className="font-display text-xl">
            Nível {progress.level}: {progress.levelTitle}
          </h2>
          <p className="tabular text-sm text-muted-foreground">{progress.xp.toLocaleString('pt-BR')} XP</p>
        </div>
      </div>

      <div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso até o próximo nível"
        >
          <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
        </div>
        <p className="tabular mt-1.5 text-sm text-muted-foreground">
          {faltam != null
            ? `Faltam ${faltam.toLocaleString('pt-BR')} XP para ${progress.nextLevelTitle}.`
            : 'Você chegou ao nível máximo!'}
        </p>
      </div>

      <p className="flex items-center gap-2 text-sm">
        <Flame className={`size-5 shrink-0 ${progress.streakWeeks > 0 ? 'text-gold' : 'text-muted-foreground'}`} aria-hidden="true" />
        {progress.streakWeeks > 0
          ? `${progress.streakWeeks} ${progress.streakWeeks === 1 ? 'semana' : 'semanas seguidas'} estudando ou jogando.`
          : 'Estude ou jogue esta semana para começar uma sequência.'}
      </p>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Star className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        XP vem de aulas, quizzes, rodadas e conquistas: ele mede o quanto você estuda e participa, não se a carteira
        ganhou ou perdeu dinheiro.
      </p>
    </Card>
  );
}
