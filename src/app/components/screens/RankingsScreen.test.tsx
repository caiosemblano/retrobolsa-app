import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingsScreen } from './RankingsScreen';
import { rankingService } from '../../services/rankingService';
import { userService } from '../../services/userService';
import { classroomService } from '../../services/classroomService';

vi.mock('../../services/rankingService', async () => {
  const actual = await vi.importActual<typeof import('../../services/rankingService')>(
    '../../services/rankingService',
  );
  return {
    ...actual,
    rankingService: {
      get: vi.fn(),
      getGlobalPage: vi.fn(),
      getMyRank: vi.fn(),
      getSeasonInfo: vi.fn(),
    },
  };
});

vi.mock('../../services/userService', () => ({
  userService: { getProfile: vi.fn() },
}));

vi.mock('../../services/classroomService', () => ({
  classroomService: { mine: vi.fn() },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { email: 'ana@retrobolsa.com', username: 'ana' } }),
}));

const mocked = vi.mocked(rankingService);
const turmasMock = vi.mocked(classroomService.mine);

const entry = (rank: number, username: string, points: number) => ({
  rank,
  username,
  points,
  rentability: undefined,
});

function stubDefaults() {
  mocked.get.mockImplementation(async (type: string) => ({
    data: type === 'quinzenal'
      ? [entry(1, 'bruno', 12), entry(2, 'ana', 8)]
      : [entry(1, 'ana', 36)],
  }) as never);
  mocked.getGlobalPage.mockResolvedValue({ data: [entry(1, 'ana', 120)] } as never);
  mocked.getMyRank.mockResolvedValue({
    data: {
      username: 'ana',
      globalRank: 7,
      totalGlobalPlayers: 120,
      points: 36,
      competitionsPlayed: 2,
      activeRoundRank: 3,
      activeRoundNumber: 6,
      activeRoundStatus: 'simulated',
    },
  } as never);
  mocked.getSeasonInfo.mockResolvedValue({
    data: { seasonNumber: 2, roundStart: 5, roundEnd: 8 },
  } as never);
  turmasMock.mockResolvedValue({ data: [] } as never);
}

const turma = (id: string, name: string) => ({
  id, name, institution: null, teacherUsername: 'marta', memberCount: 20, joinedAt: '2026-09-20T10:00:00',
});

describe('RankingsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubDefaults();
  });

  it('mostra a posição do usuário a partir de /api/rankings/me', async () => {
    render(<RankingsScreen />);

    expect(await screen.findByText('Sua posição')).toBeInTheDocument();
    expect(screen.getByText('Geral: 7º de 120')).toBeInTheDocument();
    expect(screen.getByText('Rodada 6: 3º')).toBeInTheDocument();
  });

  it('destaca o usuário atual usando o contexto, sem buscar o perfil de novo', async () => {
    render(<RankingsScreen />);

    expect(await screen.findByText(/ana/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/\(Você\)/)).toBeInTheDocument());
    expect(userService.getProfile).not.toHaveBeenCalled();
  });

  it('mostra número e faixa de rodadas da temporada atual', async () => {
    const user = userEvent.setup();
    render(<RankingsScreen />);

    await user.click(await screen.findByRole('tab', { name: 'Temporada' }));

    expect(await screen.findByText(/Temporada 2 · Rodadas 5–8/)).toBeInTheDocument();
  });

  it('não oferece "Carregar mais" quando a primeira página do geral veio incompleta', async () => {
    const user = userEvent.setup();
    render(<RankingsScreen />);

    await user.click(await screen.findByRole('tab', { name: 'Geral' }));

    expect(screen.queryByRole('button', { name: 'Carregar mais' })).not.toBeInTheDocument();
  });

  it('carrega a próxima página do ranking geral e some com o botão ao esgotar', async () => {
    const primeiraPagina = Array.from({ length: 50 }, (_, i) =>
      entry(i + 1, `jogador${i + 1}`, 100 - i),
    );
    mocked.getGlobalPage.mockReset();
    mocked.getGlobalPage
      .mockResolvedValueOnce({ data: primeiraPagina } as never)
      .mockResolvedValueOnce({ data: [entry(51, 'ultimo', 10)] } as never);

    const user = userEvent.setup();
    render(<RankingsScreen />);

    await user.click(await screen.findByRole('tab', { name: 'Geral' }));
    await user.click(await screen.findByRole('button', { name: 'Carregar mais' }));

    expect(await screen.findByText(/ultimo/)).toBeInTheDocument();
    expect(mocked.getGlobalPage).toHaveBeenLastCalledWith(1);
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Carregar mais' })).not.toBeInTheDocument(),
    );
  });

  it('sem turma, não há a aba "Minha turma"', async () => {
    render(<RankingsScreen />);
    await screen.findByRole('tab', { name: 'Geral' });
    await waitFor(() => expect(turmasMock).toHaveBeenCalled());
    expect(screen.queryByRole('tab', { name: 'Minha turma' })).not.toBeInTheDocument();
  });

  it('"Minha turma" mostra a rodada e a temporada só da turma escolhida', async () => {
    turmasMock.mockResolvedValue({ data: [turma('t1', '1º ano B'), turma('t2', 'Clube de finanças')] } as never);
    mocked.get.mockImplementation(async (type: string, turmaId?: string) => ({
      data: turmaId
        ? [entry(1, turmaId === 't1' ? 'carla' : 'davi', type === 'quinzenal' ? 15 : 40)]
        : [entry(1, 'bruno', 12), entry(2, 'ana', 8)],
    }) as never);
    const user = userEvent.setup();
    render(<RankingsScreen />);

    await user.click(await screen.findByRole('tab', { name: 'Minha turma' }));

    expect(await screen.findByRole('heading', { name: 'Rodada' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Temporada' })).toBeInTheDocument();
    expect(mocked.get).toHaveBeenCalledWith('quinzenal', 't1');
    expect(mocked.get).toHaveBeenCalledWith('season', 't1');
    expect(screen.getAllByText(/carla/)).toHaveLength(2);

    await user.selectOptions(screen.getByLabelText('Turma'), 't2');
    await waitFor(() => expect(mocked.get).toHaveBeenCalledWith('quinzenal', 't2'));
    expect(await screen.findAllByText(/davi/)).toHaveLength(2);
  });

  it('mostra mensagem de erro quando a carga inicial falha', async () => {
    mocked.get.mockRejectedValue(new Error('falhou'));
    mocked.getGlobalPage.mockRejectedValue(new Error('falhou'));

    render(<RankingsScreen />);

    expect(await screen.findByText('Não foi possível carregar os rankings.')).toBeInTheDocument();
  });
});
