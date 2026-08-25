import api from './api';

export interface ArticleDetail {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  content: string;
  durationMin: number;
  completed: boolean;
}

export const articleService = {
  getAll: () => api.get<ArticleDetail[]>('/api/articles'),
  complete: (id: string) => api.post<void>(`/api/articles/${id}/complete`),
};
