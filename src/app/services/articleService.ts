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
  /** Aula com quiz se conclui passando nele (2 de 3), não pelo botão. */
  hasQuiz?: boolean;
  quizTotal?: number;
  /** Melhor nota do aluno no quiz; null se nunca tentou. */
  bestQuizScore?: number | null;
}

/** Pergunta como a API manda: sem a resposta certa, que só vem na correção. */
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  score: number;
  total: number;
  /** Acertou o mínimo (2 de 3) e, com isso, concluiu a aula. */
  passed: boolean;
  results: {
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    correct: boolean;
    explanation: string;
  }[];
}

export const articleService = {
  getAll: () => api.get<ArticleDetail[]>('/api/articles'),
  complete: (id: string) => api.post<void>(`/api/articles/${id}/complete`),
  getQuiz: (id: string) => api.get<QuizQuestion[]>(`/api/articles/${id}/quiz`),
  submitQuiz: (id: string, answers: QuizAnswer[]) =>
    api.post<QuizResult>(`/api/articles/${id}/quiz`, { answers }),
};
