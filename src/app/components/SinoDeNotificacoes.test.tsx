import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { SinoDeNotificacoes } from './SinoDeNotificacoes';
import { Notificacao, notificationService } from '../services/notificationService';

vi.mock('../services/notificationService', () => ({
  NOTIFICACOES_POR_PAGINA: 2,
  notificationService: { unreadCount: vi.fn(), list: vi.fn(), markRead: vi.fn() },
}));

const notificacao = (overrides: Partial<Notificacao>): Notificacao => ({
  id: 'n1',
  type: 'RODADA_ABERTA',
  title: 'Rodada 5 aberta',
  body: 'Nova matriz econômica. Monte sua carteira até 08/10.',
  link: '/rodada/contexto',
  read: false,
  createdAt: '2026-09-29T10:00:00',
  ...overrides,
});

function Onde() {
  return <p>Você está em {useLocation().pathname}</p>;
}

const renderizar = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <SinoDeNotificacoes />
      <Routes>
        <Route path="*" element={<Onde />} />
      </Routes>
    </MemoryRouter>,
  );

describe('SinoDeNotificacoes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notificationService.markRead).mockResolvedValue({} as never);
  });

  it('mostra quantas não foram lidas e, ao abrir, lista e marca como lidas as novas', async () => {
    vi.mocked(notificationService.unreadCount).mockResolvedValue(1);
    vi.mocked(notificationService.list).mockResolvedValue({
      data: [notificacao({}), notificacao({ id: 'n2', type: 'MISSAO_CUMPRIDA', title: 'Missão cumprida: Faça um treino', body: '+20 XP', link: '/', read: true })],
    } as never);
    const user = userEvent.setup();
    renderizar();

    const sino = await screen.findByRole('button', { name: 'Notificações: 1 não lida' });
    await user.click(sino);

    const gaveta = await screen.findByRole('dialog', { name: 'Notificações' });
    expect(within(gaveta).getByText('Nova:')).toBeInTheDocument();
    expect(within(gaveta).getByText('Missão cumprida: Faça um treino')).toBeInTheDocument();
    expect(notificationService.markRead).toHaveBeenCalledWith(['n1']);

    // Fechada a gaveta, o sino já não conta a que foi vista.
    await user.keyboard('{Escape}');
    expect(await screen.findByRole('button', { name: 'Notificações' })).toBeInTheDocument();
  });

  it('clicar numa notificação leva ao endereço dela e fecha a gaveta', async () => {
    vi.mocked(notificationService.unreadCount).mockResolvedValue(0);
    vi.mocked(notificationService.list).mockResolvedValue({ data: [notificacao({ read: true })] } as never);
    const user = userEvent.setup();
    renderizar();

    await user.click(await screen.findByRole('button', { name: 'Notificações' }));
    await user.click(await screen.findByRole('button', { name: /Rodada 5 aberta/ }));

    expect(await screen.findByText('Você está em /rodada/contexto')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('sem notificações, diz que não há nada; com página cheia, oferece carregar mais', async () => {
    vi.mocked(notificationService.unreadCount).mockResolvedValue(0);
    vi.mocked(notificationService.list)
      .mockResolvedValueOnce({ data: [notificacao({ read: true }), notificacao({ id: 'n2', read: true })] } as never)
      .mockResolvedValueOnce({ data: [notificacao({ id: 'n3', title: 'A mais antiga', read: true })] } as never);
    const user = userEvent.setup();
    renderizar();

    await user.click(await screen.findByRole('button', { name: 'Notificações' }));
    await user.click(await screen.findByRole('button', { name: 'Carregar mais' }));

    expect(await screen.findByText('A mais antiga')).toBeInTheDocument();
    expect(notificationService.list).toHaveBeenLastCalledWith(1);
    expect(screen.queryByRole('button', { name: 'Carregar mais' })).not.toBeInTheDocument();
  });
});
