import api from './api';

// ── Tipos dos payloads ──────────────────────────────────────────────────────

export interface RegisterPayload {
  username: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  expiresIn: number;
}

export interface StoredUser {
  email: string;
}

// ── Service ─────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Registra um novo usuário na API.
   * Em caso de sucesso (201), não retorna corpo — apenas indica que o
   * cadastro foi criado. O frontend deve redirecionar para login.
   */
  register: (data: RegisterPayload) =>
    api.post<void>('/api/auth/register', data),

  /**
   * Autentica o usuário e armazena o token JWT no localStorage.
   * Retorna o AuthResponse para que o contexto possa atualizar o estado global.
   */
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    const { token, type, expiresIn } = res.data;
    localStorage.setItem('retrobolsa_token', token);
    localStorage.setItem('retrobolsa_user', JSON.stringify({ email: data.email }));
    return { token, type, expiresIn };
  },

  /** Remove a sessão local. O token no backend expira naturalmente. */
  logout: () => {
    localStorage.removeItem('retrobolsa_token');
    localStorage.removeItem('retrobolsa_user');
  },

  /** Verifica se há uma sessão ativa (token presente no localStorage). */
  isAuthenticated: (): boolean =>
    !!localStorage.getItem('retrobolsa_token'),

  /** Retorna os dados básicos do usuário armazenados localmente. */
  getStoredUser: (): StoredUser | null => {
    const raw = localStorage.getItem('retrobolsa_user');
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  },
};
