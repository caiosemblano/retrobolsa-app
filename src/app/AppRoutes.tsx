import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, type Location } from 'react-router';
import { HomeScreen } from './components/screens/HomeScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { RankingsScreen } from './components/screens/RankingsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { CompetitionContextScreen } from './components/screens/CompetitionContextScreen';
import { PortfolioBuilderScreen } from './components/screens/PortfolioBuilderScreen';
import { SimulationWaitScreen } from './components/screens/SimulationWaitScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { rotas } from './routes';

/** Estado que a rota privada deixa ao mandar para o login, para voltar ao destino depois. */
interface EstadoDeLogin {
  from?: Location;
}

function destinoDepoisDoLogin(state: unknown): string {
  const from = (state as EstadoDeLogin | null)?.from;
  return from ? `${from.pathname}${from.search}${from.hash}` : rotas.inicio;
}

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={rotas.entrar} replace state={{ from: location } satisfies EstadoDeLogin} />;
  }
  return <Outlet />;
}

function RequireAdmin() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to={rotas.inicio} replace />;
}

/** Login e cadastro: quem já está logado segue para onde queria ir. */
function SomenteVisitante() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) return <Navigate to={destinoDepoisDoLogin(location.state)} replace />;
  return <Outlet />;
}

function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <LoginScreen
      // Ao logar, SomenteVisitante já redireciona para o destino guardado.
      onLoginSuccess={() => undefined}
      onGoToRegister={() => navigate(rotas.cadastro, { state: location.state })}
    />
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const irParaLogin = () => navigate(rotas.entrar, { state: location.state });
  return <RegisterScreen onRegisterSuccess={irParaLogin} onGoToLogin={irParaLogin} />;
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <HomeScreen
      onStartCompetition={() => navigate(rotas.contexto)}
      onViewResults={() => navigate(rotas.resultado)}
      onViewSimulationStatus={() => navigate(rotas.aguardando)}
    />
  );
}

function ContextRoute() {
  const navigate = useNavigate();
  return (
    <CompetitionContextScreen
      onNext={() => navigate(rotas.carteira)}
      onBack={() => navigate(rotas.inicio)}
    />
  );
}

function PortfolioRoute() {
  const navigate = useNavigate();
  return (
    <PortfolioBuilderScreen
      // replace: depois de enviada, voltar pelo histórico não deve reabrir a montagem da mesma carteira.
      onConfirm={() => navigate(rotas.aguardando, { replace: true })}
      onBack={() => navigate(rotas.contexto)}
    />
  );
}

function SimulationRoute() {
  const navigate = useNavigate();
  return (
    <SimulationWaitScreen
      onViewResults={() => navigate(rotas.resultado)}
      onBack={() => navigate(rotas.inicio)}
    />
  );
}

function ResultsRoute() {
  const navigate = useNavigate();
  return (
    <ResultsScreen
      onViewRanking={() => navigate(rotas.rankings)}
      onBack={() => navigate(rotas.inicio)}
    />
  );
}

export function AppRoutes() {
  const { isLoading } = useAuth();

  // Enquanto verifica a sessão (ou processa o login), mostra o carregamento.
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-primary/25 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando pregão...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<SomenteVisitante />}>
        <Route path={rotas.entrar} element={<LoginRoute />} />
        <Route path={rotas.cadastro} element={<RegisterRoute />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route
          element={
            <ProgressProvider>
              <AppLayout />
            </ProgressProvider>
          }
        >
          <Route index element={<HomeRoute />} />
          {/* Uma rota só para as três visões de Aprender: a lista de aulas não é recarregada ao navegar entre elas. */}
          <Route path="aprender/:moduloId?/:aulaId?" element={<LearnScreen />} />
          <Route path={rotas.rankings} element={<RankingsScreen />} />
          <Route path={rotas.perfil} element={<ProfileScreen />} />
          <Route element={<RequireAdmin />}>
            <Route path={rotas.admin} element={<AdminScreen />} />
          </Route>
          <Route path={rotas.contexto} element={<ContextRoute />} />
          <Route path={rotas.carteira} element={<PortfolioRoute />} />
          <Route path={rotas.aguardando} element={<SimulationRoute />} />
          <Route path={rotas.resultado} element={<ResultsRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={rotas.inicio} replace />} />
    </Routes>
  );
}
