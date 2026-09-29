import api from './api';

export interface UsuarioDoAdmin {
  id: string;
  username: string;
  email: string;
  role: 'PLAYER' | 'TEACHER' | 'ADMIN';
}

/** O admin busca usuários e promove (ou rebaixa) professores. */
export const adminUserService = {
  /** Sem busca, a API lista os professores atuais. */
  search: (q: string) => api.get<UsuarioDoAdmin[]>('/api/admin/users', { params: q ? { q } : {} }),
  changeRole: (id: string, role: 'PLAYER' | 'TEACHER') =>
    api.post<UsuarioDoAdmin>(`/api/admin/users/${id}/role`, { role }),
  /** Gera uma senha temporária; a API a devolve só nesta resposta. */
  resetPassword: async (id: string) => {
    const response = await api.post<{ temporaryPassword: string }>(`/api/admin/users/${id}/reset-password`);
    return response.data.temporaryPassword;
  },
};
