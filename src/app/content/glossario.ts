/**
 * Glossário do jogo: cada sigla que aparece ao montar a carteira tem uma
 * explicação curta e, quando existe, a aula que aprofunda o assunto.
 */

export interface Verbete {
  /** Como aparece na tela (ex.: "P/L"). */
  sigla: string;
  /** Nome por extenso, título do balão. */
  nome: string;
  /** O que é, numa frase. */
  oQueE: string;
  /** Como ler o número, com um exemplo. */
  comoLer: string;
  aula?: { moduloId: string; aulaId: string };
}

// IDs fixos do seed de aulas (V3): módulos aaaaaaaa-…, aulas bbbbbbbb-….
const MATEMATICA = 'aaaaaaaa-0001-0000-0000-000000000001';
const FUNDAMENTOS = 'aaaaaaaa-0002-0000-0000-000000000002';
const MACRO = 'aaaaaaaa-0003-0000-0000-000000000003';

export const glossario = {
  PL: {
    sigla: 'P/L',
    nome: 'P/L (Preço sobre Lucro)',
    oQueE: 'Quantos anos do lucro atual seriam necessários para “pagar” o preço da ação.',
    comoLer:
      'P/L 10 = o mercado paga R$ 10 por cada R$ 1 de lucro anual. Um P/L baixo pode indicar ação barata ou uma empresa de que o mercado desconfia: compare com empresas do mesmo setor.',
    aula: { moduloId: FUNDAMENTOS, aulaId: 'bbbbbbbb-0004-0000-0000-000000000004' },
  },
  ROE: {
    sigla: 'ROE',
    nome: 'ROE (Retorno sobre o Patrimônio)',
    oQueE: 'Quanto de lucro a empresa gera por ano para cada R$ 100 que os sócios têm investidos nela.',
    comoLer:
      'ROE de 20% = R$ 20 de lucro por ano para cada R$ 100 de patrimônio. Quanto maior, mais eficiente a empresa, desde que o resultado não venha de dívida demais.',
    aula: { moduloId: FUNDAMENTOS, aulaId: 'bbbbbbbb-0005-0000-0000-000000000005' },
  },
  DY: {
    sigla: 'DY',
    nome: 'Dividend Yield',
    oQueE: 'Quanto a empresa pagou em dividendos no ano, em relação ao preço da ação.',
    comoLer:
      'DY de 6% = quem tinha R$ 1.000 na ação recebeu cerca de R$ 60 no ano, em dinheiro. Um DY muito alto às vezes vem de uma queda forte no preço, não de dividendos maiores.',
    aula: { moduloId: FUNDAMENTOS, aulaId: 'bbbbbbbb-0006-0000-0000-000000000006' },
  },
  PVP: {
    sigla: 'P/VP',
    nome: 'P/VP (Preço sobre Valor Patrimonial)',
    oQueE: 'Compara quanto a empresa vale na bolsa com o patrimônio registrado no balanço.',
    comoLer:
      'P/VP 1 = a bolsa paga pela empresa o mesmo que ela tem de patrimônio. Acima de 1, o mercado aposta que ela vale mais do que o balanço mostra, por exemplo por gerar lucros altos.',
  },
  MARGEM_EBITDA: {
    sigla: 'Margem EBITDA',
    nome: 'Margem EBITDA',
    oQueE: 'Quanto sobra das vendas depois dos custos da operação, antes de juros, impostos e depreciação.',
    comoLer:
      'Margem de 40% = de cada R$ 100 vendidos, sobram R$ 40 da operação. Margens maiores dão mais fôlego numa crise. Bancos não usam esse indicador.',
  },
  CAGR_LUCRO: {
    sigla: 'Cresc. do lucro',
    nome: 'Crescimento do lucro (CAGR)',
    oQueE: 'Quanto o lucro da empresa cresceu, em média, a cada ano nos últimos anos.',
    comoLer:
      '20% = lucro crescendo 20% ao ano, em média. O passado não garante o futuro, mas mostra a trajetória da empresa.',
    aula: { moduloId: MATEMATICA, aulaId: 'bbbbbbbb-0003-0000-0000-000000000003' },
  },
  CAGR_RECEITA: {
    sigla: 'Cresc. da receita',
    nome: 'Crescimento da receita (CAGR)',
    oQueE: 'Quanto as vendas da empresa cresceram, em média, a cada ano nos últimos anos.',
    comoLer:
      'Receita crescendo mais rápido que o lucro pode indicar custos subindo; o contrário, uma empresa ficando mais eficiente.',
    aula: { moduloId: MATEMATICA, aulaId: 'bbbbbbbb-0003-0000-0000-000000000003' },
  },
  LUCRO_POSITIVO: {
    sigla: 'Lucro no ano',
    nome: 'Lucro no último ano',
    oQueE: 'Se a empresa terminou o último ano com lucro ou com prejuízo.',
    comoLer:
      '“Sim” = lucrou. Empresas com prejuízo podem se recuperar, mas o risco de perder dinheiro costuma ser maior.',
  },
  SELIC: {
    sigla: 'Selic',
    nome: 'Taxa Selic',
    oQueE: 'A taxa básica de juros do país, definida pelo Banco Central.',
    comoLer:
      'Selic alta deixa a renda fixa mais atraente e o crédito mais caro, o que costuma pesar sobre as ações. Selic baixa faz o contrário.',
    aula: { moduloId: MACRO, aulaId: 'bbbbbbbb-0007-0000-0000-000000000007' },
  },
  IPCA: {
    sigla: 'IPCA',
    nome: 'Inflação (IPCA)',
    oQueE: 'Quanto os preços subiram, em média, no ano. É a inflação oficial do Brasil.',
    comoLer:
      'IPCA de 10% = o que custava R$ 100 passou a custar R$ 110. Um investimento que rende menos que isso faz você perder poder de compra.',
    aula: { moduloId: MACRO, aulaId: 'bbbbbbbb-0008-0000-0000-000000000008' },
  },
  CDI: {
    sigla: 'CDI',
    nome: 'CDI',
    oQueE: 'Taxa dos empréstimos de um dia entre bancos. Anda colada na Selic e é a principal referência da renda fixa.',
    comoLer:
      'Um CDB que paga 100% do CDI rende o mesmo que ele. Se uma carteira com ações rende menos que o CDI, o risco extra não compensou.',
    aula: { moduloId: MACRO, aulaId: 'bbbbbbbb-0007-0000-0000-000000000007' },
  },
  POUPANCA: {
    sigla: 'Poupança',
    nome: 'Poupança',
    oQueE: 'A aplicação mais popular do país: rende 0,5% ao mês mais a TR, ou 70% da Selic quando ela está em 8,5% ao ano ou menos.',
    comoLer: 'É simples e não tem imposto de renda, mas quase sempre rende menos que o CDI e, em alguns anos, menos que a inflação.',
  },
  IBOVESPA: {
    sigla: 'Ibovespa',
    nome: 'Ibovespa',
    oQueE: 'Índice que acompanha as ações mais negociadas da bolsa brasileira.',
    comoLer:
      'Mostra como foi a bolsa, em média. Ganhar do Ibovespa escolhendo ações é difícil até para profissionais.',
  },
  DOLAR: {
    sigla: 'Dólar',
    nome: 'Dólar',
    oQueE: 'Quanto valia um dólar, em reais, no fim do ano (cotação oficial do Banco Central).',
    comoLer:
      'Dólar alto ajuda quem vende para fora e recebe em dólar, como mineração e petróleo, e encarece o que o país importa.',
  },
  PIB: {
    sigla: 'PIB',
    nome: 'Crescimento do PIB',
    oQueE: 'Quanto a produção de bens e serviços do país cresceu no ano, já descontada a inflação.',
    comoLer:
      'PIB crescendo costuma vir com mais vendas e lucros para as empresas. PIB negativo indica recessão.',
  },
  PREFIXADO: {
    sigla: 'Prefixado',
    nome: 'Título prefixado',
    oQueE: 'Título do governo com a taxa de juros definida no dia da compra.',
    comoLer:
      'Levando até o vencimento, você sabe quanto vai receber. Se os juros do país subirem depois da compra, o título perde valor no caminho.',
  },
  IPCA_MAIS: {
    sigla: 'IPCA+',
    nome: 'Título IPCA+',
    oQueE: 'Título do governo que paga a inflação do período mais uma taxa fixa.',
    comoLer: 'Protege o poder de compra: rende acima da inflação, seja ela alta ou baixa.',
    aula: { moduloId: MACRO, aulaId: 'bbbbbbbb-0008-0000-0000-000000000008' },
  },
  TESOURO_SELIC: {
    sigla: 'Selic',
    nome: 'Título Selic',
    oQueE: 'Título do governo que rende a taxa Selic de cada dia.',
    comoLer:
      'É o título mais estável: acompanha os juros e quase não oscila de preço. Costuma ser usado como reserva de emergência.',
    aula: { moduloId: MACRO, aulaId: 'bbbbbbbb-0007-0000-0000-000000000007' },
  },
} satisfies Record<string, Verbete>;

export type TermoId = keyof typeof glossario;

/** Verbete do tipo de título, como a API envia em `bondType` ("Prefixado", "IPCA+", "Selic"). */
export function termoDoTitulo(bondType?: string): TermoId | null {
  switch (bondType?.trim().toLowerCase()) {
    case 'prefixado':
      return 'PREFIXADO';
    case 'ipca+':
      return 'IPCA_MAIS';
    case 'selic':
      return 'TESOURO_SELIC';
    default:
      return null;
  }
}

/** Verbete de um indicador econômico, pelo `code` que a API envia. */
export function termoDoIndicador(code: string): TermoId | null {
  return code in glossario ? (code as TermoId) : null;
}
