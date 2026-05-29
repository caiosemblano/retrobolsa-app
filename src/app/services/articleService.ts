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

/**
 * Serviço de artigos educacionais — hub de aprendizado.
 */
export const articleService = {
  /** Retorna todos os módulos com contagem e progresso do usuário. */
  getModules: () => api.get<Module[]>('/api/articles'),

  /** Retorna as lições de um módulo específico. */
  getLessons: (moduleId: string) =>
    api.get<Lesson[]>(`/api/articles/lessons?moduleId=${moduleId}`),

  /** Retorna o conteúdo completo de um artigo. */
  getById: (id: string) => api.get<ArticleDetail>(`/api/articles/${id}`),

  /**
   * Marca um artigo como concluído para o usuário autenticado.
   * O backend atualiza o progresso do perfil e a pontuação do jogador.
   */
  complete: (id: string) => api.post<void>(`/api/articles/${id}/complete`),
};
