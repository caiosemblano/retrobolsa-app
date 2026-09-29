import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComoFuncionaScreen } from './ComoFuncionaScreen';

describe('ComoFuncionaScreen', () => {
  it('explica pontos, XP, turmas e avisa que os retornos das ações são aproximados', () => {
    render(<ComoFuncionaScreen onBack={vi.fn()} />);

    for (const titulo of ['A rodada', 'Pontos e ranking', 'XP e níveis', 'Missões e treino', 'Turmas', 'De onde vêm os dados']) {
      expect(screen.getByRole('heading', { name: titulo })).toBeInTheDocument();
    }
    expect(screen.getByText(/\+12,4% viram 12 pontos/)).toBeInTheDocument();
    expect(screen.getByText('Os retornos das ações são aproximados.')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Níveis e o XP necessário' })).toHaveTextContent('8. Lenda do Pregão1300 XP');
  });
});
