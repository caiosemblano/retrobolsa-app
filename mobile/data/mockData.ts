import { Competition, RankingEntry, Module, Lesson, Achievement, UserProfile, Result } from '../types';

export const currentCompetition: Competition = {
  id: 'comp-5',
  round: 5,
  status: 'open',
  daysLeft: 2,
  economicContext: {
    title: 'Cenário Econômico da Rodada 5',
    indicators: [
      { name: 'Taxa Básica de Juros', value: '15,0%', icon: 'Percent' },
      { name: 'Inflação Anual', value: '7,5%', icon: 'TrendingUp' },
      { name: 'Crescimento do PIB', value: '2,0%', icon: 'BarChart3' },
      { name: 'Câmbio (USD)', value: 'R$ 2,30', icon: 'DollarSign' },
    ],
  },
  assets: [
    {
      id: 'asset-1',
      type: 'stock',
      anonymousName: 'Empresa A',
      sector: 'Energia',
      indicators: { pl: 8.0, roe: 15, dividendYield: 5.2 },
    },
    {
      id: 'asset-2',
      type: 'stock',
      anonymousName: 'Empresa B',
      sector: 'Financeiro',
      indicators: { pl: 12.5, roe: 18, dividendYield: 6.8 },
    },
    {
      id: 'asset-3',
      type: 'stock',
      anonymousName: 'Empresa C',
      sector: 'Varejo',
      indicators: { pl: 15.2, roe: 12, dividendYield: 3.5 },
    },
    {
      id: 'asset-4',
      type: 'stock',
      anonymousName: 'Empresa D',
      sector: 'Tecnologia',
      indicators: { pl: 22.0, roe: 25, dividendYield: 1.2 },
    },
    {
      id: 'asset-5',
      type: 'stock',
      anonymousName: 'Empresa E',
      sector: 'Commodities',
      indicators: { pl: 6.5, roe: 14, dividendYield: 7.5 },
    },
    {
      id: 'asset-6',
      type: 'bond',
      anonymousName: 'Título 1',
      bondType: 'Prefixado',
      rate: 12.0,
    },
    {
      id: 'asset-7',
      type: 'bond',
      anonymousName: 'Título 2',
      bondType: 'Indexado ao IPCA',
      rate: 6.5,
    },
    {
      id: 'asset-8',
      type: 'bond',
      anonymousName: 'Título 3',
      bondType: 'Pós-fixado (Selic)',
      rate: 15.0,
    },
  ],
};

export const lastResult: Result = {
  rank: 8,
  rentability: 150,
  annualReturn: 12,
  portfolioValue: 250000,
  period: '2004 a 2011',
  chartData: [
    { year: 2004, value: 100000 },
    { year: 2005, value: 112000 },
    { year: 2006, value: 125440 },
    { year: 2007, value: 140493 },
    { year: 2008, value: 135000 },
    { year: 2009, value: 156240 },
    { year: 2010, value: 182000 },
    { year: 2011, value: 250000 },
  ],
  revealedAssets: [
    {
      id: 'asset-1',
      type: 'stock',
      anonymousName: 'Empresa A',
      realName: 'Vale S.A.',
      sector: 'Mineração',
      indicators: { pl: 8.0, roe: 15 },
    },
    {
      id: 'asset-6',
      type: 'bond',
      anonymousName: 'Título 1',
      realName: 'Tesouro Prefixado 2011',
      bondType: 'Prefixado',
      rate: 12.0,
    },
  ],
};

export const quinzenalRanking: RankingEntry[] = [
  { rank: 1, username: 'InvestMaster_BR', points: 1000, rentability: 185 },
  { rank: 2, username: 'FinanceWizard', points: 950, rentability: 172 },
  { rank: 3, username: 'BolsaGuru', points: 900, rentability: 168 },
  { rank: 4, username: 'TraderPro', points: 850, rentability: 165 },
  { rank: 5, username: 'ValorInvestidor', points: 820, rentability: 161 },
  { rank: 6, username: 'PatrimônioPlus', points: 780, rentability: 158 },
  { rank: 7, username: 'CarteiraTop', points: 750, rentability: 154 },
  { rank: 8, username: 'Você', points: 700, rentability: 150, isCurrentUser: true },
  { rank: 9, username: 'BullRunner', points: 680, rentability: 148 },
  { rank: 10, username: 'DividendKing', points: 650, rentability: 145 },
];

