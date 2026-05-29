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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home, GraduationCap, Trophy, User, LogOut } from 'lucide-react';

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
  | 'register';

// ── Componente interno que usa o AuthContext ─────────────────────────────────

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Enquanto verifica sessão inicial, mostra loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-300 text-sm">Carregando...</p>
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
          />
        );
      case 'learn':
        return <LearnScreen />;
      case 'rankings':
        return <RankingsScreen />;
      case 'profile':
        return <ProfileScreen />;
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
        return <SimulationWaitScreen />;
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
          />
        );
    }
  };

  const mainScreens: Screen[] = ['home', 'learn', 'rankings', 'profile'];
  const shouldShowNav = mainScreens.includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl">📊 Cartola Financeiro</h1>
            <p className="text-blue-100 text-sm">Simulador Histórico de Investimentos</p>
          </div>
          {/* Botão de logout visível apenas nas telas principais */}
          {shouldShowNav && (
            <button
              onClick={logout}
              title="Sair da conta"
              className="flex items-center gap-1.5 text-sm text-blue-100 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-120px)]">{renderScreen()}</main>

      {/* Bottom Navigation */}
      {shouldShowNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                currentScreen === 'home' ? 'text-orange-500' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Competir</span>
            </button>

            <button
              onClick={() => setCurrentScreen('learn')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                currentScreen === 'learn' ? 'text-orange-500' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-xs">Aprender</span>
            </button>

            <button
              onClick={() => setCurrentScreen('rankings')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                currentScreen === 'rankings' ? 'text-orange-500' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">Rankings</span>
            </button>

            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                currentScreen === 'profile' ? 'text-orange-500' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Perfil</span>
            </button>
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
        richColors
        toastOptions={{
          style: { borderRadius: '12px' },
        }}
      />
    </AuthProvider>
  );
}
