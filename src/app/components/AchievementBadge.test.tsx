import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AchievementBadge } from './AchievementBadge';
import { artRegistry } from './achievements/artRegistry';
import { Achievement } from '../types';

const conquista = (overrides: Partial<Achievement> = {}): Achievement => ({
  code: 'CAMPEAO_RODADA',
  title: 'Campeão da Rodada',
  description: 'Venceu uma rodada disputada com pelo menos 2 jogadores.',
  rarity: 'lendario',
  unlocked: true,
  // Formato real da API: LocalDateTime com 6 casas de fração de segundo.
  unlockedAt: '2026-09-20T14:30:00.123456',
  ...overrides,
});

/** Catálogo do backend: AchievementCodes.java / V9__create_achievements.sql. */
const CODIGOS_DO_BACKEND = [
  'PRIMEIRA_CARTEIRA', 'TUDO_INVESTIDO', 'PRIMEIRA_AULA', 'NO_AZUL',
  'EQUILIBRISTA', 'DIVERSIFICADOR', 'DOIS_DIGITOS', 'VETERANO',
  'PODIO', 'MODULO_COMPLETO', 'CAMPEAO_RODADA', 'FORMADO',
];

const arteDe = (container: HTMLElement) => container.querySelector('svg[data-art]');

describe('AchievementBadge', () => {
  it('desbloqueada: mostra título, raridade, data em pt-BR e a arte colorida da própria conquista', () => {
    const { container } = render(<AchievementBadge achievement={conquista()} />);

    expect(screen.getByText('Campeão da Rodada')).toBeInTheDocument();
    expect(screen.getByText('Lendário')).toBeInTheDocument();
    expect(screen.getByText('Desbloqueada em 20/09/2026')).toBeInTheDocument();
    expect(screen.queryByText('Bloqueada')).not.toBeInTheDocument();
    expect(arteDe(container)).toHaveAttribute('data-art', 'CAMPEAO_RODADA');
    expect(arteDe(container)).toHaveAttribute('data-unlocked', 'true');
  });

  it('bloqueada: mostra "Bloqueada" sem data, e o mesmo desenho vira silhueta', () => {
    const { container } = render(
      <AchievementBadge achievement={conquista({ unlocked: false, unlockedAt: undefined })} />,
    );

    expect(screen.getByText('Bloqueada')).toBeInTheDocument();
    expect(screen.queryByText(/Desbloqueada em/)).not.toBeInTheDocument();
    // Mesmo desenho: o jogador vê o que está buscando.
    expect(arteDe(container)).toHaveAttribute('data-art', 'CAMPEAO_RODADA');
    expect(arteDe(container)).toHaveAttribute('data-unlocked', 'false');
  });

  it('code que o app ainda não conhece cai numa arte genérica sem quebrar o card', () => {
    const { container } = render(<AchievementBadge achievement={conquista({ code: 'CONQUISTA_FUTURA' })} />);

    expect(arteDe(container)).toHaveAttribute('data-art', 'fallback');
    expect(screen.getByText('Campeão da Rodada')).toBeInTheDocument();
  });

  it('raridade que o app ainda não conhece cai em "Comum"', () => {
    render(<AchievementBadge achievement={conquista({ rarity: 'mitico' as Achievement['rarity'] })} />);

    expect(screen.getByText('Comum')).toBeInTheDocument();
  });

  it('cada uma das 12 conquistas do backend tem um desenho próprio', () => {
    expect(Object.keys(artRegistry).sort()).toEqual([...CODIGOS_DO_BACKEND].sort());
    expect(new Set(Object.values(artRegistry)).size).toBe(CODIGOS_DO_BACKEND.length);
  });

  it('emblemas na mesma tela não compartilham o id do gradiente', () => {
    // A moldura usa currentColor: com id repetido, o emblema azul herdaria o gradiente dourado do vizinho.
    const { container } = render(
      <>
        <AchievementBadge achievement={conquista()} />
        <AchievementBadge achievement={conquista({ code: 'EQUILIBRISTA', rarity: 'raro' })} />
      </>,
    );

    const ids = Array.from(container.querySelectorAll('linearGradient')).map((gradient) => gradient.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    ids.forEach((id) => {
      expect(id).not.toContain(':');
      expect(container.querySelector(`path[fill="url(#${id})"]`)).not.toBeNull();
    });
  });
});
