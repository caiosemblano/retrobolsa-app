import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RankingItem } from './RankingItem';

const entry = { rank: 4, username: 'ana', points: 1234, rentability: 12.4 };

describe('RankingItem', () => {
  it('marca apenas o usuário atual com "(Você)"', () => {
    const { rerender } = render(<RankingItem entry={entry} />);
    expect(screen.queryByText(/\(Você\)/)).not.toBeInTheDocument();

    rerender(<RankingItem entry={{ ...entry, isCurrentUser: true }} />);
    expect(screen.getByText(/\(Você\)/)).toBeInTheDocument();
  });

  it('mostra rentabilidade sem repetir a pontuação', () => {
    render(<RankingItem entry={entry} showRentability />);

    expect(screen.getByText(/Rentabilidade: 12.4%/)).toBeInTheDocument();
    expect(screen.queryByText(/pts/)).not.toBeInTheDocument();
  });

  it('mostra pontos formatados quando não exibe rentabilidade', () => {
    render(<RankingItem entry={entry} />);

    expect(screen.getByText('1.234 pts')).toBeInTheDocument();
    expect(screen.queryByText(/Rentabilidade/)).not.toBeInTheDocument();
  });

  it('exibe a posição do jogador', () => {
    render(<RankingItem entry={{ ...entry, rank: 1 }} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/ana/)).toBeInTheDocument();
  });
});
