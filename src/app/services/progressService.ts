import api from './api';
import { Achievement } from '../types';

export interface Progress {
  xp: number;
  level: number;
  levelTitle: string;
  /** XP em que o nível atual começa. */
  levelMinXp: number;
  /** Próximo nível; ausentes no nível máximo. */
  nextLevel?: number | null;
  nextLevelTitle?: string | null;
  nextLevelMinXp?: number | null;
  /** Semanas seguidas com alguma atividade, até esta. */
  streakWeeks: number;
}

/** O que foi ganho e ainda não comemorado. */
export interface ProgressNews {
  items: { id: string; source: string; label: string; amount: number }[];
  xpGained: number;
  levelUp: boolean;
  level: number;
  levelTitle: string;
  achievements: Achievement[];
}

/** Quanto do caminho até o próximo nível já foi feito, de 0 a 100 (100 no nível máximo). */
export function progressoNoNivel({ xp, levelMinXp, nextLevelMinXp }: Progress): number {
  if (nextLevelMinXp == null) return 100;
  const faixa = nextLevelMinXp - levelMinXp;
  return faixa > 0 ? Math.min(100, Math.max(0, ((xp - levelMinXp) / faixa) * 100)) : 100;
}

export const progressService = {
  get: () => api.get<Progress>('/api/progress'),
  news: () => api.get<ProgressNews>('/api/progress/news'),
  acknowledge: (ids: string[]) => api.post<void>('/api/progress/news/ack', { ids }),
};
