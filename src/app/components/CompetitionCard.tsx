import { Competition } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

interface CompetitionCardProps {
  competition: Competition;
  onAction: () => void;
}

export function CompetitionCard({ competition, onAction }: CompetitionCardProps) {
  const getStatusBadge = () => {
    switch (competition.status) {
      case 'open':
        return <Badge className="bg-green-600">Mercado Aberto</Badge>;
      case 'simulating':
        return <Badge className="bg-orange-500">Em Simulação</Badge>;
      case 'closed':
        return <Badge variant="secondary">Mercado Fechado</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (competition.status) {
      case 'open':
        return <Clock className="w-5 h-5 text-green-600" />;
      case 'simulating':
        return <Trophy className="w-5 h-5 text-orange-500" />;
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getButtonText = () => {
    switch (competition.status) {
      case 'open':
        return 'Montar Carteira';
      case 'simulating':
        return 'Aguardando Resultado';
      case 'closed':
        return 'Ver Resultados';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h2 className="text-slate-900 mb-1">Rodada {competition.round}</h2>
            <div className="text-slate-600">Competição Quinzenal</div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {competition.status === 'open' && competition.daysLeft !== undefined && (
        <div className="bg-white/80 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-slate-700">
              Faltam {competition.daysLeft} {competition.daysLeft === 1 ? 'dia' : 'dias'} para o fechamento
            </span>
          </div>
        </div>
      )}

      <Button
        className="w-full bg-orange-500 hover:bg-orange-600"
        size="lg"
        onClick={onAction}
        disabled={competition.status === 'simulating'}
      >
        {getButtonText()}
      </Button>
    </Card>
  );
}
