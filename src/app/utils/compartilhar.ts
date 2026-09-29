import { formatarNumero } from './numero';
import { baixarArquivo } from './download';

export interface DadosDoCartao {
  rentabilidade: number;
  /** Rentabilidade do CDI no mesmo período; ausente se a rodada não tem os dados. */
  cdi?: number;
  /** Anos vividos na rodada, como "2011–2013". */
  periodo: string;
  nivel?: number;
  tituloDoNivel?: string;
}

const LADO = 1080;

const pct = (valor: number) => `${valor > 0 ? '+' : ''}${formatarNumero(valor, 1)}%`;

const escapar = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** O texto da comparação com o CDI, em pontos percentuais. */
export function frenteAoCdi(rentabilidade: number, cdi: number): string {
  const diferenca = rentabilidade - cdi;
  if (Math.abs(diferenca) < 0.05) return 'Empatou com o CDI';
  return `${formatarNumero(Math.abs(diferenca), 1)} p.p. ${diferenca > 0 ? 'acima' : 'abaixo'} do CDI`;
}

/** O cartão do resultado em SVG, 1080 × 1080, com as cores do app e fontes do sistema. */
export function montarSvg(dados: DadosDoCartao): string {
  const positivo = dados.rentabilidade >= 0;
  const corDoResultado = positivo ? '#22c55e' : '#f4626f';
  const linhas: string[] = [];
  if (dados.cdi !== undefined) {
    linhas.push(`<text x="540" y="640" text-anchor="middle" font-size="44" fill="#e5e7eb">${escapar(frenteAoCdi(dados.rentabilidade, dados.cdi))}</text>`);
    linhas.push(`<text x="540" y="700" text-anchor="middle" font-size="34" fill="#9ca3af">O CDI rendeu ${escapar(pct(dados.cdi))} no período</text>`);
  }
  if (dados.nivel !== undefined && dados.tituloDoNivel) {
    linhas.push(`<rect x="340" y="770" width="400" height="84" rx="42" fill="rgba(251,191,36,0.14)" stroke="#fbbf24" stroke-width="3"/>`);
    linhas.push(`<text x="540" y="825" text-anchor="middle" font-size="36" font-weight="700" fill="#fbbf24">Nível ${dados.nivel} · ${escapar(dados.tituloDoNivel)}</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}" viewBox="0 0 ${LADO} ${LADO}" font-family="Arial, Helvetica, sans-serif">
  <rect width="${LADO}" height="${LADO}" fill="#070b14"/>
  <rect x="40" y="40" width="1000" height="1000" rx="48" fill="#0f1623" stroke="${corDoResultado}" stroke-opacity="0.5" stroke-width="4"/>
  <text x="540" y="170" text-anchor="middle" font-size="52" font-weight="700" fill="#22c55e">RetroBolsa</text>
  <text x="540" y="230" text-anchor="middle" font-size="34" fill="#9ca3af">Minha carteira em ${escapar(dados.periodo)}</text>
  <text x="540" y="470" text-anchor="middle" font-size="190" font-weight="700" fill="${corDoResultado}">${escapar(pct(dados.rentabilidade))}</text>
  ${linhas.join('\n  ')}
  <text x="540" y="960" text-anchor="middle" font-size="30" fill="#6b7280">Simulador histórico de investimentos</text>
</svg>`;
}

/** Desenha o SVG num canvas e devolve o PNG. */
export function svgParaPng(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = LADO;
      canvas.height = LADO;
      const contexto = canvas.getContext('2d');
      if (!contexto) return reject(new Error('Canvas indisponível'));
      contexto.drawImage(imagem, 0, 0);
      canvas.toBlob((png) => (png ? resolve(png) : reject(new Error('Falha ao gerar a imagem'))), 'image/png');
    };
    imagem.onerror = () => reject(new Error('Falha ao desenhar o cartão'));
    imagem.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/**
 * Gera a imagem e abre o menu de compartilhar do aparelho; onde não há (a maioria
 * dos computadores), baixa o arquivo.
 *
 * @return "compartilhado" ou "baixado"
 */
export async function compartilharResultado(
  dados: DadosDoCartao,
  gerarPng: (dados: DadosDoCartao) => Promise<Blob> = (d) => svgParaPng(montarSvg(d)),
): Promise<'compartilhado' | 'baixado'> {
  const png = await gerarPng(dados);
  const nome = 'resultado-retrobolsa.png';
  const arquivo = new File([png], nome, { type: 'image/png' });
  if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [arquivo] })) {
    await navigator.share({
      files: [arquivo],
      title: 'Meu resultado no RetroBolsa',
      text: `Minha carteira rendeu ${pct(dados.rentabilidade)} em ${dados.periodo} no RetroBolsa.`,
    });
    return 'compartilhado';
  }
  baixarArquivo(png, nome);
  return 'baixado';
}
