import axios from 'axios';

/**
 * Instância central do Axios para comunicação com a RetroBolsa API.
 *
 * - baseURL lida do .env (VITE_API_URL), com fallback para localhost:8080
 * - Interceptor de requisição: injeta automaticamente o JWT no header Authorization
 * - Interceptor de resposta: faz logout automático se o backend retornar 401
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor de Requisição ──────────────────────────────────────────────
// Injeta o token JWT em todas as requisições, caso o usuário esteja logado.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('retrobolsa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de Resposta ────────────────────────────────────────────────
// Se a API retornar 401 (token expirado ou inválido), limpa a sessão e
// redireciona para a tela de login sem exibir erros confusos ao usuário.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('retrobolsa_token');
      localStorage.removeItem('retrobolsa_user');
      // Dispara evento customizado para que o AuthContext reaja e redirecione
      window.dispatchEvent(new Event('retrobolsa:session-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
