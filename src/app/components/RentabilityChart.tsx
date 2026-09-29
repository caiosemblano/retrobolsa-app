import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import { Termo } from './Termo';
import { Benchmark, ChartPoint } from '../types';
import type { TermoId } from '../content/glossario';

interface RentabilityChartProps {
  data: ChartPoint[];
  /** Referências para comparar; a poupança fica fora do gráfico (anda perto do CDI) e aparece na lista. */
  benchmarks?: Benchmark[];
}

interface Serie {
  chave: string;
  nome: string;
  cor: string;
  termo?: TermoId;
  tracejada?: boolean;
  destaque?: boolean;
}

// Ordem e cores fixas por entidade (validadas em globals.css): uma referência que falta não repinta as outras.
const SERIES: Serie[] = [
  { chave: 'carteira', nome: 'Sua carteira', cor: 'var(--viz-carteira)', destaque: true },
  { chave: 'CDI', nome: 'CDI', cor: 'var(--viz-cdi)', termo: 'CDI' },
  { chave: 'IBOVESPA', nome: 'Ibovespa', cor: 'var(--viz-ibovespa)', termo: 'IBOVESPA' },
  { chave: 'IPCA', nome: 'Inflação (IPCA)', cor: 'var(--viz-inflacao)', termo: 'IPCA', tracejada: true },
];

const reais = (valor: number) => `R$ ${Math.round(valor).toLocaleString('pt-BR')}`;

/** Uma linha por ano, com a carteira e cada referência lado a lado, como o recharts espera. */
export function juntarSeries(data: ChartPoint[], benchmarks: Benchmark[]) {
  return data.map((ponto) => {
    const linha: Record<string, number> = { year: ponto.year, carteira: ponto.value };
    for (const benchmark of benchmarks) {
      const doAno = benchmark.chartData.find((p) => p.year === ponto.year);
      if (doAno) linha[benchmark.code] = doAno.value;
    }
    return linha;
  });
}

export function RentabilityChart({ data, benchmarks = [] }: RentabilityChartProps) {
  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const codigos = new Set(benchmarks.map((b) => b.code));
  const series = SERIES.filter((serie) => serie.chave === 'carteira' || codigos.has(serie.chave));
  const comparando = series.length > 1;
  const nomePorChave = Object.fromEntries(series.map((serie) => [serie.chave, serie.nome]));

  return (
    <Card className="gap-4 p-5">
      <div>
        <h3 className="font-display text-lg">Evolução do patrimônio</h3>
        <p className="text-sm text-muted-foreground">
          {comparando
            ? `Seus ${reais(first)} viraram ${reais(last)}. As outras linhas mostram o mesmo valor no CDI, na bolsa e corrigido pela inflação.`
            : `De ${reais(first)} a ${reais(last)} no período simulado.`}
        </p>
      </div>

      {comparando && (
        <ul aria-label="Legenda do gráfico" className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          {series.map((serie) => (
            <li key={serie.chave} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-5 border-t-[3px]"
                style={{ borderColor: serie.cor, borderStyle: serie.tracejada ? 'dashed' : 'solid' }}
              />
              {serie.termo ? <Termo id={serie.termo}>{serie.nome}</Termo> : <span className="font-semibold">{serie.nome}</span>}
            </li>
          ))}
        </ul>
      )}

      {data.length ? (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={juntarSeries(data, benchmarks)} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,170,214,0.14)" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={{ stroke: 'rgba(148,170,214,0.16)' }}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              width={56}
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(148,170,214,0.3)', strokeWidth: 1 }}
              formatter={(value: number, chave: string) => [reais(value), nomePorChave[chave] ?? chave]}
              // Cada ponto é o valor no começo do ano (o último, depois do último ano simulado).
              labelFormatter={(label) => `Início de ${label}`}
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--popover-foreground)',
                boxShadow: 'var(--shadow-lifted)',
              }}
              labelStyle={{ color: 'var(--muted-foreground)' }}
              itemStyle={{ color: 'var(--popover-foreground)' }}
            />
            {/* Referências primeiro, para a carteira ficar por cima. */}
            {series
              .filter((serie) => !serie.destaque)
              .map((serie) => (
                <Line
                  key={serie.chave}
                  type="monotone"
                  dataKey={serie.chave}
                  stroke={serie.cor}
                  strokeWidth={2}
                  strokeDasharray={serie.tracejada ? '6 4' : undefined}
                  dot={false}
                  activeDot={{ r: 4, fill: serie.cor, stroke: 'var(--card)', strokeWidth: 2 }}
                />
              ))}
            <Line
              type="monotone"
              dataKey="carteira"
              stroke="var(--viz-carteira)"
              strokeWidth={3}
              dot={{ fill: 'var(--viz-carteira)', r: 4, stroke: 'var(--card)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--viz-carteira)', stroke: 'var(--card)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">Sem dados de evolução para esta rodada.</p>
      )}
    </Card>
  );
}
