import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { MissoesDaSemana } from './MissoesDaSemana';
import { TarefasDaTurma } from './TarefasDaTurma';
import { missionService } from '../services/missionService';
import { classroomService } from '../services/classroomService';

vi.mock('../services/missionService', () => ({ missionService: { week: vi.fn() } }));
vi.mock('../services/classroomService', () => ({ classroomService: { assignments: vi.fn() } }));

describe('MissoesDaSemana', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra cada missão com a barra de progresso e quantas já foram cumpridas', async () => {
    vi.mocked(missionService.week).mockResolvedValue({
      data: {
        week: '2026-W40',
        endsAt: '2026-10-04T23:59:59',
        missions: [
          { code: 'AULAS_2', title: 'Conclua 2 aulas', description: 'Duas aulas diferentes contam.', target: 2, progress: 1, completed: false, xp: 30 },
          { code: 'TREINO', title: 'Faça um treino', description: 'Remonte uma rodada.', target: 1, progress: 1, completed: true, xp: 20 },
          { code: 'DOIS_DIAS', title: 'Volte em 2 dias', description: 'Dois dias diferentes.', target: 2, progress: 0, completed: false, xp: 20 },
        ],
      },
    } as never);
    render(<MissoesDaSemana />);

    expect(await screen.findByRole('heading', { name: 'Missões da semana' })).toBeInTheDocument();
    expect(screen.getByText('1 de 3 cumpridas · novas na segunda-feira')).toBeInTheDocument();
    const aulas = screen.getByRole('progressbar', { name: 'Conclua 2 aulas' });
    expect(aulas).toHaveAttribute('aria-valuenow', '1');
    expect(aulas).toHaveAttribute('aria-valuetext', '1 de 2');
    expect(screen.getByRole('progressbar', { name: 'Faça um treino' })).toHaveAttribute('aria-valuetext', 'Cumprida');
    expect(screen.getByText('Cumprida!')).toBeInTheDocument();
    expect(screen.getByText('+30 XP')).toBeInTheDocument();
  });

  it('se a API falhar, o card não aparece', async () => {
    vi.mocked(missionService.week).mockRejectedValue(new Error('falhou'));
    const { container } = render(<MissoesDaSemana />);
    await waitFor(() => expect(missionService.week).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});

describe('TarefasDaTurma', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lista as tarefas pendentes com o prazo e leva à aula; a atrasada é marcada', async () => {
    vi.mocked(classroomService.assignments).mockResolvedValue({
      data: [
        { id: 'a1', classroomName: '1º ano B', articleId: 'bbb1', moduleId: 'aaa1', articleTitle: 'O que é P/L?', dueAt: '2026-10-01T18:00:00', late: true },
        { id: 'a2', classroomName: '1º ano B', articleId: 'bbb2', moduleId: 'aaa1', articleTitle: 'O que é ROE?', dueAt: '2026-10-08T23:59:00', late: false },
      ],
    } as never);
    render(
      <MemoryRouter>
        <TarefasDaTurma />
      </MemoryRouter>,
    );

    const links = await screen.findAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/aprender/aaa1/bbb1');
    expect(links[0]).toHaveTextContent('O que é P/L?Atrasada');
    expect(links[0]).toHaveTextContent('1º ano B · prazo 01/10 às 18:00');
    expect(links[1]).not.toHaveTextContent('Atrasada');
  });

  it('sem tarefas, o card não aparece', async () => {
    vi.mocked(classroomService.assignments).mockResolvedValue({ data: [] } as never);
    const { container } = render(
      <MemoryRouter>
        <TarefasDaTurma />
      </MemoryRouter>,
    );
    await waitFor(() => expect(classroomService.assignments).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
