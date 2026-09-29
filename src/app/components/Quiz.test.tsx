import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { Quiz } from './Quiz';
import { articleService, QuizQuestion, QuizResult } from '../services/articleService';

vi.mock('../services/articleService', () => ({
  articleService: { getQuiz: vi.fn(), submitQuiz: vi.fn() },
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const perguntas: QuizQuestion[] = [
  {
    id: 'p1',
    prompt: 'R$ 1.000 a 10% ao ano, com juros compostos, viram quanto em 2 anos?',
    options: [
      { id: 'p1a', text: 'R$ 1.200' },
      { id: 'p1b', text: 'R$ 1.210' },
    ],
  },
  {
    id: 'p2',
    prompt: 'Ganhou 50% e depois perdeu 50%. Como terminou?',
    options: [
      { id: 'p2a', text: 'Igual ao começo' },
      { id: 'p2b', text: 'Com 25% a menos' },
    ],
  },
];

const correcao = (acertouA2: boolean): QuizResult => ({
  score: acertouA2 ? 2 : 1,
  total: 2,
  passed: acertouA2,
  results: [
    { questionId: 'p1', selectedOptionId: 'p1b', correctOptionId: 'p1b', correct: true, explanation: 'Os juros rendem juros: 1.100 e depois 1.210.' },
    {
      questionId: 'p2',
      selectedOptionId: acertouA2 ? 'p2b' : 'p2a',
      correctOptionId: 'p2b',
      correct: acertouA2,
      explanation: 'Os retornos se multiplicam: 1,5 × 0,5 = 0,75.',
    },
  ],
});

const renderizar = async () => {
  vi.mocked(articleService.getQuiz).mockResolvedValue({ data: perguntas } as never);
  const onResult = vi.fn();
  const user = userEvent.setup();
  render(<Quiz articleId="a2" onResult={onResult} />);
  await screen.findByRole('heading', { name: 'Teste o que aprendeu' });
  return { user, onResult };
};

describe('Quiz', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uma pergunta por vez: só avança depois de escolher', async () => {
    const { user } = await renderizar();

    expect(screen.getByText(/Pergunta 1 de 2/)).toBeInTheDocument();
    const proxima = screen.getByRole('button', { name: 'Próxima pergunta' });
    expect(proxima).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: 'R$ 1.210' }));
    await user.click(proxima);

    expect(screen.getByText(/Pergunta 2 de 2/)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Ganhou 50%/ })).toBeInTheDocument();
    // Voltar mantém a resposta dada.
    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(screen.getByRole('radio', { name: 'R$ 1.210' })).toBeChecked();
  });

  it('envia todas as respostas e mostra a correção comentada', async () => {
    vi.mocked(articleService.submitQuiz).mockResolvedValue({ data: correcao(false) } as never);
    const { user, onResult } = await renderizar();

    await user.click(screen.getByRole('radio', { name: 'R$ 1.210' }));
    await user.click(screen.getByRole('button', { name: 'Próxima pergunta' }));
    await user.click(screen.getByRole('radio', { name: 'Igual ao começo' }));
    await user.click(screen.getByRole('button', { name: 'Ver resultado' }));

    expect(articleService.submitQuiz).toHaveBeenCalledWith('a2', [
      { questionId: 'p1', optionId: 'p1b' },
      { questionId: 'p2', optionId: 'p2a' },
    ]);
    expect(onResult).toHaveBeenCalledWith(correcao(false));
    expect(screen.getByRole('heading', { name: 'Você acertou 1 de 2' })).toBeInTheDocument();
    expect(screen.getByText(/acerte pelo menos 2/)).toBeInTheDocument();

    const [primeira, segunda] = screen.getAllByRole('listitem');
    expect(primeira).toHaveTextContent('Certo: R$ 1.210');
    expect(primeira).toHaveTextContent('Os juros rendem juros');
    expect(segunda).toHaveTextContent('Sua resposta: Igual ao começo');
    expect(segunda).toHaveTextContent('Resposta certa: Com 25% a menos');
    expect(segunda).toHaveTextContent('1,5 × 0,5 = 0,75');
  });

  it('passando, avisa que a aula foi concluída; "tentar de novo" recomeça', async () => {
    vi.mocked(articleService.submitQuiz).mockResolvedValue({ data: correcao(true) } as never);
    const { user } = await renderizar();

    await user.click(screen.getByRole('radio', { name: 'R$ 1.210' }));
    await user.click(screen.getByRole('button', { name: 'Próxima pergunta' }));
    await user.click(screen.getByRole('radio', { name: 'Com 25% a menos' }));
    await user.click(screen.getByRole('button', { name: 'Ver resultado' }));

    expect(screen.getByText(/Aula concluída!/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(screen.getByText(/Pergunta 1 de 2/)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'R$ 1.210' })).not.toBeChecked();
  });

  it('se a correção falhar, as respostas ficam e dá para enviar de novo', async () => {
    vi.mocked(articleService.submitQuiz).mockRejectedValue(new Error('rede'));
    const { user, onResult } = await renderizar();

    await user.click(screen.getByRole('radio', { name: 'R$ 1.210' }));
    await user.click(screen.getByRole('button', { name: 'Próxima pergunta' }));
    await user.click(screen.getByRole('radio', { name: 'Com 25% a menos' }));
    await user.click(screen.getByRole('button', { name: 'Ver resultado' }));

    expect(toast.error).toHaveBeenCalledWith('Não foi possível corrigir o quiz. Tente de novo.');
    expect(onResult).not.toHaveBeenCalled();
    expect(within(screen.getByRole('group')).getByRole('radio', { name: 'Com 25% a menos' })).toBeChecked();
    expect(screen.getByRole('button', { name: 'Ver resultado' })).toBeEnabled();
  });

  it('aula sem perguntas não mostra nada', async () => {
    vi.mocked(articleService.getQuiz).mockResolvedValue({ data: [] } as never);
    const { container } = render(<Quiz articleId="a9" onResult={vi.fn()} />);
    await vi.waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
