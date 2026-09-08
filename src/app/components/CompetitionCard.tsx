import { Competition } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, Clock, CheckCircle, Eye, FileEdit, Wallet, CalendarRange } from 'lucide-react';

interface CompetitionCardProps {
  competition: Competition;
  onAction: () => void;
}

type StatusStyle = {
  badge: { variant: 'gain' | 'gold' | 'info' | 'secondary'; label: string };
  icon: typeof Trophy;
  iconClass: string;
  glow: string;
  button: 'default' | 'gold' | 'info' | 'secondary';
  buttonText: string;
};

const statusStyles: Record<Competition['status'], StatusStyle> = {
  draft: {
    badge: { variant: 'secondary', label: 'Em preparação' },
    icon: FileEdit,
    iconClass: 'text-muted-foreground',
    glow: 'border-border',
    button: 'secondary',
    buttonText: 'Aguardando início',
  },
  open: {
    badge: { variant: 'gain', label: 'Mercado aberto' },
    icon: Clock,
    iconClass: 'text-gain',
    glow: 'border-gain/40 glow-primary',
    button: 'default',
    buttonText: 'Montar carteira',
  },
  simulating: {
    badge: { variant: 'gold', label: 'Em simulação' },
    icon: Trophy,
    iconClass: 'text-gold',
    glow: 'border-gold/40 glow-gold',
    button: 'gold',
    buttonText: 'Ver status da rodada',
  },
  closed: {
    badge: { variant: 'secondary', label: 'Mercado fechado' },
    icon: CheckCircle,
    iconClass: 'text-muted-foreground',
    glow: 'border-border',
    button: 'secondary',
    buttonText: 'Ver status da rodada',
  },
  simulated: {
    badge: { variant: 'info', label: 'Simulada' },
    icon: Trophy,
    iconClass: 'text-info',
    glow: 'border-info/40 glow-info',
    button: 'info',
    buttonText: 'Ver resultados',
  },
  revealed: {
    badge: { variant: 'gold', label: 'Revelada' },
    icon: Eye,
    iconClass: 'text-gold',
    glow: 'border-gold/40 glow-gold',
    button: 'gold',
    buttonText: 'Ver resultados',
  },
};

export function CompetitionCard({ competition, onAction }: CompetitionCardProps) {
  const style = statusStyles[competition.status];
  const StatusIcon = style.icon;

  return (
    <Card className={`rise-in gap-5 p-6 ${style.glow}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-muted"
          >
            <StatusIcon className={`size-5 ${style.iconClass}`} />
          </span>
          <div>
            <h2 className="font-display text-2xl leading-tight">Rodada {competition.round}</h2>
            <p className="text-muted-foreground text-sm">Competição quinzenal</p>
          </div>
        </div>
        <Badge variant={style.badge.variant}>{style.badge.label}</Badge>
      </div>

      {competition.status === 'open' && competition.daysLeft !== undefined && (
        <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold-soft px-3.5 py-2.5">
          <Clock className="size-4 shrink-0 text-gold" aria-hidden="true" />
          <span className="text-sm text-foreground">
            Faltam{' '}
            <strong className="tabular font-semibold text-gold">
              {competition.daysLeft} {competition.daysLeft === 1 ? 'dia' : 'dias'}
            </strong>{' '}
            para o fechamento
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {competition.budget && (
          <div className="rounded-xl border border-border bg-muted/70 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wide">
              <Wallet className="size-3.5" aria-hidden="true" />
              Orçamento
            </div>
            <div className="tabular font-display text-lg font-semibold text-foreground">
              R$ {competition.budget.toLocaleString('pt-BR')}
            </div>
          </div>
        )}
        {competition.period && (
          <div className="rounded-xl border border-border bg-muted/70 p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wide">
              <CalendarRange className="size-3.5" aria-hidden="true" />
              Período histórico
            </div>
            <div className="tabular font-display text-lg font-semibold text-foreground">
              {competition.period}
            </div>
          </div>
        )}
      </div>

      <Button
        className="w-full"
        variant={style.button}
        size="lg"
        onClick={onAction}
        disabled={competition.status === 'draft'}
      >
        {style.buttonText}
      </Button>
    </Card>
  );
}
