import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, RotateCcw, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { articleService, QuizQuestion, QuizResult } from '../services/articleService';

interface QuizProps {
  articleId: string;
  /** Chamado depois de cada correção, para a tela atualizar nota e conclusão. */
  onResult: (result: QuizResult) => void;
}

/**
 * Uma pergunta por vez; no fim, a correção comentada de cada uma. A API só devolve o
 * gabarito depois que todas foram respondidas, então ele nunca chega antes da resposta.
 */
export function Quiz({ articleId, onResult }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [sending, setSending] = useState(false);
  const nameId = useId();

  useEffect(() => {
    let active = true;
    setQuestions(null);
    setCurrent(0);
    setAnswers({});
    setResult(null);
    articleService.getQuiz(articleId)
      .then((response) => active && setQuestions(response.data))
      .catch(() => {
        if (!active) return;
        setQuestions([]);
        toast.error('Não foi possível carregar o quiz.');
      });
    return () => {
      active = false;
    };
  }, [articleId]);

  if (!questions) return <Skeleton className="h-64 w-full rounded-2xl" />;
  if (!questions.length) return null;

  const recomecar = () => {
    setAnswers({});
    setCurrent(0);
    setResult(null);
  };

  const enviar = async () => {
    setSending(true);
    try {
      const response = await articleService.submitQuiz(
        articleId,
        questions.map((question) => ({ questionId: question.id, optionId: answers[question.id] })),
      );
      setResult(response.data);
      onResult(response.data);
    } catch {
      toast.error('Não foi possível corrigir o quiz. Tente de novo.');
    } finally {
      setSending(false);
    }
  };

  if (result) {
    return (
      <Card className={`gap-4 p-5 ${result.passed ? 'border-gain/40' : 'border-gold/40'}`}>
        <div aria-live="polite">
          <h2 className="font-display text-lg">
            Você acertou {result.score} de {result.total}
          </h2>
          <p className="text-sm text-muted-foreground">
            {result.passed
              ? 'Aula concluída! Veja a explicação de cada pergunta.'
              : 'Para concluir a aula, acerte pelo menos 2. Leia as explicações, reveja o vídeo se precisar e tente de novo.'}
          </p>
        </div>

        <ol className="space-y-3">
          {questions.map((question, index) => {
            const correction = result.results.find((r) => r.questionId === question.id);
            if (!correction) return null;
            const chosen = question.options.find((o) => o.id === correction.selectedOptionId);
            const right = question.options.find((o) => o.id === correction.correctOptionId);
            return (
              <li key={question.id} className="rounded-xl border border-border bg-muted/70 p-4 text-sm">
                <p className="mb-2 font-semibold">
                  {index + 1}. {question.prompt}
                </p>
                <p className={`flex items-start gap-1.5 ${correction.correct ? 'text-gain' : 'text-loss'}`}>
                  {correction.correct ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {correction.correct ? 'Certo: ' : 'Sua resposta: '}
                    {chosen?.text}
                  </span>
                </p>
                {!correction.correct && (
                  <p className="mt-1 flex items-start gap-1.5 text-gain">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>Resposta certa: {right?.text}</span>
                  </p>
                )}
                <p className="mt-2 text-muted-foreground">{correction.explanation}</p>
              </li>
            );
          })}
        </ol>

        <Button variant="outline" onClick={recomecar}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Tentar de novo
        </Button>
      </Card>
    );
  }

  const question = questions[current];
  const last = current === questions.length - 1;
  const answered = Boolean(answers[question.id]);

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <CircleHelp className="size-5 text-info" aria-hidden="true" />
        <h2 className="font-display text-lg">Teste o que aprendeu</h2>
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">
        Pergunta {current + 1} de {questions.length}. Acerte pelo menos 2 para concluir a aula.
      </p>

      <fieldset className="space-y-2">
        <legend className="mb-3 font-semibold">{question.prompt}</legend>
        {question.options.map((option) => {
          const checked = answers[question.id] === option.id;
          return (
            <label
              key={option.id}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring ${
                checked ? 'border-primary bg-primary/10' : 'border-border hover:border-ring/40'
              }`}
            >
              <input
                type="radio"
                name={`${nameId}-${question.id}`}
                value={option.id}
                checked={checked}
                onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                className="size-4 accent-[var(--primary)]"
              />
              {option.text}
            </label>
          );
        })}
      </fieldset>

      <div className="flex gap-3">
        {current > 0 && (
          <Button variant="ghost" onClick={() => setCurrent((i) => i - 1)}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Anterior
          </Button>
        )}
        {last ? (
          <Button className="flex-1" onClick={enviar} disabled={!answered || sending}>
            {sending ? 'Corrigindo…' : 'Ver resultado'}
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setCurrent((i) => i + 1)} disabled={!answered}>
            Próxima pergunta
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </Card>
  );
}
