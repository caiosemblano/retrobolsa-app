import { useState } from 'react';
import { ArrowLeft, Dumbbell, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { ResultadoView } from '../ResultadoView';
import { PortfolioBuilderScreen } from './PortfolioBuilderScreen';
import { useProgress } from '../../contexts/ProgressContext';
import { Portfolio, Result } from '../../types';

interface TreinoScreenProps {
  rodadaId: string;
  /** Volta para a lista de rodadas de treino. */
  onVoltar: () => void;
}

/** Um treino: a montagem da carteira na rodada escolhida e, depois de simular, o resultado ali mesmo. */
export function TreinoScreen({ rodadaId, onVoltar }: TreinoScreenProps) {
  const [carteira, setCarteira] = useState<Portfolio | undefined>(undefined);
  const [resultado, setResultado] = useState<Result | null>(null);
  const { refresh } = useProgress();

  if (!resultado) {
    return (
      <PortfolioBuilderScreen
        modo="treino"
        competitionId={rodadaId}
        carteiraInicial={carteira}
        onBack={onVoltar}
        onResultado={(novo, montada) => {
          setCarteira(montada);
          setResultado(novo);
          // O primeiro treino na rodada dá XP: o cabeçalho e a comemoração se atualizam.
          refresh();
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <Button variant="ghost" onClick={onVoltar}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Outras rodadas
      </Button>

      <div>
        <h1 className="font-display text-3xl">Resultado do treino</h1>
        <p className="text-muted-foreground">O que a sua carteira teria feito nessa rodada</p>
      </div>

      <ResultadoView result={resultado} treino />

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={() => setResultado(null)}>
          <RotateCcw className="size-5" aria-hidden="true" />
          Treinar de novo
        </Button>
        <Button size="lg" variant="outline" onClick={onVoltar}>
          <Dumbbell className="size-5" aria-hidden="true" />
          Escolher outra rodada
        </Button>
      </div>
    </div>
  );
}
