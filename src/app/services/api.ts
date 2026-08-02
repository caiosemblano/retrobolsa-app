import axios from 'axios';
import { toast } from 'sonner';

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
// Trata erros globais da API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Falha de conexão com o servidor. Verifique sua internet.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        localStorage.removeItem('retrobolsa_token');
        localStorage.removeItem('retrobolsa_user');
        window.dispatchEvent(new Event('retrobolsa:session-expired'));
        break;
      
      case 400:
        // O backend pode retornar um array de erros ou uma string
        if (data.erro && Array.isArray(data.erro)) {
          data.erro.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(data.erro || 'Requisição inválida. Verifique os dados enviados.');
        }
        break;
        
      case 409:
        toast.error('Conflito: Esta operação já foi realizada ou os dados já existem.');
        break;
        
      case 422:
        toast.error(data.erro || 'Não foi possível processar a requisição com os dados fornecidos.');
        break;
        
      case 500:
        toast.error('Erro interno no servidor. Tente novamente mais tarde.');
        break;
    }
    
    return Promise.reject(error);
  }
);

export default api;
