import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { Professores } from './Professores';
import { adminUserService, UsuarioDoAdmin } from '../../services/adminUserService';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../services/adminUserService', () => ({
  adminUserService: { search: vi.fn(), changeRole: vi.fn() },
}));

const usuario = (overrides: Partial<UsuarioDoAdmin>): UsuarioDoAdmin => ({
  id: 'u1', username: 'joao', email: 'joao@escola.com', role: 'PLAYER', ...overrides,
});

describe('Professores (admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminUserService.search).mockImplementation(async (q: string) => ({
      data: q ? [usuario({})] : [usuario({ id: 'u2', username: 'marta', email: 'marta@escola.com', role: 'TEACHER' })],
    }) as never);
  });

  it('abre com os professores atuais', async () => {
    render(<Professores />);
    expect(await screen.findByText('Professores atuais')).toBeInTheDocument();
    expect(screen.getByText('marta')).toBeInTheDocument();
    expect(adminUserService.search).toHaveBeenCalledWith('');
  });

  it('busca alguém e o promove a professor', async () => {
    vi.mocked(adminUserService.changeRole).mockResolvedValue({ data: usuario({ role: 'TEACHER' }) } as never);
    const user = userEvent.setup();
    render(<Professores />);
    await screen.findByText('marta');

    await user.type(screen.getByRole('textbox', { name: 'Buscar usuário' }), 'joao');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    const item = (await screen.findAllByRole('listitem'))[0];
    expect(item).toHaveTextContent('joao@escola.com');
    await user.click(within(item).getByRole('button', { name: 'Tornar professor' }));

    expect(adminUserService.changeRole).toHaveBeenCalledWith('u1', 'TEACHER');
    expect(toast.success).toHaveBeenCalledWith('joao agora é professor(a).');
    expect(await within(item).findByRole('button', { name: 'Voltar a jogador' })).toBeInTheDocument();
  });

  it('mostra o motivo quando a API recusa', async () => {
    vi.mocked(adminUserService.changeRole).mockRejectedValue({
      response: { data: { erro: 'O papel de um administrador não muda por aqui.' } },
    });
    const user = userEvent.setup();
    render(<Professores />);
    await user.click(await screen.findByRole('button', { name: 'Voltar a jogador' }));

    expect(toast.error).toHaveBeenCalledWith('O papel de um administrador não muda por aqui.');
  });
});
