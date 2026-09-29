import api from './api';
import { baixarArquivo } from '../utils/download';

/** Uma turma como o professor a vê, com o código para projetar em sala. */
export interface TurmaDoProfessor {
  id: string;
  name: string;
  institution?: string | null;
  joinCode: string;
  archived: boolean;
  memberCount: number;
  createdAt: string;
}

/** Um aluno no painel: só o username, nunca o e-mail. */
export interface AlunoDaTurma {
  username: string;
  joinedAt: string;
  lessonsCompleted: number;
  quizzesTaken: number;
  /** Média da melhor nota em cada quiz, em %; ausente se ainda não fez nenhum. */
  quizAverage?: number | null;
  roundsPlayed: number;
  xp: number;
  level: number;
  levelTitle: string;
  lastActivity?: string | null;
}

/** Uma pergunta de quiz com a taxa de erro da turma. */
export interface PerguntaErrada {
  questionId: string;
  prompt: string;
  articleId: string;
  moduleId: string;
  articleTitle: string;
  answers: number;
  wrong: number;
  /** Em %. */
  errorRate: number;
  students: number;
  commonWrongAnswer?: string | null;
}

/** Uma tarefa da turma, com a situação de cada aluno. */
export interface TarefaDaTurma {
  id: string;
  articleId: string;
  moduleId: string;
  articleTitle: string;
  dueAt: string;
  createdAt: string;
  done: number;
  late: number;
  pending: number;
  students: { username: string; status: 'FEITA' | 'ATRASADA' | 'PENDENTE'; completedAt?: string | null }[];
}

const base = '/api/teacher/classrooms';

/** "1º ano B" → "turma-1o-ano-b.csv", como a API nomeia. */
export function nomeDoCsv(nomeDaTurma: string): string {
  const slug = nomeDaTurma
    .replace(/º/g, 'o')
    .replace(/ª/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `turma-${slug || 'alunos'}.csv`;
}

/** "turma-1o-ano-b.csv" do cabeçalho Content-Disposition, se vier. */
export function nomeDoArquivo(contentDisposition: string | undefined, padrao: string): string {
  const utf8 = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8) return decodeURIComponent(utf8[1]);
  const simples = contentDisposition?.match(/filename="?([^";]+)"?/i);
  return simples ? simples[1] : padrao;
}

export const teacherService = {
  list: () => api.get<TurmaDoProfessor[]>(base),
  create: (name: string, institution?: string) =>
    api.post<TurmaDoProfessor>(base, { name, institution: institution || undefined }),
  archive: (id: string) => api.post<TurmaDoProfessor>(`${base}/${id}/archive`),
  unarchive: (id: string) => api.post<TurmaDoProfessor>(`${base}/${id}/unarchive`),
  regenerateCode: (id: string) => api.post<TurmaDoProfessor>(`${base}/${id}/code`),
  students: (id: string) => api.get<AlunoDaTurma[]>(`${base}/${id}/students`),
  questions: (id: string) => api.get<PerguntaErrada[]>(`${base}/${id}/questions`),
  assignments: (id: string) => api.get<TarefaDaTurma[]>(`${base}/${id}/assignments`),
  /** @param dueAt data e hora locais, como o input datetime-local (2026-10-05T23:59) */
  assign: (id: string, articleId: string, dueAt: string) =>
    api.post<TarefaDaTurma>(`${base}/${id}/assignments`, { articleId, dueAt }),
  unassign: (id: string, assignmentId: string) => api.delete<void>(`${base}/${id}/assignments/${assignmentId}`),

  /**
   * Baixa o CSV dos alunos pelo navegador (a rota exige o token, então não dá para ser um link simples).
   * O nome vem da API; se o cabeçalho não chegar, usa o nome padrão.
   */
  downloadCsv: async (id: string, nomePadrao = 'alunos.csv') => {
    const response = await api.get<Blob>(`${base}/${id}/students.csv`, { responseType: 'blob' });
    const nome = nomeDoArquivo(response.headers?.['content-disposition'] as string | undefined, nomePadrao);
    baixarArquivo(response.data, nome);
    return nome;
  },
};
