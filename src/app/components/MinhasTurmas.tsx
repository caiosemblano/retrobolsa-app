import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { AlertCircle, LogOut, School } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { classroomService, MinhaTurma } from '../services/classroomService';

const mensagemDaApi = (error: any, padrao: string) => error?.response?.data?.erro || padrao;

/** No perfil: as turmas do aluno, a entrada com o código que o professor passou e a saída. */
export function MinhasTurmas() {
  const [turmas, setTurmas] = useState<MinhaTurma[] | null>(null);
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);
  const [saindoDe, setSaindoDe] = useState<MinhaTurma | null>(null);

  useEffect(() => {
    classroomService
      .mine()
      .then((response) => setTurmas(response.data))
      .catch(() => setTurmas([]));
  }, []);

  const entrar = async (event: FormEvent) => {
    event.preventDefault();
    if (!codigo.trim()) {
      setErro('Digite o código que o professor passou.');
      return;
    }
    setEntrando(true);
    setErro(null);
    try {
      const { data } = await classroomService.join(codigo);
      setTurmas((atuais) => [...(atuais ?? []).filter((t) => t.id !== data.id), data]);
      setCodigo('');
      toast.success(`Você entrou na turma ${data.name}.`);
    } catch (error) {
      setErro(mensagemDaApi(error, 'Não foi possível entrar na turma.'));
    } finally {
      setEntrando(false);
    }
  };

  const sair = async () => {
    if (!saindoDe) return;
    const turma = saindoDe;
    setSaindoDe(null);
    try {
      await classroomService.leave(turma.id);
      setTurmas((atuais) => (atuais ?? []).filter((t) => t.id !== turma.id));
      toast.success(`Você saiu da turma ${turma.name}.`);
    } catch (error) {
      toast.error(mensagemDaApi(error, 'Não foi possível sair da turma.'));
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <School className="size-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="font-display text-xl">Minhas turmas</h2>
      </div>

      <Card className="gap-4 p-5">
        <form onSubmit={entrar} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="codigo-turma">Entrar com código</Label>
            <Input
              id="codigo-turma"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value.toUpperCase())}
              placeholder="Ex.: K7Q2MX"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={9}
              className="tabular font-display tracking-[0.2em]"
              aria-describedby={erro ? 'codigo-turma-erro' : undefined}
            />
          </div>
          <Button type="submit" disabled={entrando}>
            {entrando ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        {erro && (
          <p id="codigo-turma-erro" role="alert" className="flex items-center gap-2 text-sm text-loss">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {erro}
          </p>
        )}

        {!turmas ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : turmas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Você ainda não está em nenhuma turma. Se o seu professor usa o RetroBolsa, peça o código a ele.
          </p>
        ) : (
          <ul className="space-y-2">
            {turmas.map((turma) => (
              <li
                key={turma.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/70 p-3.5"
              >
                <div className="min-w-0">
                  <div className="font-display font-semibold">{turma.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {[turma.institution, `professor(a) ${turma.teacherUsername}`,
                      `${turma.memberCount} ${turma.memberCount === 1 ? 'aluno' : 'alunos'}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSaindoDe(turma)} aria-label={`Sair da turma ${turma.name}`}>
                  <LogOut className="size-4" aria-hidden="true" />
                  Sair
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AlertDialog open={!!saindoDe} onOpenChange={(aberto) => !aberto && setSaindoDe(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da turma {saindoDe?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Você deixa de aparecer no ranking da turma e o professor deixa de ver o seu progresso. Dá para voltar
              depois com o código.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ficar</AlertDialogCancel>
            <AlertDialogAction onClick={sair}>Sair da turma</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
