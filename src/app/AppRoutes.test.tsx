import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation, useNavigate, type Location, type NavigateFunction } from 'react-router';
import { AppRoutes } from './AppRoutes';
import { useAuth } from './contexts/AuthContext';

vi.mock('./contexts/AuthContext', () => ({ useAuth: vi.fn() }));
// O progresso (XP e comemoração) tem testes próprios; aqui ele só não pode ir à rede.
vi.mock('./services/progressService', () => ({
  progressService: {
    get: vi.fn().mockResolvedValue({ data: { xp: 0, level: 1, levelTitle: 'Curioso', levelMinXp: 0, nextLevelMinXp: 50, streakWeeks: 0 } }),
    news: vi.fn().mockResolvedValue({ data: { items: [], xpGained: 0, levelUp: false, level: 1, levelTitle: 'Curioso', achievements: [] } }),
    acknowledge: vi.fn(),
  },
  progressoNoNivel: () => 0,
}));

vi.mock('./services/missionService', () => ({ missionService: { visit: vi.fn().mockResolvedValue({}) } }));
vi.mock('./services/notificationService', () => ({
  NOTIFICACOES_POR_PAGINA: 20,
  notificationService: { unreadCount: vi.fn().mockResolvedValue(0), list: vi.fn(), markRead: vi.fn() },
}));

// As telas viram botões simples: aqui o que se testa é a navegação entre elas.
vi.mock('./components/screens/HomeScreen', () => ({
  HomeScreen: (p: { onStartCompetition: () => void; onTrain: () => void }) => (
    <div>
      <h2>Tela Competir</h2>
      <button onClick={p.onStartCompetition}>Começar rodada</button>
      <button onClick={p.onTrain}>Treinar</button>
    </div>
  ),
}));
vi.mock('./components/screens/TreinarScreen', () => ({
  TreinarScreen: (p: { onEscolher: (id: string) => void }) => (
    <div>
      <h2>Tela Treinar</h2>
      <button onClick={() => p.onEscolher('r7')}>Treinar a rodada 7</button>
    </div>
  ),
}));
vi.mock('./components/screens/TreinoScreen', () => ({
  TreinoScreen: (p: { rodadaId: string; onVoltar: () => void }) => (
    <div>
      <h2>Tela Treino {p.rodadaId}</h2>
      <button onClick={p.onVoltar}>Outras rodadas</button>
    </div>
  ),
}));
vi.mock('./components/screens/CompetitionContextScreen', () => ({
  CompetitionContextScreen: (p: { onNext: () => void }) => (
    <div>
      <h2>Tela Contexto</h2>
      <button onClick={p.onNext}>Escolher ativos</button>
    </div>
  ),
}));
vi.mock('./components/screens/PortfolioBuilderScreen', () => ({
  PortfolioBuilderScreen: (p: { onConfirm: () => void }) => (
    <div>
      <h2>Tela Carteira</h2>
      <button onClick={p.onConfirm}>Confirmar carteira</button>
    </div>
  ),
}));
vi.mock('./components/screens/SimulationWaitScreen', () => ({ SimulationWaitScreen: () => <h2>Tela Aguardando</h2> }));
vi.mock('./components/screens/ResultsScreen', () => ({ ResultsScreen: () => <h2>Tela Resultado</h2> }));
vi.mock('./components/screens/LearnScreen', () => ({ LearnScreen: () => <h2>Tela Aprender</h2> }));
vi.mock('./components/screens/RankingsScreen', () => ({ RankingsScreen: () => <h2>Tela Rankings</h2> }));
vi.mock('./components/screens/ProfileScreen', () => ({ ProfileScreen: () => <h2>Tela Perfil</h2> }));
vi.mock('./components/screens/AdminScreen', () => ({ AdminScreen: () => <h2>Tela Admin</h2> }));
vi.mock('./components/screens/ProfessorScreen', () => ({ ProfessorScreen: () => <h2>Tela Professor</h2> }));
vi.mock('./components/screens/LoginScreen', () => ({
  LoginScreen: (p: { onGoToRegister: () => void }) => (
    <div>
      <h2>Tela Login</h2>
      <button onClick={p.onGoToRegister}>Criar conta</button>
    </div>
  ),
}));
vi.mock('./components/screens/RegisterScreen', () => ({
  RegisterScreen: (p: { onGoToLogin: () => void }) => (
    <div>
      <h2>Tela Cadastro</h2>
      <button onClick={p.onGoToLogin}>Já tenho conta</button>
    </div>
  ),
}));

