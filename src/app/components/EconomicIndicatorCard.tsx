import { EconomicIndicator } from '../types';
import { Card } from './ui/card';
import { Termo } from './Termo';
import { termoDoIndicador } from '../content/glossario';
import { formatarNumero, formatarReais } from '../utils/numero';
import { Percent, TrendingUp, BarChart3, DollarSign, Landmark, type LucideIcon } from 'lucide-react';

interface EconomicIndicatorCardProps {
  indicator: EconomicIndicator;
}

const iconMap: Record<string, LucideIcon> = {
  SELIC: Landmark,
  IPCA: Percent,
  DOLAR: DollarSign,
  PIB: TrendingUp,
};

/** "13,75% a.a.", "9,3% no ano" ou "R$ 2,89", conforme a unidade enviada pela API. */
export function formatarIndicador({ value, unit }: EconomicIndicator): string {
  if (unit === 'R$') return formatarReais(value);
  return `${formatarNumero(value, 2)}% ${unit.replace(/^%\s*/, '')}`.trim();
}

export function EconomicIndicatorCard({ indicator }: EconomicIndicatorCardProps) {
  const Icon = iconMap[indicator.code] || BarChart3;
  const termo = termoDoIndicador(indicator.code);

  return (
    <Card className="p-4 transition-colors duration-200 hover:border-ring/30">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-info/25 bg-info-soft text-info"
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {termo ? <Termo id={termo}>{indicator.label}</Termo> : indicator.label}
          </div>
          <div className="tabular font-display text-lg font-semibold text-foreground">
            {formatarIndicador(indicator)}
          </div>
        </div>
      </div>
    </Card>
  );
}
