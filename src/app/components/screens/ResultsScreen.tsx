import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { RentabilityChart } from '../RentabilityChart';
import { Trophy, TrendingUp, Eye, Award, Loader2, AlertCircle } from 'lucide-react';
import { Result } from '../../types';
import { portfolioService } from '../../services/portfolioService';

interface ResultsScreenProps {
  onViewRanking: () => void;
  onBack: () => void;
}

export function ResultsScreen({ onViewRanking, onBack }: ResultsScreenProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const res = await portfolioService.getLastResult();
        setResult(res.data);
      } catch (err) {
        setError('Não foi possível carregar os resultados. Tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600">Calculando seus resultados...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-700 text-center mb-4">{error || 'Nenhum resultado encontrado.'}</p>
        <Button onClick={onBack} variant="outline">Voltar para o Início</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        ← Voltar
      </Button>

      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Resultados da Rodada</h1>
        <p className="text-slate-600">Veja como sua carteira performou</p>
      </div>

      {/* Performance Highlight */}
      <Card className="p-6 bg-gradient-to-br from-green-600 to-blue-600 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-10 h-10" />
          <div>
            <div className="text-green-100 mb-1">Sua Posição</div>
            <div className="text-3xl">{result.rank}º lugar</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <div className="text-green-100 text-sm mb-1">Rentabilidade Total</div>
            <div className="text-2xl">{result.rentability}%</div>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <div className="text-green-100 text-sm mb-1">Retorno Anual</div>
            <div className="text-2xl">{result.annualReturn}% a.a.</div>
          </div>
        </div>

        <div className="mt-4 bg-white/20 p-3 rounded-lg">
          <div className="text-green-100 text-sm mb-1">Valor Final da Carteira</div>
          <div className="text-2xl">
            R$ {result.portfolioValue.toLocaleString('pt-BR')}
          </div>
        </div>
      </Card>

      {/* Chart */}
      <div className="mb-6">
        <RentabilityChart data={result.chartData} />
      </div>

      <Separator className="my-6" />

      {/* The Revelation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-6 h-6 text-orange-500" />
          <h2 className="text-slate-900">A Revelação</h2>
        </div>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 mb-4">
          <h3 className="text-slate-900 mb-3">Sua Carteira Revelada</h3>
          <div className="space-y-3">
            {result.revealedAssets.map((asset) => (
              <div key={asset.id} className="bg-white/60 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-slate-600 text-sm mb-1">
                      Você investiu em "{asset.anonymousName}"
                    </div>
                    <div className="text-orange-700 flex items-center gap-2 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>{asset.realName} {asset.ticker ? `(${asset.ticker})` : ''}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-600 text-[10px] uppercase">Investido</div>
                    <div className="text-slate-800 text-sm font-medium">R$ {asset.amountInvested.toLocaleString('pt-BR')}</div>
                    <div className="text-slate-600 text-[10px] uppercase mt-1">Final</div>
                    <div className="text-green-700 text-sm font-bold">R$ {asset.finalValue.toLocaleString('pt-BR')}</div>
                  </div>
                </div>
                {asset.sector && (
                  <div className="text-slate-600 text-sm mt-2">
                    Setor: {asset.sector}
                  </div>
                )}
                {asset.bondType && (
                  <div className="text-slate-600 text-sm mt-2">
                    Tipo: {asset.bondType}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h4 className="text-slate-900">Período Simulado</h4>
          </div>
          <p className="text-slate-600">
            O período histórico simulado foi de <span className="text-blue-700">{result.period}</span> no Brasil.
          </p>
        </Card>
      </div>

      <Button
        size="lg"
        className="w-full bg-orange-500 hover:bg-orange-600"
        onClick={onViewRanking}
      >
        Ver Ranking Completo
      </Button>
    </div>
  );
}
