import { Asset } from '../types';
import { Badge } from './ui/badge';
import { TrendingUp, Building2, Check } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
  allocatedAmount?: number;
}

export function AssetCard({ asset, onClick, allocatedAmount }: AssetCardProps) {
  const isAllocated = allocatedAmount !== undefined && allocatedAmount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isAllocated}
      className={`surface-glass block w-full cursor-pointer rounded-2xl border p-4 text-left transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isAllocated
          ? 'border-primary/60 bg-primary/5 glow-primary'
          : 'border-border bg-card hover:border-ring/40'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                asset.type === 'stock' ? 'bg-info-soft text-info' : 'bg-gain-soft text-gain'
              }`}
            >
              {asset.type === 'stock' ? (
                <TrendingUp className="size-4" />
              ) : (
                <Building2 className="size-4" />
              )}
            </span>
            <h3 className="truncate font-display text-base font-semibold">{asset.anonymousName}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {asset.sector && <Badge variant="secondary">{asset.sector}</Badge>}
            {asset.bondType && <Badge variant="gain">{asset.bondType}</Badge>}
          </div>
        </div>

        {isAllocated && (
          <span className="tabular pop-in flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            <Check className="size-3" aria-hidden="true" />
            R$ {allocatedAmount.toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      {asset.type === 'stock' && asset.indicators && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'P/L', value: asset.indicators.pl !== undefined ? asset.indicators.pl.toFixed(1) : '—' },
            { label: 'LVP', value: asset.indicators.lvp !== undefined ? String(asset.indicators.lvp) : '—' },
            {
              label: 'Margem EBITDA',
              value:
                asset.indicators.margemEbitda !== undefined ? `${asset.indicators.margemEbitda}%` : '—',
            },
          ].map((indicator) => (
            <div key={indicator.label} className="rounded-lg border border-border bg-muted/70 p-2">
              <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                {indicator.label}
              </div>
              <div className="tabular font-display font-semibold text-foreground">{indicator.value}</div>
            </div>
          ))}
        </div>
      )}

      {asset.type === 'bond' && (
        <div className="rounded-lg border border-gain/25 bg-gain-soft p-3">
          <div className="mb-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            Taxa de retorno
          </div>
          <div className="tabular font-display font-semibold text-gain">
            {asset.rate !== undefined ? `${(asset.rate * 100).toFixed(2)}% a.a.` : '—'}
          </div>
        </div>
      )}
    </button>
  );
}
