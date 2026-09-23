import { Lock } from 'lucide-react';
import { Achievement } from '../types';
import { Card } from './ui/card';
import { AchievementArt } from './achievements/AchievementArt';
import { rarityStyle } from './achievements/rarity';
import { formatarData } from '../utils/date';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const style = rarityStyle(achievement.rarity);
  const { unlocked } = achievement;

  // Bloqueada não usa opacidade no card inteiro: apagaria o texto abaixo do contraste
  // mínimo. O estado vem da silhueta, do cadeado e do rótulo "Bloqueada".
  return (
    <Card className={`items-center gap-2 p-4 text-center ${unlocked ? style.card : 'border-border'}`}>
      <span className="relative block size-16">
        <AchievementArt
          code={achievement.code}
          rarity={achievement.rarity}
          unlocked={unlocked}
          className={`size-16 ${unlocked ? 'pop-in drop-shadow-[0_8px_18px_rgba(2,6,18,0.7)]' : ''}`}
        />
        {!unlocked && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <Lock className="size-3.5" />
          </span>
        )}
      </span>

      <h4 className={`font-display ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{achievement.title}</h4>

      <span className={`text-[11px] font-medium uppercase tracking-wider ${unlocked ? style.text : 'text-muted-foreground'}`}>
        {style.label}
      </span>

      <p className="text-sm text-muted-foreground">{achievement.description}</p>

      {unlocked && achievement.unlockedAt ? (
        <div className={`tabular text-xs ${style.text}`}>Desbloqueada em {formatarData(achievement.unlockedAt)}</div>
      ) : (
        !unlocked && <div className="text-xs text-muted-foreground">Bloqueada</div>
      )}
    </Card>
  );
}
