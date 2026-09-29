import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { format, parseISO } from 'date-fns';
import { Bell, ClipboardList, Eye, PlayCircle, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Notificacao, NOTIFICACOES_POR_PAGINA, notificationService } from '../services/notificationService';

const icones: Record<string, typeof Bell> = {
  RODADA_ABERTA: PlayCircle,
  RESULTADO_REVELADO: Eye,
  TAREFA_NOVA: ClipboardList,
  MISSAO_CUMPRIDA: Target,
};

/**
 * O sino do cabeçalho: mostra quantas notificações não foram lidas (atualizado a
 * cada troca de tela) e abre a gaveta com a lista. Abrir a gaveta marca como lidas
 * as que apareceram; elas continuam destacadas até a gaveta fechar.
 */
export function SinoDeNotificacoes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [naoLidas, setNaoLidas] = useState(0);
  const [aberto, setAberto] = useState(false);
  const [itens, setItens] = useState<Notificacao[] | null>(null);
  const [pagina, setPagina] = useState(0);
  const [temMais, setTemMais] = useState(false);

  useEffect(() => {
    notificationService.unreadCount().then(setNaoLidas).catch(() => undefined);
  }, [location.pathname]);

  const carregar = async (numero: number) => {
    const { data } = await notificationService.list(numero);
    setItens((atuais) => (numero === 0 ? data : [...(atuais ?? []), ...data]));
    setPagina(numero);
    setTemMais(data.length === NOTIFICACOES_POR_PAGINA);
    const novas = data.filter((n) => !n.read).map((n) => n.id);
    if (novas.length) {
      await notificationService.markRead(novas);
      setNaoLidas((total) => Math.max(0, total - novas.length));
    }
  };

  const mudarAbertura = (abrir: boolean) => {
    setAberto(abrir);
    if (abrir) {
      setItens(null);
      carregar(0).catch(() => setItens([]));
    }
  };

  const abrirLink = (notificacao: Notificacao) => {
    if (!notificacao.link) return;
    setAberto(false);
    navigate(notificacao.link);
  };

  return (
    <Sheet open={aberto} onOpenChange={mudarAbertura}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={naoLidas ? `Notificações: ${naoLidas} não ${naoLidas === 1 ? 'lida' : 'lidas'}` : 'Notificações'}
          className="relative grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="size-5" aria-hidden="true" />
          {naoLidas > 0 && (
            <span
              aria-hidden="true"
              className="tabular absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-loss px-1 text-[10px] font-bold leading-4 text-loss-foreground"
            >
              {naoLidas > 9 ? '9+' : naoLidas}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] gap-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-display">Notificações</SheetTitle>
          <SheetDescription>Rodadas, resultados, tarefas e missões.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-2">
          {!itens ? (
            <p className="p-4 text-sm text-muted-foreground">Carregando...</p>
          ) : itens.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Nada por aqui ainda.</p>
          ) : (
            <ul className="space-y-1">
              {itens.map((notificacao) => {
                const Icone = icones[notificacao.type] ?? Bell;
                const conteudo = (
                  <>
                    <Icone className="mt-0.5 size-5 shrink-0 text-info" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className={`block ${notificacao.read ? '' : 'font-semibold'}`}>
                        {!notificacao.read && <span className="sr-only">Nova: </span>}
                        {notificacao.title}
                      </span>
                      {notificacao.body && <span className="block text-sm text-muted-foreground">{notificacao.body}</span>}
                      <span className="tabular block text-xs text-muted-foreground">
                        {format(parseISO(notificacao.createdAt), "dd/MM 'às' HH:mm")}
                      </span>
                    </span>
                    {!notificacao.read && <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-loss" />}
                  </>
                );
                return (
                  <li key={notificacao.id}>
                    {notificacao.link ? (
                      <button
                        type="button"
                        onClick={() => abrirLink(notificacao)}
                        className="flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {conteudo}
                      </button>
                    ) : (
                      <div className="flex items-start gap-3 p-3">{conteudo}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {temMais && (
            <Button variant="outline" className="mt-2 w-full" onClick={() => carregar(pagina + 1).catch(() => setTemMais(false))}>
              Carregar mais
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
