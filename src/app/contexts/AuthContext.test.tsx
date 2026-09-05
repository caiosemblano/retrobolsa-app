import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: vi.fn(),
    getStoredUser: vi.fn(),
  },
}));

vi.mock('../services/userService', () => ({
  userService: { getProfile: vi.fn() },
}));

const mockedAuth = vi.mocked(authService);
const mockedUser = vi.mocked(userService);

function Consumidor() {
  const { user, login } = useAuth();
  return (
    <div>
      <span data-testid="username">{user?.username ?? 'sem-usuario'}</span>
      <button onClick={() => login({ email: 'ana@retrobolsa.com', senha: 'senha123' })}>
        Entrar
      </button>
    </div>
  );
}

function renderizar() {
  render(
    <AuthProvider>
      <Consumidor />
    </AuthProvider>,
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUser.getProfile.mockResolvedValue({
      data: { username: 'ana', email: 'ana@retrobolsa.com', role: 'PLAYER' },
    } as never);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('preenche o username ao restaurar a sessão do localStorage', async () => {
    mockedAuth.isAuthenticated.mockReturnValue(true);
    mockedAuth.getStoredUser.mockReturnValue({ email: 'ana@retrobolsa.com' });

    renderizar();

    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('ana'));
  });

  it('preenche o username após o login', async () => {
    mockedAuth.isAuthenticated.mockReturnValue(false);
    mockedAuth.getStoredUser.mockReturnValue(null);
    mockedAuth.login.mockResolvedValue({ token: 't', type: 'Bearer', expiresIn: 1 });

    renderizar();
    expect(screen.getByTestId('username')).toHaveTextContent('sem-usuario');

    mockedAuth.getStoredUser.mockReturnValue({ email: 'ana@retrobolsa.com' });
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('ana'));
  });

  it('não autentica quando não há sessão armazenada', async () => {
    mockedAuth.isAuthenticated.mockReturnValue(false);
    mockedAuth.getStoredUser.mockReturnValue(null);

    renderizar();

    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('sem-usuario'));
    expect(mockedUser.getProfile).not.toHaveBeenCalled();
  });
});
