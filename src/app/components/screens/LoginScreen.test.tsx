import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { useAuth } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const login = vi.fn();
const register = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  login.mockResolvedValue(undefined);
  register.mockResolvedValue(undefined);
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login,
    register,
    logout: vi.fn(),
  } as ReturnType<typeof useAuth>);
});

// O que o aluno digita tem de chegar à API. O <Input> do tema não repassava a
// ref do react-hook-form, e o formulário acusava "campo obrigatório" mesmo preenchido.
describe('formulários de acesso', () => {
  it('o login envia o e-mail e a senha digitados', async () => {
    const user = userEvent.setup();
    const onLoginSuccess = vi.fn();
    render(<LoginScreen onLoginSuccess={onLoginSuccess} onGoToRegister={vi.fn()} />);

    await user.type(screen.getByLabelText('E-mail'), 'ana@escola.test');
    await user.type(screen.getByLabelText('Senha'), 'senhaDeTeste1');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(login).toHaveBeenCalledWith({ email: 'ana@escola.test', senha: 'senhaDeTeste1' });
    expect(onLoginSuccess).toHaveBeenCalled();
  });

  it('o login vazio mostra os avisos e não chama a API', async () => {
    const user = userEvent.setup();
    render(<LoginScreen onLoginSuccess={vi.fn()} onGoToRegister={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Preencha o e-mail.')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('o cadastro envia os campos digitados', async () => {
    const user = userEvent.setup();
    render(<RegisterScreen onRegisterSuccess={vi.fn()} onGoToLogin={vi.fn()} />);

    await user.type(screen.getByLabelText('Nome de usuário'), 'ana_escola');
    await user.type(screen.getByLabelText('E-mail'), 'ana@escola.test');
    await user.type(screen.getByLabelText('Senha'), 'senhaDeTeste1');
    await user.type(screen.getByLabelText('Confirmar senha'), 'senhaDeTeste1');
    await user.click(screen.getByRole('checkbox', { name: /Tenho 18 anos ou mais/ }));
    await user.click(screen.getByRole('button', { name: /Criar conta/ }));

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'ana_escola', email: 'ana@escola.test', senha: 'senhaDeTeste1', aceiteTermos: true }),
    );
  });
});
