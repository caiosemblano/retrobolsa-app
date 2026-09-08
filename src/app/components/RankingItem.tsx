import { RankingEntry } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingItemProps {
  entry: RankingEntry;
  showRentability?: boolean;
}

const podium = {
  1: {
    icon: Trophy,
    iconClass: 'text-gold',
    badge: 'bg-gradient-to-br from-gold to-amber-600 text-gold-foreground pulse-gold',
    row: 'border-gold/35 bg-gold-soft',
  },
  2: {
    icon: Medal,
    iconClass: 'text-slate-300',
    badge: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900',
    row: 'border-slate-400/30 bg-slate-400/10',
  },
  3: {
    icon: Award,
    iconClass: 'text-amber-600',
    badge: 'bg-gradient-to-br from-amber-500 to-amber-800 text-amber-50',
    row: 'border-amber-700/30 bg-amber-700/10',
  },
} as const;

export function RankingItem({ entry, showRentability }: RankingItemProps) {
  const place = podium[entry.rank as 1 | 2 | 3];
  const PlaceIcon = place?.icon;

  const rowClass = entry.isCurrentUser
    ? 'border-primary/60 bg-primary/10 glow-primary'
    : place
      ? place.row
      : 'border-border bg-card hover:border-ring/30 hover:bg-accent';

  const badgeClass =
    place?.badge ??
    (entry.rank <= 10 ? 'bg-info/20 text-info border border-info/40' : 'bg-muted text-muted-foreground');

  const rentabilityClass =
    entry.rentability !== undefined && entry.rentability < 0 ? 'text-loss' : 'text-gain';

  return (
    <div
      className={`mb-2 flex items-center gap-3 rounded-xl border p-3.5 transition-colors duration-200 ${rowClass}`}
    >
      <div
        className={`tabular grid size-10 shrink-0 place-items-center rounded-full font-display font-bold ${badgeClass}`}
      >
        {entry.rank}
      </div>

      {PlaceIcon && (
        <PlaceIcon className={`size-5 shrink-0 ${place.iconClass}`} aria-hidden="true" />
      )}

      <div className="min-w-0 flex-1">
        <div
          className={`truncate font-medium ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}
        >
          {entry.username}
          {entry.isCurrentUser && ' (Você)'}
        </div>
        {showRentability && entry.rentability !== undefined && (
          <div className={`tabular text-sm ${rentabilityClass}`}>
            Rentabilidade: {entry.rentability}%
          </div>
        )}
      </div>

      {!showRentability && (
        <div
          className={`tabular font-display font-semibold ${
            entry.isCurrentUser ? 'text-primary' : 'text-foreground'
          }`}
        >
          {entry.points.toLocaleString('pt-BR')} pts
        </div>
      )}
    </div>
  );
}
