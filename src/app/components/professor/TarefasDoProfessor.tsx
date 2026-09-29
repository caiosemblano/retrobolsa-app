import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { ClipboardPlus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { prazoPadrao } from '../admin/NovaRodadaForm';
import { articleService, ArticleDetail } from '../../services/articleService';
import { TarefaDaTurma, teacherService } from '../../services/teacherService';

const situacao: Record<TarefaDaTurma['students'][number]['status'], { rotulo: string; variante: 'gain' | 'loss' | 'secondary' }> = {
  FEITA: { rotulo: 'Feita', variante: 'gain' },
  ATRASADA: { rotulo: 'Atrasada', variante: 'loss' },
  PENDENTE: { rotulo: 'Pendente', variante: 'secondary' },
};

const mensagemDaApi = (error: any, padrao: string) => error?.response?.data?.erro || padrao;
const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

/** No painel da turma: passar uma aula com prazo e acompanhar quem já fez. */
export function TarefasDoProfessor({ turmaId, arquivada }: { turmaId: string; arquivada: boolean }) {
  const [tarefas, setTarefas] = useState<TarefaDaTurma[] | null>(null);
  const [aulas, setAulas] = useState<ArticleDetail[]>([]);
  const [aulaId, setAulaId] = useState('');
  const [prazo, setPrazo] = useState(prazoPadrao());
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    teacherService.assignments(turmaId).then((r) => setTarefas(r.data)).catch(() => setTarefas([]));
    articleService.getAll().then((r) => setAulas(r.data)).catch(() => undefined);
  }, [turmaId]);

  // As aulas agrupadas por módulo, na ordem em que aparecem em "Aprender".
  const modulos = useMemo(() => {
    const grupos = new Map<string, { titulo: string; aulas: ArticleDetail[] }>();
    for (const aula of aulas) {
      const grupo = grupos.get(aula.moduleId) ?? { titulo: aula.moduleTitle, aulas: [] };
      grupo.aulas.push(aula);
      grupos.set(aula.moduleId, grupo);
    }
    return [...grupos.values()];
  }, [aulas]);

  const passar = async (event: FormEvent) => {
    event.preventDefault();
    if (!aulaId) {
      setErro('Escolha a aula.');
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      const { data } = await teacherService.assign(turmaId, aulaId, prazo);
      setTarefas((atuais) => [data, ...(atuais ?? [])]);
      setAulaId('');
      toast.success('Tarefa passada. Os alunos recebem um aviso no app.');
    } catch (error) {
      setErro(mensagemDaApi(error, 'Não foi possível passar a tarefa.'));
    } finally {
      setEnviando(false);
    }
  };

  const remover = async (tarefa: TarefaDaTurma) => {
    try {
      await teacherService.unassign(turmaId, tarefa.id);
      setTarefas((atuais) => (atuais ?? []).filter((t) => t.id !== tarefa.id));
      toast.success('Tarefa removida.');
    } catch (error) {
      toast.error(mensagemDaApi(error, 'Não foi possível remover a tarefa.'));
    }
  };

  return (
    <div className="space-y-4">
      {!arquivada && (
        <Card className="gap-3 p-4">
          <h3 className="font-display text-lg">Passar uma aula</h3>
          <form onSubmit={passar} noValidate className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="tarefa-aula">Aula</Label>
              <select
                id="tarefa-aula"
                value={aulaId}
                onChange={(event) => setAulaId(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Escolha a aula</option>
                {modulos.map((modulo) => (
                  <optgroup key={modulo.titulo} label={modulo.titulo}>
                    {modulo.aulas.map((aula) => (
                      <option key={aula.id} value={aula.id}>
                        {aula.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tarefa-prazo">Prazo</Label>
              <Input id="tarefa-prazo" type="datetime-local" value={prazo} onChange={(event) => setPrazo(event.target.value)} />
            </div>
            <Button type="submit" disabled={enviando}>
              <ClipboardPlus className="size-4" aria-hidden="true" />
              {enviando ? 'Passando...' : 'Passar tarefa'}
            </Button>
          </form>
          {erro && (
            <p role="alert" className="text-sm text-loss">
              {erro}
            </p>
          )}
        </Card>
      )}

      {!tarefas ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : tarefas.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma tarefa passada ainda.</p>
      ) : (
        <ul className="space-y-3">
          {tarefas.map((tarefa) => (
            <li key={tarefa.id} className="space-y-2 rounded-xl border border-border bg-muted/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium">{tarefa.articleTitle}</div>
                  <div className="tabular text-xs text-muted-foreground">
                    prazo {format(parseISO(tarefa.dueAt), "dd/MM 'às' HH:mm")}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => remover(tarefa)} aria-label={`Remover a tarefa ${tarefa.articleTitle}`}>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remover
                </Button>
              </div>
              <p className="tabular text-sm">
                {plural(tarefa.done, 'feita', 'feitas')} · {plural(tarefa.late, 'atrasada', 'atrasadas')} ·{' '}
                {plural(tarefa.pending, 'pendente', 'pendentes')}
              </p>
              {tarefa.students.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-info">Ver cada aluno</summary>
                  <ul className="mt-2 space-y-1">
                    {tarefa.students.map((aluno) => (
                      <li key={aluno.username} className="flex items-center justify-between gap-2">
                        <span>{aluno.username}</span>
                        <Badge variant={situacao[aluno.status].variante}>{situacao[aluno.status].rotulo}</Badge>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
