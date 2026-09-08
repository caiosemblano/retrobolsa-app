import { Achievement } from '../types';
import { Trophy, Award, GraduationCap, Medal, Crown, Lock } from 'lucide-react';
import { Card } from './ui/card';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const iconMap: Record<string, any> = {
  Trophy,
  Award,
  GraduationCap,
  Medal,
  Crown,
};

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon] || Trophy;

  return (
    <Card
      className={`items-center gap-2 p-4 text-center ${
        achievement.unlocked ? 'border-gold/35 bg-gold-soft' : 'border-border opacity-60'
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid size-12 place-items-center rounded-full ${
          achievement.unlocked
            ? 'pop-in bg-gradient-to-br from-gold to-amber-600 text-gold-foreground shadow-[0_10px_26px_-12px_var(--gold)]'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {achievement.unlocked ? <Icon className="size-6" /> : <Lock className="size-6" />}
      </span>

      <h4 className={`font-display ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
        {achievement.title}
      </h4>

      <p className="text-sm text-muted-foreground">{achievement.description}</p>

      {achievement.unlocked && achievement.unlockedAt ? (
        <div className="tabular text-xs text-gold">
          Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
        </div>
      ) : (
        !achievement.unlocked && <div className="text-xs text-muted-foreground">Bloqueado</div>
      )}
    </Card>
  );
}