export const seasonRanking: RankingEntry[] = [
  { rank: 1, username: 'InvestMaster_BR', points: 4800 },
  { rank: 2, username: 'FinanceWizard', points: 4500 },
  { rank: 3, username: 'BolsaGuru', points: 4200 },
  { rank: 5, username: 'Você', points: 3800, isCurrentUser: true },
  { rank: 6, username: 'TraderPro', points: 3650 },
];

export const generalRanking: RankingEntry[] = [
  { rank: 1, username: 'InvestMaster_BR', points: 18500 },
  { rank: 2, username: 'FinanceWizard', points: 17200 },
  { rank: 3, username: 'BolsaGuru', points: 16800 },
  { rank: 12, username: 'Você', points: 12400, isCurrentUser: true },
];

export const modules: Module[] = [
  {
    id: 'mod-1',
    title: 'Matemática Financeira',
    description: 'Fundamentos de cálculo financeiro e juros compostos',
    icon: 'Calculator',
    lessonsCount: 8,
    completedLessons: 5,
  },
  {
    id: 'mod-2',
    title: 'Fundamentos de Investimentos',
    description: 'Aprenda sobre ações, títulos e análise fundamentalista',
    icon: 'TrendingUp',
    lessonsCount: 12,
    completedLessons: 8,
  },
  {
    id: 'mod-3',
    title: 'Economia',
    description: 'Indicadores econômicos e seu impacto nos investimentos',
    icon: 'Globe',
    lessonsCount: 10,
    completedLessons: 3,
  },
];

export const lessons: Lesson[] = [
  { id: 'lesson-1', moduleId: 'mod-2', title: 'O que é P/L (Preço/Lucro)?', duration: '12 min', completed: true },
  { id: 'lesson-2', moduleId: 'mod-2', title: 'O que é ROE?', duration: '10 min', completed: true },
  { id: 'lesson-3', moduleId: 'mod-2', title: 'Dividend Yield: Entendendo Dividendos', duration: '15 min', completed: true },
  { id: 'lesson-4', moduleId: 'mod-2', title: 'Análise de Balanço Patrimonial', duration: '20 min', completed: false },
  { id: 'lesson-5', moduleId: 'mod-2', title: 'Como Avaliar uma Empresa', duration: '18 min', completed: false },
];

export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Primeira Competição',
    description: 'Completou sua primeira rodada',
    icon: 'Trophy',
    unlocked: true,
    unlockedAt: '2025-10-15',
  },
  {
    id: 'ach-2',
    title: 'Top 10',
    description: 'Ficou entre os 10 melhores em uma rodada',
    icon: 'Award',
    unlocked: true,
    unlockedAt: '2025-11-01',
  },
  {
    id: 'ach-3',
    title: 'Estudante Dedicado',
    description: 'Completou 10 aulas',
    icon: 'GraduationCap',
    unlocked: true,
    unlockedAt: '2025-10-28',
  },
  {
    id: 'ach-4',
    title: 'Mestre dos Títulos',
    description: 'Acertou a melhor alocação em títulos',
    icon: 'Medal',
    unlocked: false,
  },
  {
    id: 'ach-5',
    title: 'Campeão da Temporada',
    description: 'Ficou em 1º lugar na temporada',
    icon: 'Crown',
    unlocked: false,
  },
];

export const userProfile: UserProfile = {
  username: 'Você',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor',
  totalPoints: 12400,
  bestRank: 3,
  favoriteAsset: 'Ações de Energia',
  achievements: achievements,
  completedCompetitions: 18,
};