const mockedUseAuth = vi.mocked(useAuth);

type Sessao = 'visitante' | 'jogador' | 'admin' | 'professor' | 'novato' | 'carregando';

const autenticar = (sessao: Sessao) => {
  const user =
    sessao === 'jogador' ? { username: 'ana', email: 'ana@retrobolsa.com', role: 'PLAYER' }
    : sessao === 'admin' ? { username: 'root', email: 'root@retrobolsa.com', role: 'ADMIN' }
    : sessao === 'professor' ? { username: 'marta', email: 'marta@retrobolsa.com', role: 'TEACHER' }
    : sessao === 'novato' ? { username: 'caio', email: 'caio@retrobolsa.com', role: 'PLAYER', onboarded: false }
    : null;
  mockedUseAuth.mockReturnValue({
    user,
    isAuthenticated: !!user,
    isLoading: sessao === 'carregando',
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  } as ReturnType<typeof useAuth>);
};

// Expõe o navigate e a location atuais, como faria o botão voltar do navegador.
const router = {} as { navigate: NavigateFunction; state: { location: Location } };
function Espiao() {
  router.navigate = useNavigate();
  router.state = { location: useLocation() };
  return null;
}

const arvore = (caminho: string) => (
  <MemoryRouter initialEntries={[caminho]}>
    <AppRoutes />
    <Espiao />
  </MemoryRouter>
);

const abrir = (caminho: string) => {
  const utils = render(arvore(caminho));
  // Rerenderiza a mesma árvore: o MemoryRouter mantém o histórico e só a sessão muda.
  const rerender = () => utils.rerender(arvore(caminho));
  return { ...utils, router, rerender };
};

