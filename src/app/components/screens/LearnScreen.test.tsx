import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { LearnScreen } from './LearnScreen';
import { articleService, ArticleDetail } from '../../services/articleService';

vi.mock('../../services/articleService', () => ({
  articleService: { getAll: vi.fn(), complete: vi.fn() },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const mockedGetAll = vi.mocked(articleService.getAll);
const mockedComplete = vi.mocked(articleService.complete);

const aula = (overrides: Partial<ArticleDetail> = {}): ArticleDetail => ({
  id: 'a1',
  moduleId: 'm1',
  moduleTitle: 'Matemática Financeira',
  moduleDescription: 'Aprenda os fundamentos de juros, rentabilidade e valor do dinheiro no tempo.',
  moduleIcon: 'calculator',
  title: 'O que é rentabilidade?',
  content: 'Rentabilidade é quanto um investimento rendeu em relação ao valor aplicado.',
  durationMin: 5,
  displayOrder: 1,
  videoId: 'Y9ng5fVji-A',
  completed: false,
  ...overrides,
});

const catalogo = (): ArticleDetail[] => [
  aula(),
  aula({
    id: 'a2',
    title: 'Juros simples vs. compostos',
    content: 'Nos compostos, os juros passam a render juros.',
    displayOrder: 2,
    videoId: 'G6LJcuKY80c',
  }),
  aula({
    id: 'a3',
    moduleId: 'm2',
    moduleTitle: 'Macroeconomia',
    moduleDescription: 'Explore como Selic, inflação, câmbio e PIB afetam seus investimentos.',
    moduleIcon: 'globe',
    title: 'O que é a Taxa Selic?',
    videoId: 'WBNkhIaY7gc',
    completed: true,
  }),
];

const renderizar = async (aulas = catalogo()) => {
  mockedGetAll.mockResolvedValue({ data: aulas } as never);
  const user = userEvent.setup();
  render(<LearnScreen />);
  await screen.findByText('Matemática Financeira');
  return user;
};

const abrirAula = async (user: ReturnType<typeof userEvent.setup>, modulo: RegExp, titulo: RegExp) => {
  await user.click(screen.getByRole('button', { name: modulo }));
  await user.click(screen.getByRole('button', { name: titulo }));
};

describe('LearnScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista os módulos com a descrição real da API e o progresso de cada um', async () => {
    await renderizar();

    expect(screen.getByText(/Aprenda os fundamentos de juros/)).toBeInTheDocument();
    expect(screen.getByText(/Explore como Selic/)).toBeInTheDocument();
    expect(screen.getByText('0 de 2 aulas')).toBeInTheDocument();
    expect(screen.getByText('1 de 1 aulas')).toBeInTheDocument();
    // A descrição genérica que o front inventava para todos os módulos não aparece mais.
    expect(screen.queryByText('Conteúdos financeiros para suas competições.')).not.toBeInTheDocument();
  });

  it('abre a aula com o vídeo do YouTube embutido e o resumo', async () => {
    const user = await renderizar();

    await abrirAula(user, /Matemática Financeira/, /O que é rentabilidade/);

    const player = screen.getByTitle('Vídeo da aula: O que é rentabilidade?');
    expect(player.tagName).toBe('IFRAME');
    expect(player).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/Y9ng5fVji-A?rel=0');
    expect(player).toHaveAttribute('allowfullscreen');
    expect(screen.getByText('Aula 1 de 2')).toBeInTheDocument();
    expect(screen.getByText(/rendeu em relação ao valor aplicado/)).toBeInTheDocument();
    // Abrir a aula não conclui nada sozinho: antes, o clique no card já marcava como concluída.
    expect(mockedComplete).not.toHaveBeenCalled();
  });

  it('marcar como concluída salva na API e só então marca a aula e o progresso do módulo', async () => {
    mockedComplete.mockResolvedValue({} as never);
    const user = await renderizar();
    await abrirAula(user, /Matemática Financeira/, /O que é rentabilidade/);

    await user.click(screen.getByRole('button', { name: 'Marcar como concluída' }));

    expect(mockedComplete).toHaveBeenCalledWith('a1');
    expect(await screen.findByRole('button', { name: /Aula concluída/ })).toBeDisabled();
    expect(toast.success).toHaveBeenCalledWith('Aula concluída!');

    await user.click(screen.getByRole('button', { name: /Voltar para Matemática Financeira/ }));
    await user.click(screen.getByRole('button', { name: /Voltar para módulos/ }));
    expect(screen.getByText('1 de 2 aulas')).toBeInTheDocument();
  });

  it('se a API falhar, a aula continua pendente e o erro aparece', async () => {
    mockedComplete.mockRejectedValue(new Error('rede caiu'));
    const user = await renderizar();
    await abrirAula(user, /Matemática Financeira/, /O que é rentabilidade/);

    await user.click(screen.getByRole('button', { name: 'Marcar como concluída' }));

    expect(toast.error).toHaveBeenCalledWith('Não foi possível salvar a conclusão. Tente de novo.');
    expect(screen.getByRole('button', { name: 'Marcar como concluída' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: /Aula concluída/ })).not.toBeInTheDocument();
  });

  it('"Próxima aula" leva à aula seguinte do módulo e some na última', async () => {
    const user = await renderizar();
    await abrirAula(user, /Matemática Financeira/, /O que é rentabilidade/);

    await user.click(screen.getByRole('button', { name: /Próxima aula/ }));

    expect(screen.getByRole('heading', { name: 'Juros simples vs. compostos' })).toBeInTheDocument();
    expect(screen.getByText('Aula 2 de 2')).toBeInTheDocument();
    expect(screen.getByTitle('Vídeo da aula: Juros simples vs. compostos'))
      .toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/G6LJcuKY80c?rel=0');
    expect(screen.queryByRole('button', { name: /Próxima aula/ })).not.toBeInTheDocument();
  });

  it('aula já concluída abre para revisão, sem botão de concluir', async () => {
    const user = await renderizar();

    await abrirAula(user, /Macroeconomia/, /O que é a Taxa Selic/);

    expect(screen.getByRole('button', { name: /Aula concluída/ })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Marcar como concluída' })).not.toBeInTheDocument();
  });

  it('aula sem vídeo mostra um aviso no lugar do player', async () => {
    const user = await renderizar([aula({ videoId: null })]);

    await abrirAula(user, /Matemática Financeira/, /O que é rentabilidade/);

    expect(screen.getByText('Esta aula ainda não tem vídeo.')).toBeInTheDocument();
    expect(screen.queryByTitle(/Vídeo da aula/)).not.toBeInTheDocument();
  });

  it('avisa quando as aulas não carregam', async () => {
    mockedGetAll.mockRejectedValue(new Error('falhou'));

    render(<LearnScreen />);

    expect(await screen.findByText('Nenhuma aula disponível.')).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Não foi possível carregar as aulas.');
  });
});
