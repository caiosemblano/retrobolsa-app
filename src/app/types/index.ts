export interface Asset {
  id: string;
  type: 'stock' | 'bond';
  anonymousName: string;
  realName?: string;
  sector?: string;
  indicators?: {
    pl?: number;
    /** Em %, como a API envia (ex.: 18.3 = 18,3%). */
    roe?: number;
    /** Em %. */
    dividendYield?: number;
    /** P/VP (preço sobre valor patrimonial); a API mantém o nome antigo do campo. */
    lvp?: number;
    lucroPositivo?: boolean;
    /** Fração (0.28 = 28% ao ano). */
    cagrLucro?: number;
    /** Fração. */
    cagrReceita?: number;
    /** Em %. */
    margemEbitda?: number;
  };
  bondType?: string;
  rate?: number;
  /** Presentes apenas nos ativos revelados de um resultado (Result.revealedAssets). */
  ticker?: string;
  amountInvested?: number;
  finalValue?: number;
  /** Quanto o ativo rendeu no período, em %. */
  returnPct?: number;
  /** Quanto somou (ou tirou) da carteira, em pontos percentuais do orçamento. */
  contribution?: number;
  /** Frase sobre o ativo no período; só depois da revelação. */
  revealNote?: string;
}

/** Um número do cenário econômico da rodada, do ano anterior ao início. */
export interface EconomicIndicator {
  /** SELIC, IPCA, DOLAR ou PIB: escolhe o ícone e o verbete do glossário. */
  code: string;
  label: string;
  value: number;
  /** "% a.a.", "% no ano" ou "R$". */
  unit: string;
  year: number;
}

export interface Competition {
  id: string;
  round: number;
  status: 'draft' | 'open' | 'closed' | 'simulating' | 'simulated' | 'revealed';
  daysLeft?: number;
  economicContext: {
    title: string;
    indicators: EconomicIndicator[];
  };
  period?: string;
  budget: number;
  scenarioDescription?: string;
  startYear?: number;
  endYear?: number;
  endsAt?: string;
  assets: Asset[];
}

export interface Portfolio {
  [assetId: string]: number;
}

export interface ChartPoint {
  year: number;
  value: number;
}

/** O orçamento da rodada aplicado numa referência do mercado. */
export interface Benchmark {
  /** CDI, POUPANCA, IBOVESPA ou IPCA. */
  code: string;
  name: string;
  /** Rentabilidade no período, em %. */
  totalReturn: number;
  chartData: ChartPoint[];
}

/** Lição tirada da carteira, com a aula do assunto quando existe. */
export interface Tip {
  code: string;
  message: string;
  moduleId?: string;
  articleId?: string;
}

export interface RoundStats {
  participants: number;
  medianReturn?: number;
  bestAsset?: { anonymousName: string; realName?: string; returnPct: number };
}

export interface Result {
  rank: number;
  rentability: number;
  annualReturn: number;
  portfolioValue: number;
  chartData: ChartPoint[];
  revealedAssets: Asset[];
  period: string;
  benchmarks: Benchmark[];
  roundStats?: RoundStats;
  /** O que aconteceu de verdade no período; só depois da revelação. */
  debrief?: string;
  tips: Tip[];
}

export interface RankingEntry {
  rank: number;
  username: string;
  points: number;
  rentability?: number;
  isCurrentUser?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonsCount: number;
  completedLessons: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  completed: boolean;
}

/** Raridade das conquistas, como a API envia (sem acento). */
export type AchievementRarity = 'comum' | 'raro' | 'epico' | 'lendario';

export interface Achievement {
  /** Identificador estável vindo da API (ex.: "CAMPEAO_RODADA"); também escolhe a arte do emblema. */
  code: string;
  title: string;
  description: string;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  username: string;
  email?: string;
  role?: string;
  avatar: string;
  totalPoints: number;
  bestRank: number;
  favoriteAsset: string;
  achievements: Achievement[];
  completedCompetitions: number;
  history?: {
    roundNumber: number;
    scenarioTitle: string;
    totalReturn: number;
    finalValue: number;
    rank: number;
    submittedAt: string;
  }[];
}
