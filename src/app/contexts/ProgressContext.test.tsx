import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProgressProvider, useProgress } from './ProgressContext';
import { NivelCard } from '../components/NivelCard';
import { progressService, Progress, ProgressNews } from '../services/progressService';

vi.mock('../services/progressService', async (original) => ({
  ...(await original<typeof import('../services/progressService')>()),
  progressService: { get: vi.fn(), news: vi.fn(), acknowledge: vi.fn() },
}));

const mocked = vi.mocked(progressService);

const progresso = (overrides: Partial<Progress> = {}): Progress => ({
  xp: 55, level: 2, levelTitle: 'Aprendiz', levelMinXp: 50, nextLevel: 3, nextLevelTitle: 'Estagiário',
  nextLevelMinXp: 150, streakWeeks: 1, ...overrides,
});

const semNovidades: ProgressNews = { items: [], xpGained: 0, levelUp: false, level: 2, levelTitle: 'Aprendiz', achievements: [] };

const novidades: ProgressNews = {
  items: [
    { id: 'e1', source: 'LESSON', label: 'Aula concluída: O que é rentabilidade?', amount: 20 },
    { id: 'e2', source: 'QUIZ_PERFECT', label: 'Nota máxima no quiz: O que é rentabilidade?', amount: 15 },
    { id: 'e3', source: 'ACHIEVEMENT', label: 'Conquista: Nota Dez', amount: 10 },
  ],
  xpGained: 45,
  levelUp: true,
  level: 2,
  levelTitle: 'Aprendiz',
  achievements: [
    { code: 'NOTA_DEZ', title: 'Nota Dez', description: 'Acertou todas as perguntas do quiz de uma aula.', rarity: 'comum', unlocked: true, unlockedAt: '2026-09-29T10:00:00' },
  ],
};

function BotaoAtualizar() {
  const { refresh } = useProgress();
  return <button onClick={refresh}>Terminei o quiz</button>;
}

const renderizar = () =>
  render(
    <ProgressProvider>
      <BotaoAtualizar />
      <NivelCard />
    </ProgressProvider>,
  );

describe('ProgressProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.get.mockResolvedValue({ data: progresso() } as never);
    mocked.news.mockResolvedValue({ data: semNovidades } as never);
    mocked.acknowledge.mockResolvedValue({} as never);
  });

  it('comemora o que foi ganho: XP, nível novo, emblema e cada ganho', async () => {
    mocked.news.mockResolvedValue({ data: novidades } as never);
    renderizar();

    const dialogo = await screen.findByRole('dialog');
    expect(within(dialogo).getByRole('heading', { name: '+45 XP' })).toBeInTheDocument();
    expect(dialogo).toHaveTextContent('Você subiu para o nível 2: Aprendiz!');
    expect(within(dialogo).getByRole('heading', { name: 'Nota Dez' })).toBeInTheDocument();
    const ganhos = within(within(dialogo).getByRole('list', { name: 'Ganhos de XP' })).getAllByRole('listitem');
    expect(ganhos.map((g) => g.textContent)).toEqual([
      'Aula concluída: O que é rentabilidade?+20',
      'Nota máxima no quiz: O que é rentabilidade?+15',
      'Conquista: Nota Dez+10',
    ]);
  });

  it('"Continuar" fecha e marca como visto exatamente o que foi mostrado', async () => {
    mocked.news.mockResolvedValue({ data: novidades } as never);
    const user = userEvent.setup();
    renderizar();

    await user.click(await screen.findByRole('button', { name: 'Continuar' }));

    expect(mocked.acknowledge).toHaveBeenCalledWith(['e1', 'e2', 'e3']);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('sem novidades, não abre nada', async () => {
    renderizar();
    await screen.findByRole('heading', { name: 'Nível 2: Aprendiz' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('refresh() busca de novo e comemora o que chegou depois de uma ação', async () => {
    const user = userEvent.setup();
    renderizar();
    await screen.findByRole('heading', { name: 'Nível 2: Aprendiz' });

    mocked.news.mockResolvedValue({ data: novidades } as never);
    await user.click(screen.getByRole('button', { name: 'Terminei o quiz' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(mocked.news).toHaveBeenCalledTimes(2);
  });

  it('se a API de progresso falhar, a tela segue sem nível e sem erro', async () => {
    mocked.get.mockRejectedValue(new Error('rede'));
    mocked.news.mockRejectedValue(new Error('rede'));
    const { container } = renderizar();

    await waitFor(() => expect(mocked.get).toHaveBeenCalled());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Terminei o quiz');
  });
});

describe('NivelCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.news.mockResolvedValue({ data: semNovidades } as never);
  });

  it('mostra o nível, o quanto falta e a sequência de semanas', async () => {
    mocked.get.mockResolvedValue({ data: progresso({ xp: 100, streakWeeks: 3 }) } as never);
    renderizar();

    const card = (await screen.findByRole('heading', { name: 'Nível 2: Aprendiz' })).closest('[data-slot="card"]') as HTMLElement;
    expect(card).toHaveTextContent('100 XP');
    expect(card).toHaveTextContent('Faltam 50 XP para Estagiário.');
    expect(within(card).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(card).toHaveTextContent('3 semanas seguidas estudando ou jogando.');
  });

  it('no nível máximo e sem sequência', async () => {
    mocked.get.mockResolvedValue({
      data: progresso({ xp: 1400, level: 8, levelTitle: 'Lenda do Pregão', levelMinXp: 1300, nextLevel: null, nextLevelTitle: null, nextLevelMinXp: null, streakWeeks: 0 }),
    } as never);
    renderizar();

    const card = (await screen.findByRole('heading', { name: 'Nível 8: Lenda do Pregão' })).closest('[data-slot="card"]') as HTMLElement;
    expect(card).toHaveTextContent('Você chegou ao nível máximo!');
    expect(card).toHaveTextContent('Estude ou jogue esta semana para começar uma sequência.');
  });
});
