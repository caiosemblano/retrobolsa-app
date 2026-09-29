import api from './api';

export interface Missao {
  code: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  xp: number;
}

export interface SemanaDeMissoes {
  /** "2026-W40". */
  week: string;
  /** Domingo, 23:59:59: quando as missões trocam. */
  endsAt: string;
  missions: Missao[];
}

export const missionService = {
  week: () => api.get<SemanaDeMissoes>('/api/missions/week'),
  /** Avisa que o app foi aberto (conta para "volte em 2 dias"; a API conta uma vez por dia). */
  visit: () => api.post<void>('/api/missions/visit'),
};
