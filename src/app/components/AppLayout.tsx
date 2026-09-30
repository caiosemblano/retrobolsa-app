import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router';
import { Home, GraduationCap, Trophy, User, LogOut, Shield, CandlestickChart, Presentation } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { progressoNoNivel } from '../services/progressService';
import { SinoDeNotificacoes } from './SinoDeNotificacoes';
import { PrimeiroAcesso } from './PrimeiroAcesso';
import { rotas } from '../routes';

/** Header, conteúdo e bottom nav das telas autenticadas. */
export function AppLayout() {
  const { logout, user } = useAuth();
  const { progress, refresh } = useProgress();
  const location = useLocation();
  const navigationType = useNavigationType();
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstScreen = useRef(true);

  /* Publica a altura real do header em --app-header-h para que sub-telas
     possam grudar logo abaixo dele sem depender de um valor fixo (o header
     cresce quando o texto do sistema aumenta ou o título quebra em duas linhas). */
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const publicar = () =>
      document.documentElement.style.setProperty('--app-header-h', `${header.offsetHeight}px`);
    publicar();
    const observer = new ResizeObserver(publicar);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  /* Numa SPA a troca de tela não move o foco: o leitor de tela continuaria
     lendo o menu e o teclado voltaria ao topo da página. Move o foco para o
     conteúdo, exceto na primeira renderização. Tela nova começa do topo; ao
     voltar pelo histórico (POP) a posição fica como está. */
  useEffect(() => {
    if (isFirstScreen.current) {
      isFirstScreen.current = false;
      return;
    }
    if (navigationType !== 'POP') window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
    // Ganhos que chegaram sem ação na tela (ex.: a rodada foi simulada) aparecem na próxima troca de tela.
    refresh();
  }, [location.pathname, navigationType, refresh]);

  // O fluxo da rodada (contexto → carteira → espera → resultado) e o treino numa rodada
  // têm seus próprios botões de voltar, e a barra fixa de confirmação ficaria atrás da nav.
  const shouldShowNav = !location.pathname.startsWith('/rodada') && !location.pathname.startsWith('/treinar/');

  const navItems: { to: string; label: string; icon: typeof Home }[] = [
    { to: rotas.inicio, label: 'Competir', icon: Home },
    { to: rotas.aprender, label: 'Aprender', icon: GraduationCap },
    { to: rotas.rankings, label: 'Rankings', icon: Trophy },
    { to: rotas.perfil, label: 'Perfil', icon: User },
    ...(user?.role === 'ADMIN' ? [{ to: rotas.admin, label: 'Admin', icon: Shield }] : []),
    ...(user?.role === 'TEACHER' ? [{ to: rotas.professor, label: 'Professor', icon: Presentation }] : []),
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* Atalho para quem navega por teclado pular o header e ir direto ao conteúdo */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Pular para o conteúdo
      </a>

      {/* Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md"
      >
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
          <div className="flex items-center gap-1">
          <SinoDeNotificacoes />
          {progress && (
            <Link
              to={rotas.perfil}
              aria-label={`Nível ${progress.level}, ${progress.levelTitle}: ${progress.xp} XP. Ver perfil`}
              className="flex min-h-11 items-center gap-2 rounded-xl px-2 text-left hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden="true"
                className="tabular grid size-8 place-items-center rounded-lg border border-gold/40 bg-gold-soft font-display text-sm font-bold text-gold"
              >
                {progress.level}
              </span>
              <span aria-hidden="true" className="hidden w-24 sm:block">
                <span className="block truncate text-xs font-semibold">{progress.levelTitle}</span>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-gold" style={{ width: `${progressoNoNivel(progress)}%` }} />
                </span>
              </span>
            </Link>
          )}
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
        </div>
      </header>

      {/* Main Content */}
      <main
        id="conteudo-principal"
        ref={mainRef}
        tabIndex={-1}
        className="min-h-[calc(100dvh-9rem)] outline-none"
      >
        {/* A tela nova ainda está chegando: o cabeçalho e a nav ficam, só o conteúdo espera. */}
        <Suspense
          fallback={
            <div className="grid min-h-[50dvh] place-items-center" role="status" aria-label="Carregando a tela">
              <span className="size-8 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {user?.onboarded === false && !user.mustChangePassword && <PrimeiroAcesso />}

      {/* Bottom Navigation */}
      {shouldShowNav && (
        <nav
          aria-label="Navegação principal"
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-4xl items-stretch justify-around">
            {navItems.map(({ to, label, icon: Icon }) => (
              // NavLink marca aria-current="page" sozinho; "Competir" (/) só fica ativo na raiz.
              <NavLink
                key={to}
                to={to}
                end={to === rotas.inicio}
                className={({ isActive }) =>
                  `group relative flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-1 pt-3 pb-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
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
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
