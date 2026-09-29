import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { format, parseISO } from 'date-fns';
import { ChevronRight, ClipboardList } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { classroomService, TarefaPendente } from '../services/classroomService';
import { rotas } from '../routes';

/** Na tela inicial: as aulas que os professores passaram e o aluno ainda não fez. Some se não há nenhuma. */
export function TarefasDaTurma() {
  const [tarefas, setTarefas] = useState<TarefaPendente[]>([]);

  useEffect(() => {
    classroomService
      .assignments()
      .then((response) => setTarefas(response.data))
      .catch(() => undefined);
  }, []);

  if (tarefas.length === 0) return null;

  return (
    <section aria-labelledby="tarefas-titulo">
      <h2 id="tarefas-titulo" className="mb-3 flex items-center gap-2 font-display text-xl">
        <ClipboardList className="size-5 text-info" aria-hidden="true" />
        Tarefas da turma
      </h2>
      <Card className="gap-0 p-2">
        <ul>
          {tarefas.map((tarefa) => (
            <li key={tarefa.id}>
              <Link
                to={rotas.aula(tarefa.moduleId, tarefa.articleId)}
                className="flex min-h-14 items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    {tarefa.articleTitle}
                    {tarefa.late && <Badge variant="loss">Atrasada</Badge>}
                  </div>
                  <div className="tabular text-xs text-muted-foreground">
                    {tarefa.classroomName} · prazo {format(parseISO(tarefa.dueAt), "dd/MM 'às' HH:mm")}
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
