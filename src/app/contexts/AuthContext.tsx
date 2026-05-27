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
}

// ── Criação do Contexto ──────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Inicialização: restaura sessão do localStorage ─────────────────────────
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (authService.isAuthenticated() && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
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
      setUser(stored);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
