import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { RentabilityChart } from '../RentabilityChart';
import { Trophy, TrendingUp, Eye, Award } from 'lucide-react';
import { lastResult } from '../../data/mockData';

interface ResultsScreenProps {
  onViewRanking: () => void;
  onBack: () => void;
}

export function ResultsScreen({ onViewRanking, onBack }: ResultsScreenProps) {
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
            <div className="text-3xl">{lastResult.rank}º lugar</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <div className="text-green-100 text-sm mb-1">Rentabilidade Total</div>
            <div className="text-2xl">{lastResult.rentability}%</div>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <div className="text-green-100 text-sm mb-1">Retorno Anual</div>
            <div className="text-2xl">{lastResult.annualReturn}% a.a.</div>
          </div>
        </div>

        <div className="mt-4 bg-white/20 p-3 rounded-lg">
          <div className="text-green-100 text-sm mb-1">Valor Final da Carteira</div>
          <div className="text-2xl">
            R$ {lastResult.portfolioValue.toLocaleString('pt-BR')}
          </div>
          <div className="text-green-100 text-sm mt-1">
            De R$ 100.000 iniciais
          </div>
        </div>
      </Card>

      {/* Chart */}
      <div className="mb-6">
        <RentabilityChart data={lastResult.chartData} />
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
            {lastResult.revealedAssets.map((asset) => (
              <div key={asset.id} className="bg-white/60 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-slate-600 text-sm mb-1">
                      Você investiu em "{asset.anonymousName}"
                    </div>
                    <div className="text-orange-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>que era {asset.realName}</span>
                    </div>
                  </div>
                </div>
                {asset.sector && (
                  <div className="text-slate-600 text-sm">
                    Setor: {asset.sector}
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
            O período histórico simulado foi de <span className="text-blue-700">{lastResult.period}</span> no Brasil.
          </p>
        </Card>
      </div>

      <Card className="p-4 bg-green-50 border-green-200 mb-6">
        <h4 className="text-slate-900 mb-2">💡 O que você aprendeu?</h4>
        <p className="text-slate-600 text-sm">
          Este foi um período marcante da economia brasileira. As empresas de commodities performaram excepcionalmente bem 
          devido ao boom das exportações. Títulos prefixados também ofereceram bons retornos devido às altas taxas de juros da época.
        </p>
      </Card>

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
