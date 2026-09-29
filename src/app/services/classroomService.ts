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

/** O lado do aluno: entrar com o código, ver as próprias turmas e sair. */
export const classroomService = {
  mine: () => api.get<MinhaTurma[]>('/api/classrooms/mine'),
  join: (code: string) => api.post<MinhaTurma>('/api/classrooms/join', { code }),
  leave: (id: string) => api.delete<void>(`/api/classrooms/${id}/membership`),
};
