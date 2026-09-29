import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AssetCard } from '../AssetCard';
import { ResumoCarteira } from '../ResumoCarteira';
import { formatarIndicador } from '../EconomicIndicatorCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Wallet, AlertCircle, ArrowLeft, X, Dumbbell, PencilLine } from 'lucide-react';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { practiceService } from '../../services/practiceService';
import { anosSimulados } from '../ResultadoDetalhado';
import { Asset, Competition, Portfolio, Result } from '../../types';

interface PortfolioBuilderScreenProps {
  onBack: () => void;
  /** Rodada de verdade: chamado depois de enviar a carteira ou salvar a edição. */
  onConfirm?: () => void;
  /** "treino" monta a carteira numa rodada já revelada: não vale ranking e o resultado sai na hora. */
  modo?: 'rodada' | 'treino';
  /** Treino: a rodada a remontar. */
  competitionId?: string;
  /** Treino: a carteira para começar (ao treinar de novo a mesma rodada). */
  carteiraInicial?: Portfolio;
  /** Treino: o resultado simulado e a carteira que o gerou. */
  onResultado?: (resultado: Result, carteira: Portfolio) => void;
}

const errorMessage = (error: any, padrao = 'Não foi possível enviar a carteira.') =>
  error?.response?.data?.erro || error?.response?.data?.message || padrao;

export function PortfolioBuilderScreen({
  onConfirm,
  onBack,
  modo = 'rodada',
  competitionId,
  carteiraInicial,
  onResultado,
}: PortfolioBuilderScreenProps) {
  const treino = modo === 'treino';
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  /** Já existe carteira enviada nesta rodada: o envio vira edição (PUT). */
  const [editando, setEditando] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [allocationAmount, setAllocationAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelado = false;
    const carregar = async () => {
      try {
        if (treino) {
          const response = await practiceService.round(competitionId ?? '');
          if (cancelado) return;
          setCompetition(response.data);
          if (carteiraInicial) setPortfolio(carteiraInicial);
        } else {
          const [rodada, atual] = await Promise.all([
            competitionService.getActive(),
            // Sem a carteira atual, a tela ainda serve para enviar a primeira.
            portfolioService.getCurrent().catch(() => null),
          ]);
          if (cancelado) return;
          setCompetition(rodada.data);
          if (atual && atual.competitionId === rodada.data.id) {
            setPortfolio(atual.portfolio);
            setEditando(true);
          }
        }
      } catch (error) {
        if (!cancelado) toast.error(errorMessage(error, 'Não foi possível carregar a rodada.'));
      } finally {
        if (!cancelado) setLoading(false);
      }
    };
    carregar();
    return () => {
      cancelado = true;
    };
    // A carteira inicial só vale na primeira carga.
  }, [treino, competitionId]);

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
  const titulo = treino ? 'Monte sua carteira de treino' : editando ? 'Edite sua carteira' : 'Monte sua carteira';

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
      if (treino) {
        const response = await practiceService.practice(competition.id, portfolio);
        onResultado?.(response.data, portfolio);
        return;
      }
      const payload = {
        competitionId: competition.id,
        allocations: Object.entries(portfolio).map(([assetId, amount]) => ({ assetId, amount })),
      };
      const response = editando ? await portfolioService.update(payload) : await portfolioService.submit(payload);
      response.data.warnings?.forEach((warning) => toast.warning(warning));
      toast.success(response.data.message || 'Carteira submetida com sucesso.');
      onConfirm?.();
    } catch (error) {
      toast.error(errorMessage(error, treino ? 'Não foi possível simular o treino.' : undefined));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-32">
      {/* HUD de orçamento: gruda logo abaixo do header do app (--app-header-h),
          em vez de 'fixed top-0', que ficava escondido atrás dele. */}
      <div
        className="sticky z-30 border-b border-border bg-background/90 p-4 backdrop-blur-md"
        style={{ top: 'var(--app-header-h, 0px)' }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar
            </Button>
            <h1 className="font-display text-sm font-semibold">{titulo}</h1>
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

      <div className="mx-auto mb-6 max-w-4xl px-4 pt-6">
        {treino && (
          <Card className="mb-6 gap-3 border-info/30 p-5">
            <div className="flex items-center gap-2 text-info">
              <Dumbbell className="size-5" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Treino · Rodada {competition.round}
                {competition.startYear && competition.endYear
                  ? ` · ${anosSimulados(`${competition.startYear}-${competition.endYear}`)}`
                  : ''}
              </span>
            </div>
            <h2 className="font-display text-lg leading-tight">{competition.economicContext.title}</h2>
            {competition.scenarioDescription && (
              <p className="max-w-prose text-sm text-muted-foreground">{competition.scenarioDescription}</p>
            )}
            {competition.economicContext.indicators.length > 0 && (
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Indicadores do ano anterior">
                {competition.economicContext.indicators.map((indicador) => (
                  <li key={indicador.code}>
                    <span className="text-muted-foreground">{indicador.label}:</span>{' '}
                    <span className="tabular font-semibold">{formatarIndicador(indicador)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">
              Os nomes aparecem no resultado. O treino não vale para o ranking e pode ser repetido quantas vezes você quiser.
            </p>
          </Card>
        )}
        {editando && (
          <Card className="mb-6 flex-row items-start gap-3 border-gold/30 p-4">
            <PencilLine className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-sm">
              Você já enviou uma carteira nesta rodada. Pode mudar o que quiser até o mercado fechar.
            </p>
          </Card>
        )}
        <div className="mb-6 empty:hidden">
          <ResumoCarteira assets={competition.assets} portfolio={portfolio} budget={totalBudget} />
        </div>
        <h2 className="mb-4 font-display text-xl">Ativos disponíveis</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {competition.assets.map((asset) => (
            <div key={asset.id} className="flex flex-col gap-1.5">
              <AssetCard
                asset={asset}
                allocatedAmount={portfolio[asset.id]}
                onClick={() => {
                  setSelectedAsset(asset);
                  setAllocationAmount(portfolio[asset.id] || 0);
                }}
              />
              {/* Fica abaixo do card, e não sobreposto: sobrepor escondia o
                  valor alocado e deixava o alvo de toque menor que 44px. */}
              {portfolio[asset.id] && (
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...portfolio };
                    delete next[asset.id];
                    setPortfolio(next);
                  }}
                  className="flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-loss/40 bg-loss-soft px-3 text-sm font-semibold text-loss transition-[transform,background-color] duration-150 hover:bg-loss hover:text-loss-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                >
                  <X className="size-4" aria-hidden="true" />
                  Remover alocação em {asset.anonymousName}
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
                {treino ? 'Simulando...' : 'Enviando...'}
              </>
            ) : (
              <>
                {treino ? (
                  <Dumbbell className="size-5" aria-hidden="true" />
                ) : (
                  <Wallet className="size-5" aria-hidden="true" />
                )}
                {treino ? 'Ver resultado do treino' : editando ? 'Salvar alterações' : 'Confirmar carteira'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Alocar em {selectedAsset?.anonymousName}</DialogTitle>
            <DialogDescription>Quanto do orçamento colocar neste ativo.</DialogDescription>
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
