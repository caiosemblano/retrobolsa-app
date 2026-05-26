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
      className={`p-4 ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200'
          : 'bg-slate-50 border-slate-200 opacity-60'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`p-3 rounded-full mb-2 ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-slate-300'
          }`}
        >
          {achievement.unlocked ? (
            <Icon className="w-6 h-6 text-white" />
          ) : (
            <Lock className="w-6 h-6 text-slate-500" />
          )}
        </div>
        
        <h4 className={achievement.unlocked ? 'text-slate-900 mb-1' : 'text-slate-600 mb-1'}>
          {achievement.title}
        </h4>
        
        <p className="text-slate-600 text-sm mb-2">
          {achievement.description}
        </p>
        
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="text-orange-600 text-xs">
            Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
          </div>
        )}
        
        {!achievement.unlocked && (
          <div className="text-slate-500 text-xs">
            Bloqueado
          </div>
        )}
      </div>
    </Card>
  );
}
