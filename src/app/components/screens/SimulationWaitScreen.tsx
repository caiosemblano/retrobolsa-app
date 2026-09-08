import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, TrendingUp, ArrowLeft, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="mx-auto max-w-4xl p-4 pb-24">
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Button>

      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Card
          className={`max-w-md items-center gap-4 p-8 text-center ${
            ready ? 'border-gain/40 glow-primary' : 'border-gold/30 glow-gold'
          }`}
        >
          <div className="relative mx-auto grid size-20 place-items-center" aria-hidden="true">
            {ready ? (
              <CheckCircle2 className="pop-in size-16 text-gain" />
            ) : (
              <>
                <Loader2 className="size-20 animate-spin text-gold/70 motion-reduce:animate-none" />
                <TrendingUp className="absolute size-8 text-gain" />
              </>
            )}
          </div>

          <h2 className="font-display text-xl">Carteira confirmada!</h2>

          <p aria-live="polite" className="text-muted-foreground">
            {ready
              ? 'Seu resultado já está disponível.'
              : 'A rodada ainda está aguardando a simulação do administrador. Esta tela consulta automaticamente.'}
          </p>

          {ready && (
            <Button onClick={onViewResults} className="w-full">
              Ver resultado
            </Button>
          )}

          {checking && !ready && (
            <p className="text-sm text-muted-foreground">Consultando API...</p>
          )}

          <p className="text-xs text-muted-foreground/70">
            Você pode sair desta tela a qualquer momento — a rodada continua acessível pela tela inicial.
          </p>
        </Card>
      </div>
    </div>
  );
}
