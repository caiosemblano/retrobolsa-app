import { useState } from 'react';
import { AssetCard } from '../AssetCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Wallet, Loader2 } from 'lucide-react';
import { Asset, Portfolio, Competition } from '../../types';
import { portfolioService, SubmitPortfolioPayload } from '../../services/portfolioService';
import { toast } from 'sonner';

interface PortfolioBuilderScreenProps {
  competition: Competition;
  onConfirm: () => void;
  onBack: () => void;
}

export function PortfolioBuilderScreen({ competition, onConfirm, onBack }: PortfolioBuilderScreenProps) {
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [allocationAmount, setAllocationAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_BUDGET = competition.budget;
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

  const canConfirm = allocatedTotal > 0 && !isSubmitting;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const payload: SubmitPortfolioPayload = {
        competitionId: competition.id,
        allocations: Object.entries(portfolio).map(([assetId, amount]) => ({
          assetId,
          amount,
        })),
      };

      const response = await portfolioService.submit(payload);

      if (response.warnings && response.warnings.length > 0) {
        response.warnings.forEach(warning => {
          toast.warning(warning, { duration: 5000 });
        });
      } else {
        toast.success(response.message || 'Carteira confirmada com sucesso!');
      }

      onConfirm();
    } catch (error) {
      console.error('Erro ao submeter carteira:', error);
      // O toast de erro será tratado pelo interceptor global do Axios (api.ts)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-32">
      <Button variant="ghost" className="mb-4" onClick={onBack} disabled={isSubmitting}>
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
                style={{ width: `${Math.min(100, allocationPercentage)}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-32 mb-6">
        <h2 className="text-slate-900 mb-4">Ativos Disponíveis</h2>
        <div className="space-y-3">
          {competition.assets.map((asset) => (
            <div key={asset.id} className="relative">
              <AssetCard
                asset={asset}
                allocatedAmount={portfolio[asset.id]}
                onClick={() => {
                  if (isSubmitting) return;
                  setSelectedAsset(asset);
                  setAllocationAmount(portfolio[asset.id] || 0);
                }}
              />
              {portfolio[asset.id] && !isSubmitting && (
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
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={!canConfirm}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? 'Submetendo...' : 'Confirmar Carteira'}
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
