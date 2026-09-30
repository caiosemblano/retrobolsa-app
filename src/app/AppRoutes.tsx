import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams, type Location } from 'react-router';
import { HomeScreen } from './components/screens/HomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { AppLayout } from './components/AppLayout';
// Cada tela abaixo vira um arquivo separado, baixado só quando é aberta: o app
// começa leve (tela inicial, login e cadastro) e o resto chega sob demanda.
const LearnScreen = lazy(() => import('./components/screens/LearnScreen').then((m) => ({ default: m.LearnScreen })));
const RankingsScreen = lazy(() => import('./components/screens/RankingsScreen').then((m) => ({ default: m.RankingsScreen })));
const ProfileScreen = lazy(() => import('./components/screens/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));
const CompetitionContextScreen = lazy(() => import('./components/screens/CompetitionContextScreen').then((m) => ({ default: m.CompetitionContextScreen })));
const PortfolioBuilderScreen = lazy(() => import('./components/screens/PortfolioBuilderScreen').then((m) => ({ default: m.PortfolioBuilderScreen })));
const SimulationWaitScreen = lazy(() => import('./components/screens/SimulationWaitScreen').then((m) => ({ default: m.SimulationWaitScreen })));
const ResultsScreen = lazy(() => import('./components/screens/ResultsScreen').then((m) => ({ default: m.ResultsScreen })));
const AdminScreen = lazy(() => import('./components/screens/AdminScreen').then((m) => ({ default: m.AdminScreen })));
const TreinarScreen = lazy(() => import('./components/screens/TreinarScreen').then((m) => ({ default: m.TreinarScreen })));
const ProfessorScreen = lazy(() => import('./components/screens/ProfessorScreen').then((m) => ({ default: m.ProfessorScreen })));
const ComoFuncionaScreen = lazy(() => import('./components/screens/ComoFuncionaScreen').then((m) => ({ default: m.ComoFuncionaScreen })));
const TrocarSenhaScreen = lazy(() => import('./components/screens/TrocarSenhaScreen').then((m) => ({ default: m.TrocarSenhaScreen })));
const TreinoScreen = lazy(() => import('./components/screens/TreinoScreen').then((m) => ({ default: m.TreinoScreen })));
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
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={rotas.entrar} replace state={{ from: location } satisfies EstadoDeLogin} />;
  }
  // Com a senha temporária do admin, nada abre antes de criar uma senha nova.
  if (user?.mustChangePassword && location.pathname !== rotas.trocarSenha) {
    return <Navigate to={rotas.trocarSenha} replace />;
  }
  return <Outlet />;
}

function TrocarSenhaRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user?.mustChangePassword) return <Navigate to={rotas.inicio} replace />;
  return <TrocarSenhaScreen onTrocada={() => navigate(rotas.inicio, { replace: true })} />;
}

function RequireAdmin() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to={rotas.inicio} replace />;
}

function RequireTeacher() {
  const { user } = useAuth();
  return user?.role === 'TEACHER' ? <Outlet /> : <Navigate to={rotas.inicio} replace />;
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
      onTrain={() => navigate(rotas.treinar)}
    />
  );
}

function TreinarRoute() {
  const navigate = useNavigate();
  return <TreinarScreen onEscolher={(id) => navigate(rotas.treino(id))} onBack={() => navigate(rotas.inicio)} />;
}

function TreinoRoute() {
  const navigate = useNavigate();
  const { rodadaId = '' } = useParams();
  // key: trocar de rodada começa um treino do zero.
  return <TreinoScreen key={rodadaId} rodadaId={rodadaId} onVoltar={() => navigate(rotas.treinar)} />;
}

function ComoFuncionaRoute() {
  const navigate = useNavigate();
  return <ComoFuncionaScreen onBack={() => navigate(-1)} />;
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
      onEdit={() => navigate(rotas.carteira)}
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
  if (isLoading) return <Carregando />;

  return (
    <Suspense fallback={<Carregando />}>
    <Routes>
      <Route element={<SomenteVisitante />}>
        <Route path={rotas.entrar} element={<LoginRoute />} />
        <Route path={rotas.cadastro} element={<RegisterRoute />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path={rotas.trocarSenha} element={<TrocarSenhaRoute />} />
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
          <Route path={rotas.comoFunciona} element={<ComoFuncionaRoute />} />
          <Route element={<RequireAdmin />}>
            <Route path={rotas.admin} element={<AdminScreen />} />
          </Route>
          <Route element={<RequireTeacher />}>
            <Route path="professor/:turmaId?" element={<ProfessorScreen />} />
          </Route>
          <Route path={rotas.contexto} element={<ContextRoute />} />
          <Route path={rotas.carteira} element={<PortfolioRoute />} />
          <Route path={rotas.aguardando} element={<SimulationRoute />} />
          <Route path={rotas.resultado} element={<ResultsRoute />} />
          <Route path={rotas.treinar} element={<TreinarRoute />} />
          <Route path="treinar/:rodadaId" element={<TreinoRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={rotas.inicio} replace />} />
    </Routes>
    </Suspense>
  );
}

function Carregando() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="w-10 h-10 border-4 border-primary/25 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Carregando pregão...</p>
      </div>
    </div>
  );
}
