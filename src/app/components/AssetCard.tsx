import { useId, useState } from 'react';
import { Asset } from '../types';
import { Badge } from './ui/badge';
import { Termo } from './Termo';
import { termoDoTitulo, type TermoId } from '../content/glossario';
import { formatarNumero, formatarPercentual } from '../utils/numero';
import { TrendingUp, Building2, Check, ChevronDown } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
  allocatedAmount?: number;
}

interface Indicador {
  termo: TermoId;
  valor: string;
}

const ou = <T,>(valor: T | undefined, formatar: (v: T) => string) =>
  valor === undefined || valor === null ? '—' : formatar(valor);

/** Os que as aulas ensinam vêm primeiro; o resto fica em "ver todos". */
function indicadoresDaAcao(indicators: NonNullable<Asset['indicators']>): { principais: Indicador[]; extras: Indicador[] } {
  return {
    principais: [
      { termo: 'PL', valor: ou(indicators.pl, (v) => formatarNumero(v, 1)) },
      { termo: 'ROE', valor: ou(indicators.roe, (v) => formatarPercentual(v, 1)) },
      { termo: 'DY', valor: ou(indicators.dividendYield, (v) => formatarPercentual(v, 1)) },
    ],
    extras: [
      { termo: 'PVP', valor: ou(indicators.lvp, (v) => formatarNumero(v, 2)) },
      { termo: 'MARGEM_EBITDA', valor: ou(indicators.margemEbitda, (v) => formatarPercentual(v, 1)) },
      // A API manda o CAGR como fração (0.28 = 28% ao ano).
      { termo: 'CAGR_LUCRO', valor: ou(indicators.cagrLucro, (v) => `${formatarPercentual(v * 100, 1)} a.a.`) },
      { termo: 'CAGR_RECEITA', valor: ou(indicators.cagrReceita, (v) => `${formatarPercentual(v * 100, 1)} a.a.`) },
      { termo: 'LUCRO_POSITIVO', valor: ou(indicators.lucroPositivo, (v) => (v ? 'Sim' : 'Não')) },
    ],
  };
}

function Celula({ termo, valor }: Indicador) {
  return (
    <div className="rounded-lg border border-border bg-muted/70 p-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        <Termo id={termo} />
      </div>
      <div className="tabular font-display font-semibold text-foreground">{valor}</div>
    </div>
  );
}

export function AssetCard({ asset, onClick, allocatedAmount }: AssetCardProps) {
  const isAllocated = allocatedAmount !== undefined && allocatedAmount > 0;
  const [verTodos, setVerTodos] = useState(false);
  const extrasId = useId();
  const indicadores = asset.type === 'stock' && asset.indicators ? indicadoresDaAcao(asset.indicators) : null;
  const termoTitulo = termoDoTitulo(asset.bondType);

  return (
    /* O card inteiro continua clicável por um botão que o cobre (camada de baixo);
       siglas e "ver todos" ficam por cima, porque botão dentro de botão não é HTML válido. */
    <div
      className={`surface-glass relative rounded-2xl border p-4 text-left transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isAllocated ? 'border-primary/60 bg-primary/5 glow-primary' : 'border-border bg-card hover:border-ring/40'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isAllocated}
        aria-label={isAllocated ? `Alterar valor em ${asset.anonymousName}` : `Investir em ${asset.anonymousName}`}
        className="absolute inset-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      <div className="pointer-events-none relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                  asset.type === 'stock' ? 'bg-info-soft text-info' : 'bg-gain-soft text-gain'
                }`}
              >
                {asset.type === 'stock' ? <TrendingUp className="size-4" /> : <Building2 className="size-4" />}
              </span>
              <h3 className="truncate font-display text-base font-semibold">{asset.anonymousName}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {asset.sector && <Badge variant="secondary">{asset.sector}</Badge>}
              {asset.bondType && (
                <Badge variant="gain" className="pointer-events-auto">
                  {termoTitulo ? <Termo id={termoTitulo}>{asset.bondType}</Termo> : asset.bondType}
                </Badge>
              )}
            </div>
          </div>

          {isAllocated && (
            <span className="tabular pop-in flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              <Check className="size-3" aria-hidden="true" />
              R$ {allocatedAmount.toLocaleString('pt-BR')}
            </span>
          )}
        </div>

        {indicadores && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {indicadores.principais.map((indicador) => (
                <Celula key={indicador.termo} {...indicador} />
              ))}
            </div>
            {verTodos && (
              <div id={extrasId} className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {indicadores.extras.map((indicador) => (
                  <Celula key={indicador.termo} {...indicador} />
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setVerTodos((atual) => !atual)}
              aria-expanded={verTodos}
              aria-controls={extrasId}
              className="pointer-events-auto relative z-10 mt-2 inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronDown
                className={`size-4 transition-transform motion-reduce:transition-none ${verTodos ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
              {verTodos ? 'Ver menos' : `Ver todos os indicadores (${indicadores.extras.length} a mais)`}
            </button>
          </>
        )}

        {asset.type === 'bond' && (
          <div className="rounded-lg border border-gain/25 bg-gain-soft p-3">
            <div className="mb-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">Taxa de retorno</div>
            <div className="tabular font-display font-semibold text-gain">
              {asset.rate !== undefined ? `${formatarPercentual(asset.rate * 100, 2)} a.a.` : '—'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
