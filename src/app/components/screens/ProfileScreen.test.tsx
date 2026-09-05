import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileScreen } from './ProfileScreen';
import { userService } from '../../services/userService';
import { UserProfile } from '../../types';

vi.mock('../../services/userService', () => ({
  userService: { getProfile: vi.fn() },
}));

const mockedGetProfile = vi.mocked(userService.getProfile);

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

  it('mostra mensagem quando o perfil não carrega', async () => {
    mockedGetProfile.mockRejectedValue(new Error('falhou'));

    render(<ProfileScreen />);

    expect(await screen.findByText('Não foi possível carregar o perfil.')).toBeInTheDocument();
  });
});
