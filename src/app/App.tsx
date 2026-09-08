import { useState } from 'react';
import { Toaster } from 'sonner';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home, GraduationCap, Trophy, User, LogOut, Shield, CandlestickChart } from 'lucide-react';

type Screen =
  | 'home'
  | 'learn'
  | 'rankings'
  | 'profile'
  | 'context'
  | 'portfolio'
  | 'simulation'
  | 'results'
  | 'login'
  | 'register'
  | 'admin';

// ── Componente interno que usa o AuthContext ─────────────────────────────────

function AppContent() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Enquanto verifica sessão inicial, mostra loading
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

  // ── Fluxo não autenticado ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    if (currentScreen === 'register') {
      return (
        <RegisterScreen
          onRegisterSuccess={() => setCurrentScreen('login')}
          onGoToLogin={() => setCurrentScreen('login')}
        />
      );
    }
    return (
      <LoginScreen
        onLoginSuccess={() => setCurrentScreen('home')}
        onGoToRegister={() => setCurrentScreen('register')}
      />
    );
  }

  // ── Fluxo autenticado ──────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartCompetition={() => setCurrentScreen('context')}
            onViewResults={() => setCurrentScreen('results')}
            onViewSimulationStatus={() => setCurrentScreen('simulation')}
          />
        );
      case 'learn':
        return <LearnScreen />;
      case 'rankings':
        return <RankingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return user?.role === 'ADMIN' ? <AdminScreen /> : (
          <HomeScreen
            onStartCompetition={() => setCurrentScreen('context')}
            onViewResults={() => setCurrentScreen('results')}
            onViewSimulationStatus={() => setCurrentScreen('simulation')}
          />
        );
      case 'context':
        return (
          <CompetitionContextScreen
            onNext={() => setCurrentScreen('portfolio')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'portfolio':
        return (
          <PortfolioBuilderScreen
            onConfirm={() => setCurrentScreen('simulation')}
            onBack={() => setCurrentScreen('context')}
          />
        );
      case 'simulation':
        return (
          <SimulationWaitScreen
            onViewResults={() => setCurrentScreen('results')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            onViewRanking={() => setCurrentScreen('rankings')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return (
          <HomeScreen
            onStartCompetition={() => setCurrentScreen('context')}
            onViewResults={() => setCurrentScreen('results')}
            onViewSimulationStatus={() => setCurrentScreen('simulation')}
          />
        );
    }
  };

  const mainScreens: Screen[] = ['home', 'learn', 'rankings', 'profile', ...(user?.role === 'ADMIN' ? ['admin' as Screen] : [])];
  const shouldShowNav = mainScreens.includes(currentScreen);

  const navItems: { screen: Screen; label: string; icon: typeof Home }[] = [
    { screen: 'home', label: 'Competir', icon: Home },
    { screen: 'learn', label: 'Aprender', icon: GraduationCap },
    { screen: 'rankings', label: 'Rankings', icon: Trophy },
    { screen: 'profile', label: 'Perfil', icon: User },
    ...(user?.role === 'ADMIN' ? [{ screen: 'admin' as Screen, label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-[0_8px_20px_-10px_var(--primary)]"
            >
              <CandlestickChart className="size-5" />
            </span>
            <div>
              <h1 className="font-display text-lg leading-tight">Cartola Financeiro</h1>
              <p className="text-muted-foreground text-xs">Simulador histórico de investimentos</p>
            </div>
          </div>
          {/* Botão de logout visível apenas nas telas principais */}
          {shouldShowNav && (
            <button
              onClick={logout}
              aria-label="Sair da conta"
              className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100dvh-9rem)]">{renderScreen()}</main>

      {/* Bottom Navigation */}
      {shouldShowNav && (
        <nav
          aria-label="Navegação principal"
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-4xl items-stretch justify-around">
            {navItems.map(({ screen, label, icon: Icon }) => {
              const isActive = currentScreen === screen;
              return (
                <button
                  key={screen}
                  onClick={() => setCurrentScreen(screen)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-1 pt-3 pb-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-0 h-0.5 w-10 rounded-full bg-primary transition-opacity duration-200 ${
                      isActive ? 'opacity-100 shadow-[0_0_12px_var(--primary)]' : 'opacity-0'
                    }`}
                  />
                  <Icon
                    className={`size-6 transition-transform duration-200 ease-out group-active:scale-90 motion-reduce:transition-none ${
                      isActive ? 'scale-110' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

// ── Root com Providers ────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        toastOptions={{
          style: { borderRadius: '14px' },
        }}
      />
    </AuthProvider>
  );
}
