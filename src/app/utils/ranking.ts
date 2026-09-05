import { RankingEntry } from '../types';

/** Marca a entrada do usuário logado para destacá-la na lista de ranking. */
export function markCurrentUser(entries: RankingEntry[], username?: string): RankingEntry[] {
  if (!username) return entries;
  return entries.map((entry) => ({ ...entry, isCurrentUser: entry.username === username }));
}
