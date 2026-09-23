import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileScreen } from './ProfileScreen';
import { userService } from '../../services/userService';
import { Achievement, UserProfile } from '../../types';

vi.mock('../../services/userService', () => ({
  userService: { getProfile: vi.fn() },
}));

const mockedGetProfile = vi.mocked(userService.getProfile);

const conquista = (overrides: Partial<Achievement> = {}): Achievement => ({
  code: 'CAMPEAO_RODADA',
  title: 'Campeão da Rodada',
  description: 'Venceu uma rodada disputada com pelo menos 2 jogadores.',
  rarity: 'lendario',
  unlocked: true,
  unlockedAt: '2026-09-20T14:30:00',
  ...overrides,
});

const perfil = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  username: 'ana',
  email: 'ana@retrobolsa.com',
  avatar: '',
  totalPoints: 1234,
  bestRank: 1,
  favoriteAsset: '',
  achievements: [],
  completedCompetitions: 2,
  history: [
    {
      roundNumber: 2,
      scenarioTitle: 'Crise de 2008',
      totalReturn: 26,
      finalValue: 126000,
      rank: 1,
      submittedAt: '2026-01-02T10:00:00',
    },
  ],
  ...overrides,
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra pontuação, melhor posição e competições do usuário', async () => {
    mockedGetProfile.mockResolvedValue({ data: perfil() } as never);

    render(<ProfileScreen />);

    expect(await screen.findByText('ana')).toBeInTheDocument();
    expect(screen.getByText('1.234 pontos')).toBeInTheDocument();
    expect(screen.getByText('1º lugar')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('mostra o histórico de rodadas com retorno e patrimônio', async () => {
    mockedGetProfile.mockResolvedValue({ data: perfil() } as never);

    render(<ProfileScreen />);

    expect(await screen.findByText('Rodada 2')).toBeInTheDocument();
    expect(screen.getByText('Crise de 2008')).toBeInTheDocument();
    expect(screen.getByText('26.00%')).toBeInTheDocument();
    expect(screen.getByText('R$ 126.000')).toBeInTheDocument();
  });

  it('mostra estado vazio para quem nunca completou uma rodada', async () => {
    mockedGetProfile.mockResolvedValue({
      data: perfil({ history: [], bestRank: 0, completedCompetitions: 0, totalPoints: 0 }),
    } as never);

    render(<ProfileScreen />);

    expect(
      await screen.findByText('Você ainda não completou nenhuma rodada de competição.'),
    ).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('mostra a data do histórico em pt-BR mesmo com a fração de segundo da API', async () => {
    mockedGetProfile.mockResolvedValue({
      data: perfil({
        history: [{ ...perfil().history![0], submittedAt: '2026-01-02T10:00:00.654321' }],
      }),
    } as never);

    render(<ProfileScreen />);

    expect(await screen.findByText('02/01/2026')).toBeInTheDocument();
  });

  it('mostra as conquistas com o contador de desbloqueadas', async () => {
    mockedGetProfile.mockResolvedValue({
      data: perfil({
        achievements: [
          conquista({ code: 'NO_AZUL', title: 'No Azul', rarity: 'comum' }),
          conquista({ code: 'FORMADO', title: 'Formado', unlocked: false, unlockedAt: undefined }),
          conquista(),
        ],
      }),
    } as never);

    render(<ProfileScreen />);

    expect(await screen.findByText('2 de 3 desbloqueadas')).toBeInTheDocument();
    expect(screen.getByText('No Azul')).toBeInTheDocument();
    expect(screen.getByText('Formado')).toBeInTheDocument();
    expect(screen.getByText('Campeão da Rodada')).toBeInTheDocument();
    expect(screen.getAllByText('Bloqueada')).toHaveLength(1);
    expect(screen.getAllByText('Desbloqueada em 20/09/2026')).toHaveLength(2);
    expect(screen.queryByText(/ainda não são fornecidos pela API/)).not.toBeInTheDocument();
  });

  it('sem catálogo de conquistas mostra aviso e nenhum contador', async () => {
    mockedGetProfile.mockResolvedValue({ data: perfil({ achievements: [] }) } as never);

    render(<ProfileScreen />);

    expect(await screen.findByText('Nenhuma conquista disponível no momento.')).toBeInTheDocument();
    expect(screen.queryByText(/desbloqueadas/)).not.toBeInTheDocument();
  });

  it('mostra mensagem quando o perfil não carrega', async () => {
    mockedGetProfile.mockRejectedValue(new Error('falhou'));

    render(<ProfileScreen />);

    expect(await screen.findByText('Não foi possível carregar o perfil.')).toBeInTheDocument();
  });
});
