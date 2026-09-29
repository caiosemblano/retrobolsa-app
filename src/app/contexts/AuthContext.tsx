import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  authService,
  LoginPayload,
  RegisterPayload,
  StoredUser,
} from '../services/authService';
import { userService } from '../services/userService';

// ── Tipos do contexto ────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Usuário logado ou null se não autenticado. */
  user: StoredUser | null;
  /** True enquanto verifica a sessão inicial ou processa login/registro. */
  isLoading: boolean;
  /** True se há token válido no localStorage. */
  isAuthenticated: boolean;
  /** Faz login e atualiza o estado global. Lança exceção em caso de falha. */
  login: (data: LoginPayload) => Promise<void>;
  /** Registra um novo usuário. Lança exceção em caso de falha. */
  register: (data: RegisterPayload) => Promise<void>;
  /** Faz logout e limpa o estado global. */
  logout: () => void;
  /** Atualiza o usuário em memória (ex.: depois do primeiro acesso ou da troca de senha). */
  updateUser: (changes: Partial<StoredUser>) => void;
}

// ── Criação do Contexto ──────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Inicialização: restaura sessão do localStorage ─────────────────────────
  useEffect(() => {
    let storedUser: StoredUser | null = null;
    try {
      storedUser = authService.getStoredUser();
    } catch {
      authService.logout();
    }
    if (authService.isAuthenticated() && storedUser) {
      userService.getProfile()
        .then(({ data }) => setUser({
          email: data.email || storedUser!.email,
          role: data.role,
          username: data.username,
          onboarded: data.onboarded,
          mustChangePassword: data.mustChangePassword,
        }))
        .catch(() => setUser(storedUser))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Evento de sessão expirada (disparado pelo interceptor do Axios) ─────────
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
    };
    window.addEventListener('retrobolsa:session-expired', handleExpired);
    return () => {
      window.removeEventListener('retrobolsa:session-expired', handleExpired);
    };
  }, []);

  // ── Ações ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      const stored = authService.getStoredUser();
      if (stored) {
        const profile = await userService.getProfile();
        setUser({
          email: stored.email,
          role: profile.data.role,
          username: profile.data.username,
          onboarded: profile.data.onboarded,
          mustChangePassword: profile.data.mustChangePassword,
        });
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((changes: Partial<StoredUser>) => {
    setUser((atual) => (atual ? { ...atual, ...changes } : atual));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook de acesso ao contexto ───────────────────────────────────────────────

/**
 * Hook para acessar o contexto de autenticação em qualquer componente.
 * Lança erro se usado fora do AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>');
  }
  return ctx;
}
