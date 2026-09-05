import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, TrendingUp } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';

interface Props { onViewResults: () => void; onBack: () => void; }

export function SimulationWaitScreen({ onViewResults, onBack }: Props) {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await portfolioService.getLastResult();
        if (!cancelled) setReady(true);
      } catch (error: any) {
        if (error?.response?.status !== 400 && !cancelled) toast.error('Não foi possível consultar o resultado.');
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    check();
    const interval = window.setInterval(check, 5000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, []);

  return <div className="max-w-4xl mx-auto p-4 pb-20"><Button variant="ghost" className="mb-4" onClick={onBack}>← Voltar</Button><div className="min-h-[60vh] flex flex-col items-center justify-center"><Card className="p-8 text-center max-w-md bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200"><div className="relative mx-auto w-20 h-20 mb-4"><Loader2 className="w-20 h-20 text-blue-600 animate-spin" /><TrendingUp className="w-8 h-8 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div><h2 className="text-slate-900 mb-3">Carteira confirmada!</h2><p className="text-slate-600 mb-6">{ready ? 'Seu resultado já está disponível.' : 'A rodada ainda está aguardando a simulação do administrador. Esta tela consulta automaticamente.'}</p>{ready && <Button onClick={onViewResults} className="w-full bg-green-600 hover:bg-green-700">Ver resultado</Button>}{checking && <p className="text-slate-500 text-sm mt-4">Consultando API...</p>}<p className="text-slate-400 text-xs mt-4">Você pode sair desta tela a qualquer momento — a rodada continua acessível pela tela inicial.</p></Card></div></div>;
}
