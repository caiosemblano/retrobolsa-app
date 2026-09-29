import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TrocarSenhaForm } from './TrocarSenhaForm';
import { userService } from '../services/userService';

vi.mock('../services/userService', () => ({ userService: { changePassword: vi.fn() } }));

const preencher = async (user: ReturnType<typeof userEvent.setup>, atual: string, nova: string, confirmacao: string) => {
  await user.type(screen.getByLabelText('Senha atual'), atual);
  await user.type(screen.getByLabelText('Nova senha'), nova);
  await user.type(screen.getByLabelText('Confirmar a nova senha'), confirmacao);
  await user.click(screen.getByRole('button', { name: 'Trocar senha' }));
};

describe('TrocarSenhaForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('confere o tamanho e a confirmação antes de ir à API', async () => {
    const user = userEvent.setup();
    render(<TrocarSenhaForm onTrocada={vi.fn()} />);

    await preencher(user, 'velha-senha-1', 'curta', 'curta');
    expect(screen.getByRole('alert')).toHaveTextContent('no mínimo 8 caracteres');

    await user.clear(screen.getByLabelText('Nova senha'));
    await user.type(screen.getByLabelText('Nova senha'), 'nova-senha-9');
    await user.click(screen.getByRole('button', { name: 'Trocar senha' }));
    expect(screen.getByRole('alert')).toHaveTextContent('A confirmação é diferente da nova senha.');
    expect(userService.changePassword).not.toHaveBeenCalled();
  });

  it('mostra o motivo da API e, quando dá certo, avisa quem usa o formulário', async () => {
    vi.mocked(userService.changePassword)
      .mockRejectedValueOnce({ response: { data: { erro: 'A senha atual não confere.' } } })
      .mockResolvedValueOnce({} as never);
    const onTrocada = vi.fn();
    const user = userEvent.setup();
    render(<TrocarSenhaForm onTrocada={onTrocada} />);

    await preencher(user, 'errada-123', 'nova-senha-9', 'nova-senha-9');
    expect(await screen.findByRole('alert')).toHaveTextContent('A senha atual não confere.');

    await user.clear(screen.getByLabelText('Senha atual'));
    await user.type(screen.getByLabelText('Senha atual'), 'velha-senha-1');
    await user.clear(screen.getByLabelText('Nova senha'));
    await user.type(screen.getByLabelText('Nova senha'), 'nova-senha-9');
    await user.clear(screen.getByLabelText('Confirmar a nova senha'));
    await user.type(screen.getByLabelText('Confirmar a nova senha'), 'nova-senha-9');
    await user.click(screen.getByRole('button', { name: 'Trocar senha' }));

    expect(userService.changePassword).toHaveBeenLastCalledWith('velha-senha-1', 'nova-senha-9', 'nova-senha-9');
    expect(onTrocada).toHaveBeenCalled();
  });
});
