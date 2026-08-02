import { useEffect } from 'react';
import { Card } from '../ui/card';
import { Loader2, Clock, TrendingUp } from 'lucide-react';

interface SimulationWaitScreenProps {
  onSimulationComplete: () => void;
}

export function SimulationWaitScreen({ onSimulationComplete }: SimulationWaitScreenProps) {
  useEffect(() => {
    // Artificial delay for the simulation effect (3 seconds)
    const timer = setTimeout(() => {
      onSimulationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSimulationComplete]);

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Card className="p-8 text-center max-w-md bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
          <div className="mb-6">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
              <TrendingUp className="w-8 h-8 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <h2 className="text-slate-900 mb-3">Carteira Confirmada! 🎉</h2>
          
          <p className="text-slate-600 mb-4">
            A simulação histórica está em andamento. 
            Estamos calculando o desempenho de sua carteira no período selecionado.
          </p>

          <Card className="p-4 bg-white/60 mb-4">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Processando...</span>
            </div>
          </Card>

          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="text-slate-700 text-sm">
              💡 Dica: Ativos diversificados ajudam a proteger contra crises sistêmicas.
            </p>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md">
          <Card className="p-3 text-center">
            <div className="text-blue-600 mb-1">📊</div>
            <div className="text-slate-600 text-sm">Simulando mercado</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-green-600 mb-1">💰</div>
            <div className="text-slate-600 text-sm">Calculando retorno</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-orange-600 mb-1">🏆</div>
            <div className="text-slate-600 text-sm">Gerando ranking</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