const titulo = (nome: string) => screen.getByRole('heading', { name: nome });

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cada tela principal tem o seu endereço', () => {
    autenticar('jogador');
    for (const [caminho, tela] of [
      ['/', 'Tela Competir'],
      ['/aprender', 'Tela Aprender'],
      ['/aprender/m1/a1', 'Tela Aprender'],
      ['/rankings', 'Tela Rankings'],
      ['/perfil', 'Tela Perfil'],
      ['/rodada/resultado', 'Tela Resultado'],
    ]) {
      const { unmount } = abrir(caminho);
      expect(titulo(tela)).toBeInTheDocument();
      unmount();
    }
  });

  it('visitante numa rota privada vai para o login e, depois de entrar, volta para onde queria', () => {
    autenticar('visitante');
    const { router, rerender } = abrir('/perfil');

    expect(titulo('Tela Login')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/entrar');

    autenticar('jogador');
    rerender();

    expect(titulo('Tela Perfil')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/perfil');
  });

  it('o destino guardado sobrevive a uma ida ao cadastro e volta ao login', async () => {
    autenticar('visitante');
    const user = userEvent.setup();
    const { router, rerender } = abrir('/rankings');

    await user.click(screen.getByRole('button', { name: 'Criar conta' }));
    expect(titulo('Tela Cadastro')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Já tenho conta' }));
    expect(titulo('Tela Login')).toBeInTheDocument();

    autenticar('jogador');
    rerender();
    expect(router.state.location.pathname).toBe('/rankings');
  });

  it('quem já está logado não vê o login', () => {
    autenticar('jogador');
    const { router } = abrir('/entrar');
    expect(router.state.location.pathname).toBe('/');
    expect(titulo('Tela Competir')).toBeInTheDocument();
  });

  it('/admin só abre para ADMIN, e o item Admin só aparece para ele', () => {
    autenticar('jogador');
    const jogador = abrir('/admin');
    expect(jogador.router.state.location.pathname).toBe('/');
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
    jogador.unmount();

    autenticar('admin');
    abrir('/admin');
    expect(titulo('Tela Admin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('aria-current', 'page');
  });

  it('endereço desconhecido cai na tela inicial', () => {
    autenticar('jogador');
    const { router } = abrir('/nao-existe');
    expect(router.state.location.pathname).toBe('/');
  });

  it('o fluxo da rodada navega por endereço e o voltar do histórico não reabre a carteira enviada', async () => {
    autenticar('jogador');
    const user = userEvent.setup();
    const { router } = abrir('/');

    await user.click(screen.getByRole('button', { name: 'Começar rodada' }));
    expect(router.state.location.pathname).toBe('/rodada/contexto');
    await user.click(screen.getByRole('button', { name: 'Escolher ativos' }));
    expect(router.state.location.pathname).toBe('/rodada/carteira');
    await user.click(screen.getByRole('button', { name: 'Confirmar carteira' }));
    expect(titulo('Tela Aguardando')).toBeInTheDocument();

    // O botão voltar do celular: da espera volta para o contexto, não para a carteira já enviada.
    await act(async () => router.navigate(-1));
    expect(titulo('Tela Contexto')).toBeInTheDocument();
    await act(async () => router.navigate(-1));
    expect(titulo('Tela Competir')).toBeInTheDocument();
  });

  it('o treino tem endereço próprio: da tela inicial para a lista e da lista para a rodada escolhida', async () => {
    autenticar('jogador');
    const user = userEvent.setup();
    const { router } = abrir('/');

    await user.click(screen.getByRole('button', { name: 'Treinar' }));
    expect(router.state.location.pathname).toBe('/treinar');
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Treinar a rodada 7' }));
    expect(router.state.location.pathname).toBe('/treinar/r7');
    expect(titulo('Tela Treino r7')).toBeInTheDocument();
    // A montagem tem a própria barra de confirmação fixa: a bottom nav sai do caminho.
    expect(screen.queryByRole('navigation', { name: 'Navegação principal' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outras rodadas' }));
    expect(titulo('Tela Treinar')).toBeInTheDocument();
  });

  it('a bottom nav troca de tela, marca a atual e some no fluxo da rodada', async () => {
    autenticar('jogador');
    const user = userEvent.setup();
    const { router } = abrir('/');

    expect(screen.getByRole('link', { name: 'Competir' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('link', { name: 'Aprender' }));
    expect(titulo('Tela Aprender')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aprender' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Competir' })).not.toHaveAttribute('aria-current');

    await act(async () => router.navigate('/rodada/contexto'));
    expect(screen.queryByRole('navigation', { name: 'Navegação principal' })).not.toBeInTheDocument();
  });

  it('o cabeçalho mostra o nível e leva ao perfil', async () => {
    autenticar('jogador');
    const user = userEvent.setup();
    abrir('/');

    const chip = await screen.findByRole('link', { name: 'Nível 1, Curioso: 0 XP. Ver perfil' });
    await user.click(chip);
    expect(titulo('Tela Perfil')).toBeInTheDocument();
  });

  it('a área do professor é só do professor, que a encontra na bottom nav', () => {
    autenticar('jogador');
    let tela = abrir('/professor/t1');
    expect(titulo('Tela Competir')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Professor' })).not.toBeInTheDocument();
    tela.unmount();

    autenticar('professor');
    tela = abrir('/professor/t1');
    expect(titulo('Tela Professor')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Professor' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('no primeiro acesso aparece o passo a passo; depois, não', async () => {
    autenticar('novato');
    const { unmount } = abrir('/');
    expect(await screen.findByRole('dialog', { name: 'Como funciona uma rodada' })).toBeInTheDocument();
    unmount();

    autenticar('jogador');
    abrir('/');
    expect(titulo('Tela Competir')).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Como funciona uma rodada' })).not.toBeInTheDocument();
  });

  it('mostra o carregamento enquanto verifica a sessão', () => {
    autenticar('carregando');
    abrir('/perfil');
    expect(screen.getByText('Carregando pregão...')).toBeInTheDocument();
  });
});
