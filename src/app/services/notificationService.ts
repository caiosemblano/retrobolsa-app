import api from './api';

export interface Notificacao {
  id: string;
  type: 'RODADA_ABERTA' | 'RESULTADO_REVELADO' | 'TAREFA_NOVA' | 'MISSAO_CUMPRIDA' | string;
  title: string;
  body?: string | null;
  /** Endereço do app que a notificação abre. */
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export const NOTIFICACOES_POR_PAGINA = 20;

export const notificationService = {
  list: (page = 0) =>
    api.get<Notificacao[]>('/api/notifications', { params: { page, size: NOTIFICACOES_POR_PAGINA } }),
  unreadCount: async () => {
    const response = await api.get<{ count: number }>('/api/notifications/unread-count');
    return response.data.count;
  },
  /** Sem ids, marca todas como lidas. */
  markRead: (ids?: string[]) => api.post<void>('/api/notifications/read', ids ? { ids } : undefined),
};
