import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MinhasTurmas } from './MinhasTurmas';
import { classroomService, MinhaTurma } from '../services/classroomService';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../services/classroomService', () => ({
  classroomService: { mine: vi.fn(), join: vi.fn(), leave: vi.fn() },
}));

const turma = (overrides: Partial<MinhaTurma> = {}): MinhaTurma => ({
  id: 't1',
  name: '1º ano B',
  institution: 'Escola Estadual',
  teacherUsername: 'marta',
  memberCount: 24,
  joinedAt: '2026-09-20T10:00:00',
  ...overrides,
});

const renderizar = async (turmas: MinhaTurma[]) => {
  vi.mocked(classroomService.mine).mockResolvedValue({ data: turmas } as never);
  render(<MinhasTurmas />);
  await screen.findByRole('heading', { name: 'Minhas turmas' });
  return userEvent.setup();
};

describe('MinhasTurmas', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lista as turmas com a escola, o professor e quantos alunos têm', async () => {
    await renderizar([turma()]);
    const item = await screen.findByRole('listitem');
    expect(item).toHaveTextContent('1º ano B');
    expect(item).toHaveTextContent('Escola Estadual · professor(a) marta · 24 alunos');
  });

  it('entra com o código digitado e mostra a turma nova', async () => {
    vi.mocked(classroomService.join).mockResolvedValue({ data: turma({ name: '2º ano A', id: 't2' }) } as never);
    const user = await renderizar([]);
    expect(await screen.findByText(/ainda não está em nenhuma turma/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Entrar com código'), 'k7q2mx');
    expect(screen.getByLabelText('Entrar com código')).toHaveValue('K7Q2MX');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(classroomService.join).toHaveBeenCalledWith('K7Q2MX');
    expect(await screen.findByText('2º ano A')).toBeInTheDocument();
  });

  it('mostra o motivo quando o código não vale', async () => {
    vi.mocked(classroomService.join).mockRejectedValue({
      response: { data: { erro: 'Código de turma inválido. Confira com o professor.' } },
    });
    const user = await renderizar([]);
    await user.type(screen.getByLabelText('Entrar com código'), 'ZZZZZZ');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Código de turma inválido');
  });

  it('sair pede confirmação e tira a turma da lista', async () => {
    vi.mocked(classroomService.leave).mockResolvedValue({} as never);
    const user = await renderizar([turma()]);

    await user.click(await screen.findByRole('button', { name: 'Sair da turma 1º ano B' }));
    const dialogo = await screen.findByRole('alertdialog');
    expect(dialogo).toHaveTextContent('o professor deixa de ver o seu progresso');
    await user.click(within(dialogo).getByRole('button', { name: 'Sair da turma' }));

    expect(classroomService.leave).toHaveBeenCalledWith('t1');
    expect(await screen.findByText(/ainda não está em nenhuma turma/)).toBeInTheDocument();
  });
});
