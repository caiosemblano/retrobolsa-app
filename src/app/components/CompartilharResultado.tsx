import { useState } from 'react';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { anosSimulados } from './ResultadoDetalhado';
import { useProgress } from '../contexts/ProgressContext';
import { compartilharResultado } from '../utils/compartilhar';
import { Result } from '../types';

/** Gera a imagem do resultado (rentabilidade, CDI e nível) e compartilha, ou baixa. */
export function CompartilharResultado({ result }: { result: Result }) {
  const { progress } = useProgress();
  const [gerando, setGerando] = useState(false);

  const compartilhar = async () => {
    setGerando(true);
    try {
      const como = await compartilharResultado({
        rentabilidade: result.rentability,
        cdi: result.benchmarks.find((b) => b.code === 'CDI')?.totalReturn,
        periodo: anosSimulados(result.period),
        nivel: progress?.level,
        tituloDoNivel: progress?.levelTitle,
      });
      if (como === 'baixado') toast.success('Imagem salva. É só enviar para quem quiser.');
    } catch (error) {
      // Fechar o menu de compartilhar sem escolher nada não é erro.
      if ((error as Error)?.name !== 'AbortError') toast.error('Não foi possível gerar a imagem.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Button size="lg" variant="outline" className="w-full" onClick={compartilhar} disabled={gerando}>
      <Share2 className="size-5" aria-hidden="true" />
      {gerando ? 'Gerando imagem...' : 'Compartilhar resultado'}
    </Button>
  );
}
