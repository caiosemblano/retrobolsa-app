import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { adminCompetitionService, AdminCompetition } from '../../services/adminCompetitionService';
import { CirclePlay, Eye, FastForward, RotateCcw, Shield, Square, WandSparkles, Zap } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center text-slate-600">Carregando painel administrativo...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-7 h-7 text-blue-600" />
        <div><h1 className="text-slate-900">Painel administrativo</h1><p className="text-slate-600">Controle as rodadas pelo celular ou computador.</p></div>
      </div>
      <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button disabled={!!busy} onClick={() => run('next', adminCompetitionService.nextRound, 'Próxima rodada iniciada')}><FastForward /> Avançar rodada</Button>
          <Button variant="destructive" disabled={!!busy} onClick={() => run('reset', adminCompetitionService.reset, 'Jogo resetado para a rodada 1')}><RotateCcw /> Resetar jogo</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {competitions.map((competition) => (
          <Card key={competition.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-slate-900">Rodada {competition.roundNumber}</h2>
                <p className="text-sm text-slate-600">{competition.scenarioTitle || 'Sem cenário'} · {competition.startYear}-{competition.endYear}</p>
                <span className="text-xs uppercase text-slate-500">{competition.status}</span>
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2">
                {(competition.status === 'draft' || competition.status === 'closed') && <Button size="sm" disabled={!!busy} onClick={() => run(competition.id, () => adminCompetitionService.start(competition.id), 'Rodada iniciada')}><CirclePlay /> Iniciar</Button>}
                {competition.status === 'open' && <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run(competition.id, () => adminCompetitionService.close(competition.id), 'Rodada encerrada')}><Square /> Fechar</Button>}
                {competition.status === 'closed' && <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run(`${competition.id}-simulate`, () => adminCompetitionService.simulate(competition.id), 'Rodada simulada')}><WandSparkles /> Simular</Button>}
                {competition.status === 'closed' && <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run(`${competition.id}-quick`, () => adminCompetitionService.quickSimulate(competition.id), 'Rodada simulada e revelada')}><Zap /> Simulação rápida</Button>}
                {competition.status === 'simulated' && <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run(`${competition.id}-reveal`, () => adminCompetitionService.reveal(competition.id), 'Resultado revelado')}><Eye /> Revelar</Button>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!competitions.length && <p className="text-center text-slate-500 mt-8">Nenhuma rodada cadastrada.</p>}
    </div>
  );
}
