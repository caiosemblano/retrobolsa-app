import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SuaConta } from './SuaConta';
import { userService } from '../services/userService';

const logout = vi.fn();
let papel = 'PLAYER';
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ user: { email: 'a@b.c', role: papel }, logout }) }));
vi.mock('../services/userService', () => ({
  userService: { changePassword: vi.fn(), downloadMyData: vi.fn(), deleteAccount: vi.fn() },
}));

describe('SuaConta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    papel = 'PLAYER';
  });

  it('baixa os dados da pessoa', async () => {
    vi.mocked(userService.downloadMyData).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SuaConta />);

    await user.click(screen.getByRole('button', { name: 'Baixar' }));
    expect(userService.downloadMyData).toHaveBeenCalled();
  });

  it('excluir a conta pede a senha, mostra o motivo da recusa e, confirmada, sai da conta', async () => {
    vi.mocked(userService.deleteAccount)
      .mockRejectedValueOnce({ response: { data: { erro: 'A senha não confere.' } } })
      .mockResolvedValueOnce({} as never);
    const user = userEvent.setup();
    render(<SuaConta />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialogo = await screen.findByRole('dialog', { name: 'Excluir a sua conta?' });
    await user.click(within(dialogo).getByRole('button', { name: 'Excluir para sempre' }));
    expect(within(dialogo).getByRole('alert')).toHaveTextContent('Digite a sua senha para confirmar.');

    await user.type(within(dialogo).getByLabelText('Sua senha'), 'errada-123');
    await user.click(within(dialogo).getByRole('button', { name: 'Excluir para sempre' }));
    expect(await within(dialogo).findByRole('alert')).toHaveTextContent('A senha não confere.');
    expect(logout).not.toHaveBeenCalled();

    await user.clear(within(dialogo).getByLabelText('Sua senha'));
    await user.type(within(dialogo).getByLabelText('Sua senha'), 'senha-certa-1');
    await user.click(within(dialogo).getByRole('button', { name: 'Excluir para sempre' }));
    expect(userService.deleteAccount).toHaveBeenLastCalledWith('senha-certa-1');
    expect(logout).toHaveBeenCalled();
  });

  it('avisa o professor de que as turmas dele também somem', async () => {
    papel = 'TEACHER';
    const user = userEvent.setup();
    render(<SuaConta />);

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('As turmas que você criou também são apagadas');
  });
});
