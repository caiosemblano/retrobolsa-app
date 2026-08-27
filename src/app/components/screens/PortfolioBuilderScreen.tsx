import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AssetCard } from '../AssetCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Wallet, AlertCircle } from 'lucide-react';
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

  if (loading) return <div className="p-8 text-center text-slate-600">Carregando ativos...</div>;
  if (!competition) return <div className="p-8 text-center text-slate-600">Não foi possível carregar a rodada.</div>;

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
    <div className="max-w-4xl mx-auto p-4 pb-32">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" className="px-2.5 py-1 text-slate-600 hover:text-slate-900" onClick={onBack}>
              ← Voltar
            </Button>
            <h1 className="text-slate-800 font-semibold text-sm">Monte sua Carteira</h1>
          </div>
          <Card className="p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-blue-100 text-xs mb-0.5">Orçamento restante</div>
                <div className="text-xl font-bold">R$ {remaining.toLocaleString('pt-BR')}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-xs mb-0.5">Alocado</div>
                <div className="text-xl font-bold">R$ {allocatedTotal.toLocaleString('pt-BR')}</div>
              </div>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${allocationPercentage}%` }} />
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-48 mb-6">
        <h2 className="text-slate-900 mb-4">Ativos disponíveis</h2>
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
                  onClick={(event) => {
                    event.stopPropagation();
                    const next = { ...portfolio };
                    delete next[asset.id];
                    setPortfolio(next);
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg"><div className="max-w-4xl mx-auto">{!canConfirm && <div className="flex items-center gap-2 text-orange-600 mb-2 text-sm"><AlertCircle className="w-4 h-4" /><span>Alocação mínima de R$ 1,00 para confirmar</span></div>}<Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={!canConfirm || submitting}>{submitting ? 'Enviando...' : <><Wallet className="w-5 h-5 mr-2" />Confirmar carteira</>}</Button></div></div>
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}><DialogContent><DialogHeader><DialogTitle>Alocar em {selectedAsset?.anonymousName}</DialogTitle></DialogHeader><div className="py-4"><Label className="mb-2 block">Valor a investir (R$)</Label><Input type="number" value={allocationAmount} onChange={(event) => setAllocationAmount(Number(event.target.value))} min={0} className="mb-4" /><Label className="mb-2 block">Ajustar valor</Label><Slider value={[allocationAmount]} onValueChange={([value]) => setAllocationAmount(value)} max={remaining + (portfolio[selectedAsset?.id || ''] || 0)} step={100} className="mb-2" /><div className="text-slate-600 text-sm">Disponível: R$ {(remaining + (portfolio[selectedAsset?.id || ''] || 0)).toLocaleString('pt-BR')}</div></div><DialogFooter><Button variant="ghost" onClick={() => setSelectedAsset(null)}>Cancelar</Button><Button onClick={handleAllocate} className="bg-orange-500 hover:bg-orange-600">Alocar</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
