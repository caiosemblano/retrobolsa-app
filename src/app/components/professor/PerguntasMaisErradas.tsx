import { Link } from 'react-router';
import { PerguntaErrada } from '../../services/teacherService';
import { formatarNumero } from '../../utils/numero';
import { rotas } from '../../routes';

/** As perguntas que a turma mais erra, com a confusão mais comum: um roteiro para a próxima aula. */
export function PerguntasMaisErradas({ perguntas }: { perguntas: PerguntaErrada[] }) {
  if (!perguntas.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Ainda não há erros para mostrar: ou a turma acertou tudo, ou ninguém fez os quizzes ainda.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {perguntas.map((pergunta) => (
        <li key={pergunta.questionId} className="space-y-2 rounded-xl border border-border bg-muted/70 p-4">
          <p className="font-medium">{pergunta.prompt}</p>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-background" aria-hidden="true">
              <div className="h-full rounded-full bg-loss" style={{ width: `${Math.min(100, pergunta.errorRate)}%` }} />
            </div>
            <span className="tabular shrink-0 text-sm font-semibold text-loss">
              {formatarNumero(pergunta.errorRate, 0)}% de erro
            </span>
          </div>
          <p className="tabular text-xs text-muted-foreground">
            {pergunta.wrong} de {pergunta.answers} respostas erradas, de {pergunta.students}{' '}
            {pergunta.students === 1 ? 'aluno' : 'alunos'}
          </p>
          {pergunta.commonWrongAnswer && (
            <p className="text-sm">
              Resposta errada mais escolhida: <span className="font-semibold">“{pergunta.commonWrongAnswer}”</span>
            </p>
          )}
          <Link
            to={rotas.aula(pergunta.moduleId, pergunta.articleId)}
            className="inline-block text-sm font-medium text-info underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Aula: {pergunta.articleTitle}
          </Link>
        </li>
      ))}
    </ol>
  );
}
