import api from './api';
import { Module, Lesson } from '../types';

export interface ArticleDetail {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  durationMin: number;
  completed: boolean;
}

let mockModules: Module[] = [
  {
    id: 'm1',
    title: 'Módulo 1: Básico',
    description: 'Iniciando no Mercado Financeiro',
    icon: 'TrendingUp',
    lessonsCount: 3,
    completedLessons: 0,
  },
  {
    id: 'm2',
    title: 'Módulo 2: Intermediário',
    description: 'Análise e Indicadores',
    icon: 'BarChart2',
    lessonsCount: 3,
    completedLessons: 0,
  },
  {
    id: 'm3',
    title: 'Módulo 3: Avançado',
    description: 'Estratégias de Investimento',
    icon: 'Target',
    lessonsCount: 3,
    completedLessons: 0,
  }
];

let mockLessons: Lesson[] = [
  // Básico
  { id: 'l1', moduleId: 'm1', title: 'O que é a Bolsa de Valores?', duration: '8 min', summary: 'Entenda o funcionamento do mercado de capitais e como empresas captam recursos.', youtubeUrl: 'https://www.youtube.com/watch?v=F3cE7iX1Y1I', completed: false },
  { id: 'l2', moduleId: 'm1', title: 'Renda Fixa vs Renda Variável', duration: '12 min', summary: 'As diferenças fundamentais entre ser credor e sócio de uma empresa.', youtubeUrl: 'https://www.youtube.com/watch?v=D-w_u2qJ1yI', completed: false },
  { id: 'l3', moduleId: 'm1', title: 'Perfil de Investidor', duration: '5 min', summary: 'Descubra sua tolerância a risco (Conservador, Moderado, Arrojado) antes de investir.', youtubeUrl: 'https://www.youtube.com/watch?v=1F3K_xU_83I', completed: false },
  
  // Intermediário
  { id: 'l4', moduleId: 'm2', title: 'Análise Fundamentalista', duration: '15 min', summary: 'Aprenda a avaliar a saúde financeira de uma empresa através de seus balanços e resultados.', youtubeUrl: 'https://www.youtube.com/watch?v=mD_kL8wA2O0', completed: false },
  { id: 'l5', moduleId: 'm2', title: 'Indicadores: P/L, ROE e DY', duration: '20 min', summary: 'Como calcular e interpretar os principais indicadores para escolher ações.', youtubeUrl: 'https://www.youtube.com/watch?v=M9p42uN0Qcw', completed: false },
  { id: 'l6', moduleId: 'm2', title: 'Fundos Imobiliários (FIIs)', duration: '10 min', summary: 'Como investir no mercado imobiliário comprando cotas na bolsa e recebendo aluguéis mensais.', youtubeUrl: 'https://www.youtube.com/watch?v=xVl6yV0_8t8', completed: false },

  // Avançado (Value, Growth, Deep Value)
  { id: 'l7', moduleId: 'm3', title: 'Value Investing', duration: '18 min', summary: 'A estratégia de comprar ações por menos do que seu valor intrínseco, focando no longo prazo e empresas sólidas.', youtubeUrl: 'https://www.youtube.com/watch?v=cRmcbqV7XpY', completed: false },
  { id: 'l8', moduleId: 'm3', title: 'Growth Investing', duration: '16 min', summary: 'Como investir em empresas com alto potencial de crescimento, focando na valorização rápida em vez de dividendos.', youtubeUrl: 'https://www.youtube.com/watch?v=F3cE7iX1Y1I', completed: false },
  { id: 'l9', moduleId: 'm3', title: 'Deep Value', duration: '22 min', summary: 'A busca por assimetrias extremas: investir em ativos profundamente descontados e, muitas vezes, negligenciados.', youtubeUrl: 'https://www.youtube.com/watch?v=M9p42uN0Qcw', completed: false }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const articleService = {
  getModules: async () => {
    await delay(500);
    return { data: mockModules };
  },

  getLessons: async (moduleId: string) => {
    await delay(300);
    return { data: mockLessons.filter(l => l.moduleId === moduleId) };
  },

  getById: async (id: string) => {
    await delay(300);
    return { data: {} as ArticleDetail }; // Mock stub
  },

  complete: async (id: string) => {
    await delay(300);
    const lesson = mockLessons.find(l => l.id === id);
    if (lesson && !lesson.completed) {
      lesson.completed = true;
      const module = mockModules.find(m => m.id === lesson.moduleId);
      if (module) {
        module.completedLessons += 1;
      }
    }
    return { data: null };
  },

  uncomplete: async (id: string) => {
    await delay(300);
    const lesson = mockLessons.find(l => l.id === id);
    if (lesson && lesson.completed) {
      lesson.completed = false;
      const module = mockModules.find(m => m.id === lesson.moduleId);
      if (module) {
        module.completedLessons = Math.max(0, module.completedLessons - 1);
      }
    }
    return { data: null };
  },
};
