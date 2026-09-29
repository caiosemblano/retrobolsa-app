import api from './api';

/** Uma turma como o aluno a vê. */
export interface MinhaTurma {
  id: string;
  name: string;
  institution?: string | null;
  teacherUsername: string;
  memberCount: number;
  joinedAt: string;
}

/** Uma tarefa que falta o aluno fazer. */
export interface TarefaPendente {
  id: string;
  classroomName: string;
  articleId: string;
  moduleId: string;
  articleTitle: string;
  dueAt: string;
  /** O prazo já passou. */
  late: boolean;
}

/** O lado do aluno: entrar com o código, ver as próprias turmas e tarefas, e sair. */
export const classroomService = {
  mine: () => api.get<MinhaTurma[]>('/api/classrooms/mine'),
  assignments: () => api.get<TarefaPendente[]>('/api/classrooms/assignments'),
  join: (code: string) => api.post<MinhaTurma>('/api/classrooms/join', { code }),
  leave: (id: string) => api.delete<void>(`/api/classrooms/${id}/membership`),
};
