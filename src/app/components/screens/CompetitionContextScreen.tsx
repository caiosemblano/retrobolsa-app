import { EconomicIndicatorCard } from '../EconomicIndicatorCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { FileText, ArrowRight } from 'lucide-react';
import { currentCompetition } from '../../data/mockData';

interface CompetitionContextScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function CompetitionContextScreen({ onNext, onBack }: CompetitionContextScreenProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        ← Voltar
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <FileText className="w-8 h-8 text-blue-700" />
        </div>
        <div>
          <h1 className="text-slate-900 mb-1">{currentCompetition.economicContext.title}</h1>
          <p className="text-slate-600">Analise os indicadores antes de escolher seus ativos</p>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-600 to-green-600 text-white mb-6">
        <h2 className="mb-2">Contexto Histórico Anônimo</h2>
        <p className="text-blue-100">
          Os indicadores abaixo representam um momento real da economia brasileira. 
          Use seu conhecimento para montar a melhor carteira de investimentos!
        </p>
      </Card>

      <div className="mb-6">
        <h2 className="text-slate-900 mb-4">Indicadores Econômicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCompetition.economicContext.indicators.map((indicator, index) => (
            <EconomicIndicatorCard key={index} indicator={indicator} />
          ))}
        </div>
      </div>

      <Card className="p-4 bg-orange-50 border-orange-200 mb-6">
        <h3 className="text-slate-900 mb-2">💡 Dica</h3>
        <p className="text-slate-600 text-sm">
          Lembre-se das aulas! Juros altos podem favorecer títulos, mas também podem impactar empresas. 
          Inflação elevada afeta diferentes setores de formas distintas.
        </p>
      </Card>

      <Button
        size="lg"
        className="w-full bg-orange-500 hover:bg-orange-600"
        onClick={onNext}
      >
        Escolher Ativos
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}
