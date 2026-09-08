import { EconomicIndicator } from '../types';
import { Card } from './ui/card';
import { Percent, TrendingUp, BarChart3, DollarSign, Globe } from 'lucide-react';

interface EconomicIndicatorCardProps {
  indicator: EconomicIndicator;
}

const iconMap: Record<string, any> = {
  Percent,
  TrendingUp,
  BarChart3,
  DollarSign,
  Globe,
};

export function EconomicIndicatorCard({ indicator }: EconomicIndicatorCardProps) {
  const Icon = iconMap[indicator.icon] || BarChart3;

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
          <div className="truncate text-xs uppercase tracking-wide text-muted-foreground">
            {indicator.name}
          </div>
          <div className="tabular font-display text-lg font-semibold text-foreground">
            {indicator.value}
          </div>
        </div>
      </div>
    </Card>
  );
}
