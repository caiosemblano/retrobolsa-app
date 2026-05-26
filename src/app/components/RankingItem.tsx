import { RankingEntry } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingItemProps {
  entry: RankingEntry;
  showRentability?: boolean;
}

export function RankingItem({ entry, showRentability }: RankingItemProps) {
  const getRankIcon = () => {
    switch (entry.rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = () => {
    if (entry.rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    if (entry.rank <= 10) return 'bg-blue-600 text-white';
    return 'bg-slate-200 text-slate-700';
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
        entry.isCurrentUser
          ? 'bg-orange-50 border-orange-300 border-2'
          : 'bg-white border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBadgeColor()}`}
      >
        {entry.rank}
      </div>

      {getRankIcon() && (
        <div className="flex items-center justify-center">
          {getRankIcon()}
        </div>
      )}

      <div className="flex-1">
        <div className={entry.isCurrentUser ? 'text-orange-700' : 'text-slate-900'}>
          {entry.username}
          {entry.isCurrentUser && ' (Você)'}
        </div>
        {showRentability && entry.rentability !== undefined && (
          <div className="text-slate-600 text-sm">
            Rentabilidade: {entry.rentability}%
          </div>
        )}
      </div>

      <div className={`text-right ${entry.isCurrentUser ? 'text-orange-700' : 'text-slate-900'}`}>
        <div>{entry.points.toLocaleString('pt-BR')} pts</div>
      </div>
    </div>
  );
}
