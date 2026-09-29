import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ProfessorScreen } from './ProfessorScreen';
import { ordenarAlunos } from '../professor/TabelaAlunos';
import { AlunoDaTurma, PerguntaErrada, teacherService, TurmaDoProfessor } from '../../services/teacherService';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../services/teacherService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../services/teacherService')>()),
  teacherService: {
    list: vi.fn(),
    create: vi.fn(),
    archive: vi.fn(),
    unarchive: vi.fn(),
    regenerateCode: vi.fn(),
    students: vi.fn(),
    questions: vi.fn(),
    downloadCsv: vi.fn(),
  },
}));

const turma = (overrides: Partial<TurmaDoProfessor> = {}): TurmaDoProfessor => ({
  id: 't1',
  name: '1º ano B',
  institution: 'Escola Estadual',
  joinCode: 'K7Q2MX',
  archived: false,
  memberCount: 2,
  createdAt: '2026-09-01T10:00:00',
  ...overrides,
});

const aluno = (overrides: Partial<AlunoDaTurma>): AlunoDaTurma => ({
  username: 'ana',
  joinedAt: '2026-09-02T10:00:00',
  lessonsCompleted: 3,
  quizzesTaken: 2,
  quizAverage: 83.3,
  roundsPlayed: 1,
  xp: 120,
  level: 3,
  levelTitle: 'Investidor',
  lastActivity: '2026-09-28T19:00:00',
  ...overrides,
});

const pergunta: PerguntaErrada = {
  questionId: 'q1',
  prompt: 'R$ 1.000 aplicados a 10% ao ano, com juros compostos, viram quanto em 2 anos?',
  articleId: 'bbbbbbbb-0002-0000-0000-000000000002',
  moduleId: 'aaaaaaaa-0001-0000-0000-000000000001',
  articleTitle: 'Juros simples vs. compostos',
  answers: 6,
  wrong: 4,
  errorRate: 66.7,
  students: 3,
  commonWrongAnswer: 'R$ 1.200',
};

const renderizar = (caminho: string) =>
  render(
    <MemoryRouter initialEntries={[caminho]}>
      <Routes>
        <Route path="/professor/:turmaId?" element={<ProfessorScreen />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProfessorScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teacherService.list).mockResolvedValue({ data: [turma()] } as never);
    vi.mocked(teacherService.students).mockResolvedValue({
      data: [aluno({}), aluno({ username: 'Beto', xp: 300, level: 5, quizAverage: null, quizzesTaken: 0, lastActivity: null })],
    } as never);
    vi.mocked(teacherService.questions).mockResolvedValue({ data: [pergunta] } as never);
  });

  it('lista as turmas com o código grande e cria uma nova', async () => {
    vi.mocked(teacherService.create).mockResolvedValue({
      data: turma({ id: 't2', name: '2º ano A', joinCode: 'ABC234', memberCount: 0 }),
    } as never);
    const user = userEvent.setup();
    renderizar('/professor');

    expect(await screen.findByText('K7Q2MX')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Nome da turma'), '2º ano A');
    await user.type(screen.getByLabelText('Escola ou instituição (opcional)'), 'Colégio Central');
    await user.click(screen.getByRole('button', { name: 'Criar turma' }));

    expect(teacherService.create).toHaveBeenCalledWith('2º ano A', 'Colégio Central');
    expect(await screen.findByText('ABC234')).toBeInTheDocument();
  });

  it('"Projetar" mostra o código em tela cheia com a instrução para os alunos', async () => {
    const user = userEvent.setup();
    renderizar('/professor');

    await user.click(await screen.findByRole('button', { name: 'Projetar' }));
    const dialogo = await screen.findByRole('dialog');
    expect(dialogo).toHaveTextContent('Perfil → Minhas turmas');
    expect(within(dialogo).getByLabelText('Código K 7 Q 2 M X')).toBeInTheDocument();
  });

  it('o painel da turma mostra os alunos e ordena por coluna', async () => {
    const user = userEvent.setup();
    renderizar('/professor/t1');

    const tabela = await screen.findByRole('table');
    let linhas = within(tabela).getAllByRole('row');
    expect(linhas[1]).toHaveTextContent('ana');
    expect(linhas[1]).toHaveTextContent('83,3% em 2 quizzes');
    expect(linhas[2]).toHaveTextContent('Beto');
    expect(linhas[2]).toHaveTextContent('nenhum');

    await user.click(within(tabela).getByRole('button', { name: /XP e nível/ }));
    linhas = within(tabela).getAllByRole('row');
    expect(linhas[1]).toHaveTextContent('Beto');
    expect(within(tabela).getByRole('columnheader', { name: /XP e nível/ })).toHaveAttribute('aria-sort', 'descending');
  });

  it('as perguntas mais erradas mostram a taxa, a confusão comum e levam à aula', async () => {
    const user = userEvent.setup();
    renderizar('/professor/t1');

    await user.click(await screen.findByRole('tab', { name: 'Perguntas mais erradas' }));
    const item = await screen.findByRole('listitem');
    expect(item).toHaveTextContent('67% de erro');
    expect(item).toHaveTextContent('4 de 6 respostas erradas, de 3 alunos');
    expect(item).toHaveTextContent('Resposta errada mais escolhida: “R$ 1.200”');
    expect(within(item).getByRole('link', { name: 'Aula: Juros simples vs. compostos' })).toHaveAttribute(
      'href',
      '/aprender/aaaaaaaa-0001-0000-0000-000000000001/bbbbbbbb-0002-0000-0000-000000000002',
    );
  });

  it('baixa a planilha e arquiva a turma', async () => {
    vi.mocked(teacherService.archive).mockResolvedValue({ data: turma({ archived: true }) } as never);
    const user = userEvent.setup();
    renderizar('/professor/t1');

    await user.click(await screen.findByRole('button', { name: 'Baixar planilha (CSV)' }));
    expect(teacherService.downloadCsv).toHaveBeenCalledWith('t1', 'turma-1o-ano-b.csv');

    await user.click(screen.getByRole('button', { name: 'Arquivar' }));
    expect(teacherService.archive).toHaveBeenCalledWith('t1');
    expect(await screen.findByText(/ninguém entra com o código/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desarquivar' })).toBeInTheDocument();
  });

  it('turma sem alunos explica como eles entram', async () => {
    vi.mocked(teacherService.students).mockResolvedValue({ data: [] } as never);
    renderizar('/professor/t1');
    expect(await screen.findByText(/Ninguém entrou ainda/)).toBeInTheDocument();
  });
});

describe('ordenarAlunos', () => {
  const alunos = [aluno({ username: 'bia', quizAverage: 50 }), aluno({ username: 'Caio', quizAverage: null }), aluno({ username: 'Ana', quizAverage: 90 })];

  it('quem nunca fez quiz fica no fim nos dois sentidos', () => {
    expect(ordenarAlunos(alunos, 'quizAverage', 'desc').map((a) => a.username)).toEqual(['Ana', 'bia', 'Caio']);
    expect(ordenarAlunos(alunos, 'quizAverage', 'asc').map((a) => a.username)).toEqual(['bia', 'Ana', 'Caio']);
  });

  it('nomes em ordem alfabética sem diferenciar maiúsculas', () => {
    expect(ordenarAlunos(alunos, 'username', 'asc').map((a) => a.username)).toEqual(['Ana', 'bia', 'Caio']);
  });
});
