import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { RentabilityChart } from '../RentabilityChart';
import { Trophy, TrendingUp, Eye, Award } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { Result } from '../../types';

interface ResultsScreenProps { onViewRanking: () => void; onBack: () => void; }

export function ResultsScreen({ onViewRanking, onBack }: ResultsScreenProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { portfolioService.getLastResult().then((response) => setResult(response.data)).catch(() => undefined).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="p-8 text-center text-slate-600">Carregando resultado...</div>;
  if (!result) return <div className="p-8 text-center text-slate-600">O resultado ainda não está disponível.</div>;
  return <div className="max-w-4xl mx-auto p-4 pb-20"><Button variant="ghost" className="mb-4" onClick={onBack}>← Voltar</Button><div className="mb-6"><h1 className="text-slate-900 mb-2">Resultados da rodada</h1><p className="text-slate-600">Veja como sua carteira performou</p></div><Card className="p-6 bg-gradient-to-br from-green-600 to-blue-600 text-white mb-6"><div className="flex items-center gap-3 mb-4"><Trophy className="w-10 h-10" /><div><div className="text-green-100 mb-1">Sua posição</div><div className="text-3xl">{result.rank}º lugar</div></div></div><div className="grid grid-cols-2 gap-4"><div className="bg-white/20 p-3 rounded-lg"><div className="text-green-100 text-sm mb-1">Rentabilidade total</div><div className="text-2xl">{result.rentability}%</div></div><div className="bg-white/20 p-3 rounded-lg"><div className="text-green-100 text-sm mb-1">Retorno anual</div><div className="text-2xl">{result.annualReturn}% a.a.</div></div></div><div className="mt-4 bg-white/20 p-3 rounded-lg"><div className="text-green-100 text-sm mb-1">Valor final</div><div className="text-2xl">R$ {result.portfolioValue.toLocaleString('pt-BR')}</div></div></Card><div className="mb-6"><RentabilityChart data={result.chartData} /></div><Separator className="my-6" /><div className="mb-6"><div className="flex items-center gap-2 mb-4"><Eye className="w-6 h-6 text-orange-500" /><h2 className="text-slate-900">A revelação</h2></div><Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 mb-4"><h3 className="text-slate-900 mb-3">Sua carteira revelada</h3>{result.revealedAssets.length ? <div className="space-y-3">{result.revealedAssets.map((asset) => <div key={asset.id} className="bg-white/60 p-4 rounded-lg"><div className="text-slate-600 text-sm mb-1">Você investiu em “{asset.anonymousName}”</div><div className="text-orange-700 flex items-center gap-2"><TrendingUp className="w-4 h-4" /><span>{asset.realName ? `que era ${asset.realName}` : 'nome ainda não revelado'}</span></div>{asset.sector && <div className="text-slate-600 text-sm mt-2">Setor: {asset.sector}</div>}</div>)}</div> : <p className="text-slate-600">Os ativos serão revelados ao final da rodada.</p>}</Card><Card className="p-4 bg-blue-50 border-blue-200 mb-6"><div className="flex items-center gap-2 mb-2"><Award className="w-5 h-5 text-blue-600" /><h4 className="text-slate-900">Período simulado</h4></div><p className="text-slate-600">Período histórico: <span className="text-blue-700">{result.period}</span>.</p></Card></div><Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600" onClick={onViewRanking}>Ver ranking completo</Button></div>;
}
