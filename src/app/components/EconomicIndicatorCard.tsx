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
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-700" />
        </div>
        <div className="flex-1">
          <div className="text-slate-600 text-sm mb-1">{indicator.name}</div>
          <div className="text-blue-900">{indicator.value}</div>
        </div>
      </div>
    </Card>
  );
}
