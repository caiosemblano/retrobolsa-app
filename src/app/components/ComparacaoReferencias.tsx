import { Card } from './ui/card';
import { Termo } from './Termo';
import { termoDoIndicador } from '../content/glossario';
import { Benchmark } from '../types';
import { formatarNumero } from '../utils/numero';

interface ComparacaoReferenciasProps {
  /** Rentabilidade da carteira no período, em %. */
  rentabilidade: number;
  benchmarks: Benchmark[];
}

const pct = (valor: number) => `${valor > 0 ? '+' : ''}${formatarNumero(valor, 1)}%`;

/** Diferença em pontos percentuais: "3,2 p.p. acima" / "1,5 p.p. abaixo". */
export function diferenca(carteira: number, referencia: number): { texto: string; acima: boolean } {
  const pontos = carteira - referencia;
  const acima = pontos >= 0;
  return { texto: `${formatarNumero(Math.abs(pontos), 1)} p.p. ${acima ? 'acima' : 'abaixo'}`, acima };
}

/**
 * A mesma comparação do gráfico em forma de lista: quanto rendeu cada referência e
 * quanto a carteira ficou acima ou abaixo dela. Serve também de leitura sem o gráfico.
 */
export function ComparacaoReferencias({ rentabilidade, benchmarks }: ComparacaoReferenciasProps) {
  if (!benchmarks.length) return null;

  return (
    <Card className="gap-3 p-5">
      <h3 className="font-display text-lg">Você × referências</h3>
      <p className="-mt-1 text-sm text-muted-foreground">
        O que os mesmos R$ teriam rendido sem montar carteira nenhuma.
      </p>
      <table className="w-full text-sm">
        <caption className="sr-only">Rentabilidade da sua carteira comparada às referências do mercado</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Referência</th>
            <th scope="col">Rendeu</th>
            <th scope="col">Sua carteira em relação a ela</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <th scope="row" className="py-2 text-left font-semibold">Sua carteira</th>
            <td className="tabular py-2 text-right font-display font-semibold">{pct(rentabilidade)}</td>
            <td className="py-2" />
          </tr>
          {benchmarks.map((benchmark) => {
            const termo = termoDoIndicador(benchmark.code);
            const { texto, acima } = diferenca(rentabilidade, benchmark.totalReturn);
            return (
              <tr key={benchmark.code} className="border-b border-border last:border-0">
                <th scope="row" className="py-2 text-left font-normal">
                  {termo ? <Termo id={termo}>{benchmark.name}</Termo> : benchmark.name}
                </th>
                <td className="tabular py-2 text-right">{pct(benchmark.totalReturn)}</td>
                <td className={`tabular py-2 pl-3 text-right text-xs font-semibold ${acima ? 'text-gain' : 'text-loss'}`}>
                  você: {texto}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
