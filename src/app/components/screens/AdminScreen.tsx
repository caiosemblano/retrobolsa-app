import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { adminCompetitionService, AdminCompetition } from '../../services/adminCompetitionService';
import { CirclePlay, Eye, FastForward, RotateCcw, Shield, Square, WandSparkles, Zap } from 'lucide-react';

const statusVariant: Record<string, 'gain' | 'gold' | 'info' | 'secondary'> = {
  open: 'gain',
  simulating: 'gold',
  revealed: 'gold',
  simulated: 'info',
  draft: 'secondary',
  closed: 'secondary',
};

export function AdminScreen() {
  const [competitions, setCompetitions] = useState<AdminCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await adminCompetitionService.list();
      setCompetitions(response.data);
    } catch {
      toast.error('Não foi possível carregar as rodadas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const run = async (key: string, action: () => Promise<unknown>, message: string) => {
    setBusy(key);
    try {
      await action();
      toast.success(message);
      await load();
    } catch {
      toast.error('Não foi possível executar essa ação.');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-info/25 bg-info-soft text-info"
        >
          <Shield className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight">Painel administrativo</h1>
          <p className="text-muted-foreground text-sm">Controle as rodadas pelo celular ou computador.</p>
        </div>
      </div>

      <Card className="gap-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            disabled={!!busy}
            onClick={() => run('next', adminCompetitionService.nextRound, 'Próxima rodada iniciada')}
          >
            <FastForward aria-hidden="true" /> Avançar rodada
          </Button>
          {/* Ação destrutiva separada visualmente das demais */}
          <Button
            variant="destructive"
            className="sm:ml-auto"
            disabled={!!busy}
            onClick={() => run('reset', adminCompetitionService.reset, 'Jogo resetado para a rodada 1')}
          >
            <RotateCcw aria-hidden="true" /> Resetar jogo
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        {competitions.map((competition) => (
          <Card key={competition.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="font-display text-lg">Rodada {competition.roundNumber}</h2>
                  <Badge variant={statusVariant[competition.status] || 'secondary'}>
                    {competition.status}
                  </Badge>
                </div>
                <p className="tabular text-sm text-muted-foreground">
                  {competition.scenarioTitle || 'Sem cenário'} · {competition.startYear}-{competition.endYear}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                {(competition.status === 'draft' || competition.status === 'closed') && (
                  <Button
                    size="sm"
                    disabled={!!busy}
                    onClick={() => run(competition.id, () => adminCompetitionService.start(competition.id), 'Rodada iniciada')}
                  >
                    <CirclePlay aria-hidden="true" /> Iniciar
                  </Button>
                )}
                {competition.status === 'open' && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!busy}
                    onClick={() => run(competition.id, () => adminCompetitionService.close(competition.id), 'Rodada encerrada')}
                  >
                    <Square aria-hidden="true" /> Fechar
                  </Button>
                )}
                {competition.status === 'closed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!busy}
                    onClick={() => run(`${competition.id}-simulate`, () => adminCompetitionService.simulate(competition.id), 'Rodada simulada')}
                  >
                    <WandSparkles aria-hidden="true" /> Simular
                  </Button>
                )}
                {competition.status === 'closed' && (
                  <Button
                    size="sm"
                    variant="gold"
                    disabled={!!busy}
                    onClick={() => run(`${competition.id}-quick`, () => adminCompetitionService.quickSimulate(competition.id), 'Rodada simulada e revelada')}
                  >
                    <Zap aria-hidden="true" /> Simulação rápida
                  </Button>
                )}
                {competition.status === 'simulated' && (
                  <Button
                    size="sm"
                    variant="gold"
                    disabled={!!busy}
                    onClick={() => run(`${competition.id}-reveal`, () => adminCompetitionService.reveal(competition.id), 'Resultado revelado')}
                  >
                    <Eye aria-hidden="true" /> Revelar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!competitions.length && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma rodada cadastrada.</p>
        </Card>
      )}
    </div>
  );
}
