import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';

interface RentabilityChartProps {
  data: { year: number; value: number }[];
}

export function RentabilityChart({ data }: RentabilityChartProps) {
  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const isPositive = last >= first;
  const lineColor = isPositive ? 'var(--gain)' : 'var(--loss)';

  return (
    <Card className="gap-4 p-5">
      <div>
        <h3 className="font-display text-lg">Evolução do patrimônio</h3>
        <p className="text-sm text-muted-foreground">
          De R$ {first.toLocaleString('pt-BR')} a R$ {last.toLocaleString('pt-BR')} no período simulado.
        </p>
      </div>

      {data.length ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="rentabilityLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.55} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={1} />
              </linearGradient>
            </defs>
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
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Patrimônio']}
              labelFormatter={(label) => `Ano ${label}`}
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--popover-foreground)',
                boxShadow: 'var(--shadow-lifted)',
              }}
              labelStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#rentabilityLine)"
              strokeWidth={3}
              dot={{ fill: lineColor, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: lineColor, stroke: 'var(--background)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Sem dados de evolução para esta rodada.
        </p>
      )}
    </Card>
  );
}
