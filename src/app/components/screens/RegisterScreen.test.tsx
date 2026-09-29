import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterScreen } from './RegisterScreen';

const registrar = vi.fn();
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ register: registrar, isLoading: false }) }));

const preencher = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Nome de usuário'), 'ana_retro');
  await user.type(screen.getByLabelText('E-mail'), 'ana@escola.com');
  await user.type(screen.getByLabelText('Senha'), 'senha-forte-1');
  await user.type(screen.getByLabelText('Confirmar senha'), 'senha-forte-1');
};

describe('RegisterScreen', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exige a caixa de idade ou autorização do responsável', async () => {
    const user = userEvent.setup();
    render(<RegisterScreen onRegisterSuccess={vi.fn()} onGoToLogin={vi.fn()} />);
    await preencher(user);

    await user.click(screen.getByRole('button', { name: /Criar conta/ }));

    expect(await screen.findByText('Marque esta caixa para criar a conta.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Tenho 18 anos ou mais/ })).toHaveAttribute('aria-invalid', 'true');
    expect(registrar).not.toHaveBeenCalled();
  });

  it('com a caixa marcada, envia o aceite junto com o cadastro', async () => {
    registrar.mockResolvedValue(undefined);
    const onRegisterSuccess = vi.fn();
    const user = userEvent.setup();
    render(<RegisterScreen onRegisterSuccess={onRegisterSuccess} onGoToLogin={vi.fn()} />);
    await preencher(user);

    await user.click(screen.getByRole('checkbox', { name: /Tenho 18 anos ou mais/ }));
    await user.click(screen.getByRole('button', { name: /Criar conta/ }));

    expect(registrar).toHaveBeenCalledWith(expect.objectContaining({ username: 'ana_retro', aceiteTermos: true }));
    expect(onRegisterSuccess).toHaveBeenCalled();
  });
});
