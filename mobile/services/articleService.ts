import api from './api';
import { Module, Lesson } from '../types';

export interface ArticleDetail {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  durationMin: number;
  completed: boolean;
}

export const articleService = {
  getModules: () => api.get<Module[]>('/api/articles'),

  getLessons: (moduleId: string) =>
    api.get<Lesson[]>(`/api/articles/lessons?moduleId=${moduleId}`),

  getById: (id: string) => api.get<ArticleDetail>(`/api/articles/${id}`),

  complete: (id: string) => api.post<void>(`/api/articles/${id}/complete`),
};
