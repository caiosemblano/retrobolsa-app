import api from './api';

export interface ArticleDetail {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleDescription?: string | null;
  /** Nome de ícone lucide em kebab-case, como gravado no banco (ex.: "trending-up"). */
  moduleIcon?: string | null;
  title: string;
  content: string | null;
  durationMin: number;
  displayOrder: number;
  /** ID do vídeo no YouTube (11 caracteres); null se a aula não tem vídeo. */
  videoId?: string | null;
  completed: boolean;
}

export const articleService = {
  getAll: () => api.get<ArticleDetail[]>('/api/articles'),
  complete: (id: string) => api.post<void>(`/api/articles/${id}/complete`),
};
