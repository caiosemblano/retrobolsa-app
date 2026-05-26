export interface Asset {
  id: string;
  type: 'stock' | 'bond';
  anonymousName: string;
  realName?: string;
  sector?: string;
  indicators?: {
    pl?: number;
    roe?: number;
    dividendYield?: number;
  };
  bondType?: string;
  rate?: number;
}

export interface EconomicIndicator {
  name: string;
  value: string;
  icon: string;
}

export interface Competition {
  id: string;
  round: number;
  status: 'open' | 'closed' | 'simulating';
  daysLeft?: number;
  economicContext: {
    title: string;
    indicators: EconomicIndicator[];
  };
  period?: string;
  assets: Asset[];
}

export interface Portfolio {
  [assetId: string]: number;
}

export interface Result {
  rank: number;
  rentability: number;
  annualReturn: number;
  portfolioValue: number;
  chartData: { year: number; value: number }[];
  revealedAssets: Asset[];
  period: string;
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  username: string;
  avatar: string;
  totalPoints: number;
  bestRank: number;
  favoriteAsset: string;
  achievements: Achievement[];
  completedCompetitions: number;
}
