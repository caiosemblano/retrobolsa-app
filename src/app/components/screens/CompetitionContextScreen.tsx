import { useEffect, useState } from 'react';
import { EconomicIndicatorCard } from '../EconomicIndicatorCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { FileText, ArrowRight } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types';

interface CompetitionContextScreenProps { onNext: () => void; onBack: () => void; }

export function CompetitionContextScreen({ onNext, onBack }: CompetitionContextScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { competitionService.getActive().then((response) => setCompetition(response.data)).catch(() => undefined).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="p-8 text-center text-slate-600">Carregando contexto...</div>;
  if (!competition) return <div className="p-8 text-center text-slate-600">Não foi possível carregar o contexto da rodada.</div>;
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <Button variant="ghost" className="mb-4" onClick={onBack}>← Voltar</Button>
      <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-blue-100 rounded-lg"><FileText className="w-8 h-8 text-blue-700" /></div><div><h1 className="text-slate-900 mb-1">{competition.economicContext.title}</h1><p className="text-slate-600">Analise o contexto antes de escolher seus ativos</p></div></div>
      <Card className="p-6 bg-gradient-to-br from-blue-600 to-green-600 text-white mb-6"><h2 className="mb-2">Contexto histórico anônimo</h2><p className="text-blue-100">{competition.scenarioDescription || 'Use os dados da rodada para montar sua carteira.'}</p></Card>
      <div className="mb-6"><h2 className="text-slate-900 mb-4">Indicadores econômicos</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{competition.economicContext.indicators.map((indicator, index) => <EconomicIndicatorCard key={index} indicator={indicator} />)}</div></div>
      <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600" onClick={onNext}>Escolher Ativos<ArrowRight className="w-5 h-5 ml-2" /></Button>
    </div>
  );
}
