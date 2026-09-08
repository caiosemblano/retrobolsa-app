import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AssetCard } from '../AssetCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Wallet, AlertCircle, ArrowLeft, X } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { Asset, Competition, Portfolio } from '../../types';

interface PortfolioBuilderScreenProps { onConfirm: () => void; onBack: () => void; }

const errorMessage = (error: any) =>
  error?.response?.data?.erro || error?.response?.data?.message || 'Não foi possível enviar a carteira.';

export function PortfolioBuilderScreen({ onConfirm, onBack }: PortfolioBuilderScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [allocationAmount, setAllocationAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    competitionService.getActive().then((response) => setCompetition(response.data)).catch((error) => toast.error(errorMessage(error))).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 p-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-muted-foreground">
        Não foi possível carregar a rodada.
      </div>
    );
  }

  const totalBudget = competition.budget;
  const allocatedTotal = Object.values(portfolio).reduce((sum, amount) => sum + amount, 0);
  const remaining = totalBudget - allocatedTotal;
  const allocationPercentage = Math.min((allocatedTotal / totalBudget) * 100, 100);
  const canConfirm = allocatedTotal > 0;

  const handleAllocate = () => {
    if (!selectedAsset || allocationAmount <= 0) return;
    const otherAllocated = allocatedTotal - (portfolio[selectedAsset.id] || 0);
    if (otherAllocated + allocationAmount > totalBudget) {
      toast.error('O total alocado não pode exceder o orçamento.');
      return;
    }
    setPortfolio({ ...portfolio, [selectedAsset.id]: allocationAmount });
    setSelectedAsset(null);
    setAllocationAmount(0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await portfolioService.submit({
        competitionId: competition.id,
        allocations: Object.entries(portfolio).map(([assetId, amount]) => ({ assetId, amount })),
      });
      response.data.warnings?.forEach((warning) => toast.warning(warning));
      toast.success(response.data.message || 'Carteira submetida com sucesso.');
      onConfirm();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 pb-32">
      {/* HUD de orçamento fixo no topo */}
      <div className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-background/90 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar
            </Button>
            <h1 className="font-display text-sm font-semibold">Monte sua carteira</h1>
          </div>

          <Card className="gap-3 border-primary/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Orçamento restante
                </div>
                <div className="tabular font-display text-xl font-bold text-primary">
                  R$ {remaining.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Alocado</div>
                <div className="tabular font-display text-xl font-bold text-foreground">
                  R$ {allocatedTotal.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full border border-border bg-muted"
              role="progressbar"
              aria-valuenow={Math.round(allocationPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Percentual do orçamento alocado"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary shadow-[0_0_12px_-2px_var(--primary)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{ width: `${allocationPercentage}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mb-6 mt-52">
        <h2 className="mb-4 font-display text-xl">Ativos disponíveis</h2>
        <div className="space-y-3">
          {competition.assets.map((asset) => (
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
                  type="button"
                  aria-label={`Remover alocação em ${asset.anonymousName}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    const next = { ...portfolio };
                    delete next[asset.id];
                    setPortfolio(next);
                  }}
                  className="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full border border-loss/40 bg-loss-soft text-loss transition-[transform,background-color] duration-150 hover:bg-loss hover:text-loss-foreground active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Barra de confirmação fixa */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          {!canConfirm && (
            <div className="mb-2 flex items-center gap-2 text-sm text-gold">
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <span>Alocação mínima de R$ 1,00 para confirmar</span>
            </div>
          )}
          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={!canConfirm || submitting}>
            {submitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
                />
                Enviando...
              </>
            ) : (
              <>
                <Wallet className="size-5" aria-hidden="true" />
                Confirmar carteira
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Alocar em {selectedAsset?.anonymousName}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="allocation-amount" className="mb-2 block">
              Valor a investir (R$)
            </Label>
            <Input
              id="allocation-amount"
              type="number"
              inputMode="numeric"
              value={allocationAmount}
              onChange={(event) => setAllocationAmount(Number(event.target.value))}
              min={0}
              className="tabular mb-4 font-display text-lg"
            />
            <Label className="mb-3 block">Ajustar valor</Label>
            <Slider
              value={[allocationAmount]}
              onValueChange={([value]) => setAllocationAmount(value)}
              max={remaining + (portfolio[selectedAsset?.id || ''] || 0)}
              step={100}
              className="mb-3"
              aria-label="Ajustar valor a investir"
            />
            <div className="tabular text-sm text-muted-foreground">
              Disponível: R$ {(remaining + (portfolio[selectedAsset?.id || ''] || 0)).toLocaleString('pt-BR')}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedAsset(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAllocate}>Alocar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
