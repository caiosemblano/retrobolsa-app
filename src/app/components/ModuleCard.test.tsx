import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModuleCard } from './ModuleCard';

const modulo = (icon: string) => ({
  id: 'm', title: 'Módulo', description: 'Descrição', icon, lessonsCount: 3, completedLessons: 1,
});

describe('ModuleCard', () => {
  // A LearnScreen converte o kebab-case do banco ("shield-check") para o nome do componente.
  it.each([
    ['Landmark', 'lucide-landmark'],
    ['ShieldCheck', 'lucide-shield-check'],
    ['Wallet', 'lucide-wallet'],
    ['Brain', 'lucide-brain'],
  ])('mostra o ícone %s dos módulos novos', (icon, classe) => {
    const { container } = render(<ModuleCard module={modulo(icon)} onClick={vi.fn()} />);
    expect(container.querySelector(`svg.${classe}`)).not.toBeNull();
  });

  it('ícone desconhecido cai na calculadora, sem quebrar a tela', () => {
    const { container } = render(<ModuleCard module={modulo('NaoExiste')} onClick={vi.fn()} />);
    expect(container.querySelector('svg.lucide-calculator')).not.toBeNull();
  });
});
