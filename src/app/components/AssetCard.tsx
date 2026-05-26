import { Asset } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Building2, DollarSign } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
  allocatedAmount?: number;
}

export function AssetCard({ asset, onClick, allocatedAmount }: AssetCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-slate-50 border-2 transition-all"
      onClick={onClick}
      style={{
        borderColor: allocatedAmount ? '#f97316' : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {asset.type === 'stock' ? (
              <TrendingUp className="w-5 h-5 text-blue-600" />
            ) : (
              <Building2 className="w-5 h-5 text-green-600" />
            )}
            <h3 className="text-slate-900">{asset.anonymousName}</h3>
          </div>
          
          {asset.sector && (
            <Badge variant="secondary" className="mb-2">
              Setor: {asset.sector}
            </Badge>
          )}
          
          {asset.bondType && (
            <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
              {asset.bondType}
            </Badge>
          )}
        </div>
        
        {allocatedAmount !== undefined && allocatedAmount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded">
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span className="text-orange-600">
              {allocatedAmount.toLocaleString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {asset.type === 'stock' && asset.indicators && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-slate-600 text-xs">P/L</div>
            <div className="text-blue-700">{asset.indicators.pl?.toFixed(1)}</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-slate-600 text-xs">ROE</div>
            <div className="text-blue-700">{asset.indicators.roe}%</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-slate-600 text-xs">Div. Yield</div>
            <div className="text-blue-700">{asset.indicators.dividendYield}%</div>
          </div>
        </div>
      )}

      {asset.type === 'bond' && (
        <div className="bg-green-50 p-3 rounded">
          <div className="text-slate-600 text-xs mb-1">Taxa de Retorno</div>
          <div className="text-green-700">{asset.rate}% a.a.</div>
        </div>
      )}

      {allocatedAmount !== undefined && allocatedAmount > 0 && (
        <div className="mt-3 pt-3 border-t border-orange-200">
          <div className="text-orange-600 text-sm text-center">
            Alocado
          </div>
        </div>
      )}
    </Card>
  );
}
