import { useState } from 'react';
import { AssetCard } from '../AssetCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Wallet, AlertCircle } from 'lucide-react';
import { currentCompetition } from '../../data/mockData';
import { Asset, Portfolio } from '../../types';

interface PortfolioBuilderScreenProps {
  onConfirm: () => void;
  onBack: () => void;
}

const TOTAL_BUDGET = 100000;

export function PortfolioBuilderScreen({ onConfirm, onBack }: PortfolioBuilderScreenProps) {
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [allocationAmount, setAllocationAmount] = useState(0);

  const allocatedTotal = Object.values(portfolio).reduce((sum, amount) => sum + amount, 0);
  const remaining = TOTAL_BUDGET - allocatedTotal;
  const allocationPercentage = (allocatedTotal / TOTAL_BUDGET) * 100;

  const handleAllocate = () => {
    if (selectedAsset && allocationAmount > 0) {
      setPortfolio({
        ...portfolio,
        [selectedAsset.id]: allocationAmount,
      });
      setSelectedAsset(null);
      setAllocationAmount(0);
    }
  };

  const handleRemoveAllocation = (assetId: string) => {
    const newPortfolio = { ...portfolio };
    delete newPortfolio[assetId];
    setPortfolio(newPortfolio);
  };

  const canConfirm = allocatedTotal >= TOTAL_BUDGET * 0.5; // Pelo menos 50% alocado

  return (
    <div className="max-w-4xl mx-auto p-4 pb-32">
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        ← Voltar
      </Button>

      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Monte sua Carteira</h1>
        <p className="text-slate-600">Distribua seu orçamento entre os ativos disponíveis</p>
      </div>

      {/* Fixed Budget Display */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-blue-100 text-sm mb-1">Orçamento Disponível</div>
                <div className="text-2xl">R$ {remaining.toLocaleString('pt-BR')}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-sm mb-1">Alocado</div>
                <div className="text-2xl">R$ {allocatedTotal.toLocaleString('pt-BR')}</div>
              </div>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${allocationPercentage}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-32 mb-6">
        <h2 className="text-slate-900 mb-4">Ativos Disponíveis</h2>
        <div className="space-y-3">
          {currentCompetition.assets.map((asset) => (
            <div key={asset.id} className="relative">
              <AssetCard
                asset={asset}
                allocatedAmount={portfolio[asset.id]}
                onClick={() => {
                  setSelectedAsset(asset);
                  setAllocationAmount(portfolio[asset.id] || 0);
                }}
              />
              {portfolio[asset.id] && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAllocation(asset.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {!canConfirm && (
            <div className="flex items-center gap-2 text-orange-600 mb-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Aloque pelo menos 50% do orçamento para confirmar</span>
            </div>
          )}
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onConfirm}
            disabled={!canConfirm}
          >
            <Wallet className="w-5 h-5 mr-2" />
            Confirmar Carteira
          </Button>
        </div>
      </div>

      {/* Allocation Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alocar em {selectedAsset?.anonymousName}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Label className="mb-2 block">Valor a Investir (R$)</Label>
            <Input
              type="number"
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(Number(e.target.value))}
              max={remaining + (portfolio[selectedAsset?.id || ''] || 0)}
              min={0}
              className="mb-4"
            />

            <Label className="mb-2 block">Usar percentual do disponível</Label>
            <Slider
              value={[allocationAmount]}
              onValueChange={([value]) => setAllocationAmount(value)}
              max={remaining + (portfolio[selectedAsset?.id || ''] || 0)}
              step={1000}
              className="mb-2"
            />

            <div className="text-slate-600 text-sm">
              Disponível: R$ {(remaining + (portfolio[selectedAsset?.id || ''] || 0)).toLocaleString('pt-BR')}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedAsset(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAllocate} className="bg-orange-500 hover:bg-orange-600">
              Alocar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
