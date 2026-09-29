import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TarefasDoProfessor } from './TarefasDoProfessor';
import { TarefaDaTurma, teacherService } from '../../services/teacherService';
import { articleService } from '../../services/articleService';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../services/teacherService', () => ({
  teacherService: { assignments: vi.fn(), assign: vi.fn(), unassign: vi.fn() },
}));
vi.mock('../../services/articleService', () => ({ articleService: { getAll: vi.fn() } }));

const tarefa = (overrides: Partial<TarefaDaTurma>): TarefaDaTurma => ({
  id: 'a1',
  articleId: 'bbb1',
  moduleId: 'aaa1',
  articleTitle: 'O que é rentabilidade?',
  dueAt: '2026-10-06T23:59:00',
  createdAt: '2026-09-29T10:00:00',
  done: 1,
  late: 0,
  pending: 1,
  students: [
    { username: 'ana', status: 'FEITA', completedAt: '2026-09-30T10:00:00' },
    { username: 'beto', status: 'PENDENTE', completedAt: null },
  ],
  ...overrides,
});

const aula = (id: string, title: string, moduleId: string, moduleTitle: string) => ({
  id, title, moduleId, moduleTitle, content: null, durationMin: 5, displayOrder: 1, completed: false,
});

describe('TarefasDoProfessor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teacherService.assignments).mockResolvedValue({ data: [tarefa({})] } as never);
    vi.mocked(articleService.getAll).mockResolvedValue({
      data: [aula('bbb1', 'O que é rentabilidade?', 'aaa1', 'Fundamentos'), aula('bbb4', 'O que é P/L?', 'aaa2', 'Análise de ações')],
    } as never);
  });

  it('mostra cada tarefa com as contagens e a situação de cada aluno', async () => {
    const user = userEvent.setup();
    render(<TarefasDoProfessor turmaId="t1" arquivada={false} />);

    const item = await screen.findByText('O que é rentabilidade?', { selector: 'div' });
    const cartao = item.closest('li') as HTMLElement;
    expect(cartao).toHaveTextContent('prazo 06/10 às 23:59');
    expect(cartao).toHaveTextContent('1 feita · 0 atrasadas · 1 pendente');
    await user.click(within(cartao).getByText('Ver cada aluno'));
    const alunos = within(cartao).getAllByRole('listitem');
    expect(alunos[0]).toHaveTextContent('anaFeita');
    expect(alunos[1]).toHaveTextContent('betoPendente');
  });

  it('passa uma aula escolhida por módulo, com o prazo padrão de uma semana', async () => {
    vi.mocked(teacherService.assign).mockResolvedValue({
      data: tarefa({ id: 'a2', articleId: 'bbb4', articleTitle: 'O que é P/L?', done: 0, pending: 2 }),
    } as never);
    const user = userEvent.setup();
    render(<TarefasDoProfessor turmaId="t1" arquivada={false} />);
    await screen.findByRole('option', { name: 'O que é P/L?' });

    expect(screen.getByRole('group', { name: 'Análise de ações' })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Aula'), 'bbb4');
    await user.click(screen.getByRole('button', { name: 'Passar tarefa' }));

    expect(teacherService.assign).toHaveBeenCalledWith('t1', 'bbb4', expect.stringMatching(/^\d{4}-\d{2}-\d{2}T23:59$/));
    expect(await screen.findByText('O que é P/L?', { selector: 'div' })).toBeInTheDocument();
  });

  it('mostra o motivo quando a API recusa e deixa remover uma tarefa', async () => {
    vi.mocked(teacherService.assign).mockRejectedValue({ response: { data: { erro: 'Esta aula já é uma tarefa da turma.' } } });
    vi.mocked(teacherService.unassign).mockResolvedValue({} as never);
    const user = userEvent.setup();
    render(<TarefasDoProfessor turmaId="t1" arquivada={false} />);
    await screen.findByRole('option', { name: 'O que é P/L?' });

    await user.selectOptions(screen.getByLabelText('Aula'), 'bbb1');
    await user.click(screen.getByRole('button', { name: 'Passar tarefa' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Esta aula já é uma tarefa da turma.');

    await user.click(screen.getByRole('button', { name: 'Remover a tarefa O que é rentabilidade?' }));
    expect(teacherService.unassign).toHaveBeenCalledWith('t1', 'a1');
    expect(await screen.findByText('Nenhuma tarefa passada ainda.')).toBeInTheDocument();
  });

  it('turma arquivada não recebe tarefa nova', async () => {
    render(<TarefasDoProfessor turmaId="t1" arquivada />);
    await screen.findByText('O que é rentabilidade?', { selector: 'div' });
    expect(screen.queryByRole('button', { name: 'Passar tarefa' })).not.toBeInTheDocument();
  });
});
