import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Archive, ArchiveRestore, ArrowLeft, ChevronRight, Download, Plus, Presentation, RefreshCw, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CodigoDaTurma } from '../professor/CodigoDaTurma';
import { TabelaAlunos } from '../professor/TabelaAlunos';
import { PerguntasMaisErradas } from '../professor/PerguntasMaisErradas';
import { AlunoDaTurma, nomeDoCsv, PerguntaErrada, teacherService, TurmaDoProfessor } from '../../services/teacherService';
import { rotas } from '../../routes';

const mensagemDaApi = (error: any, padrao: string) => error?.response?.data?.erro || padrao;

/** Área do professor: as turmas (lista) e, com uma escolhida, o painel dela. */
export function ProfessorScreen() {
  const { turmaId } = useParams();
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<TurmaDoProfessor[] | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    teacherService
      .list()
      .then((response) => setTurmas(response.data))
      .catch(() => setErro(true));
  }, []);

  const atualizar = (turma: TurmaDoProfessor) =>
    setTurmas((atuais) => (atuais ?? []).map((t) => (t.id === turma.id ? turma : t)));

  if (erro) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-muted-foreground">Não foi possível carregar as turmas.</div>
    );
  }

  if (!turmas) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 p-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (turmaId) {
    const turma = turmas.find((t) => t.id === turmaId);
    if (!turma) {
      return (
        <div className="mx-auto max-w-4xl space-y-4 p-4">
          <Button variant="ghost" onClick={() => navigate(rotas.professor)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Minhas turmas
          </Button>
          <p className="text-muted-foreground">Turma não encontrada.</p>
        </div>
      );
    }
    return <PainelDaTurma key={turma.id} turma={turma} onAtualizada={atualizar} onVoltar={() => navigate(rotas.professor)} />;
  }

  return (
    <ListaDeTurmas
      turmas={turmas}
      onCriada={(turma) => setTurmas((atuais) => [turma, ...(atuais ?? [])])}
      onAbrir={(id) => navigate(rotas.turma(id))}
    />
  );
}

function ListaDeTurmas({
  turmas,
  onCriada,
  onAbrir,
}: {
  turmas: TurmaDoProfessor[];
  onCriada: (turma: TurmaDoProfessor) => void;
  onAbrir: (id: string) => void;
}) {
  const [nome, setNome] = useState('');
  const [escola, setEscola] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const ativas = turmas.filter((t) => !t.archived);
  const arquivadas = turmas.filter((t) => t.archived);

  const criar = async (event: FormEvent) => {
    event.preventDefault();
    if (!nome.trim()) {
      setErro('Dê um nome à turma.');
      return;
    }
    setCriando(true);
    setErro(null);
    try {
      const { data } = await teacherService.create(nome.trim(), escola.trim());
      onCriada(data);
      setNome('');
      setEscola('');
      toast.success(`Turma criada. O código para os alunos entrarem é ${data.joinCode}.`);
    } catch (error) {
      setErro(mensagemDaApi(error, 'Não foi possível criar a turma.'));
    } finally {
      setCriando(false);
    }
  };

  const cartao = (turma: TurmaDoProfessor) => (
    <li key={turma.id}>
      <Card className={`gap-4 p-5 ${turma.archived ? 'opacity-70' : ''}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg">{turma.name}</h3>
            <p className="text-sm text-muted-foreground">
              {[turma.institution, `${turma.memberCount} ${turma.memberCount === 1 ? 'aluno' : 'alunos'}`,
                turma.archived ? 'arquivada' : null]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onAbrir(turma.id)} aria-label={`Abrir a turma ${turma.name}`}>
            Abrir
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {!turma.archived && <CodigoDaTurma codigo={turma.joinCode} nomeDaTurma={turma.name} />}
      </Card>
    </li>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-info/25 bg-info-soft text-info"
        >
          <Presentation className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-tight">Área do professor</h1>
          <p className="text-sm text-muted-foreground">Crie turmas e acompanhe como os alunos estão indo.</p>
        </div>
      </div>

      <Card className="gap-4 p-5">
        <h2 className="font-display text-lg">Nova turma</h2>
        <form onSubmit={criar} noValidate className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="turma-nome">Nome da turma</Label>
            <Input id="turma-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: 1º ano B" maxLength={80} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turma-escola">Escola ou instituição (opcional)</Label>
            <Input id="turma-escola" value={escola} onChange={(e) => setEscola(e.target.value)} maxLength={120} />
          </div>
          <Button type="submit" disabled={criando}>
            <Plus className="size-4" aria-hidden="true" />
            {criando ? 'Criando...' : 'Criar turma'}
          </Button>
        </form>
        {erro && (
          <p role="alert" className="text-sm text-loss">
            {erro}
          </p>
        )}
      </Card>

      <section>
        <h2 className="mb-3 font-display text-xl">Minhas turmas</h2>
        {ativas.length ? (
          <ul className="space-y-3">{ativas.map(cartao)}</ul>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma turma ativa. Crie a primeira acima.</p>
          </Card>
        )}
      </section>

      {arquivadas.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg text-muted-foreground">Arquivadas</h2>
          <ul className="space-y-3">{arquivadas.map(cartao)}</ul>
        </section>
      )}
    </div>
  );
}

function PainelDaTurma({
  turma,
  onAtualizada,
  onVoltar,
}: {
  turma: TurmaDoProfessor;
  onAtualizada: (turma: TurmaDoProfessor) => void;
  onVoltar: () => void;
}) {
  const [alunos, setAlunos] = useState<AlunoDaTurma[] | null>(null);
  const [perguntas, setPerguntas] = useState<PerguntaErrada[] | null>(null);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    teacherService.students(turma.id).then((r) => setAlunos(r.data)).catch(() => setAlunos([]));
    teacherService.questions(turma.id).then((r) => setPerguntas(r.data)).catch(() => setPerguntas([]));
  }, [turma.id]);

  const agir = async (acao: () => Promise<{ data: TurmaDoProfessor }>, sucesso: string) => {
    setOcupado(true);
    try {
      const { data } = await acao();
      onAtualizada(data);
      toast.success(sucesso);
    } catch (error) {
      toast.error(mensagemDaApi(error, 'Não foi possível concluir a ação.'));
    } finally {
      setOcupado(false);
    }
  };

  const baixarCsv = async () => {
    try {
      await teacherService.downloadCsv(turma.id, nomeDoCsv(turma.name));
    } catch {
      toast.error('Não foi possível baixar a planilha.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <Button variant="ghost" onClick={onVoltar}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Minhas turmas
      </Button>

      <div>
        <h1 className="font-display text-2xl leading-tight">{turma.name}</h1>
        <p className="text-sm text-muted-foreground">
          {[turma.institution, `${turma.memberCount} ${turma.memberCount === 1 ? 'aluno' : 'alunos'}`, turma.archived ? 'arquivada' : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <Card className="gap-4 p-5">
        {turma.archived ? (
          <p className="text-sm text-muted-foreground">Turma arquivada: ninguém entra com o código até você desarquivar.</p>
        ) : (
          <CodigoDaTurma codigo={turma.joinCode} nomeDaTurma={turma.name} />
        )}
        <div className="flex flex-wrap gap-2">
          {!turma.archived && (
            <Button
              variant="outline"
              size="sm"
              disabled={ocupado}
              onClick={() => agir(() => teacherService.regenerateCode(turma.id), 'Código novo gerado. O antigo não vale mais.')}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Gerar código novo
            </Button>
          )}
          {turma.archived ? (
            <Button variant="outline" size="sm" disabled={ocupado} onClick={() => agir(() => teacherService.unarchive(turma.id), 'Turma desarquivada.')}>
              <ArchiveRestore className="size-4" aria-hidden="true" />
              Desarquivar
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled={ocupado} onClick={() => agir(() => teacherService.archive(turma.id), 'Turma arquivada.')}>
              <Archive className="size-4" aria-hidden="true" />
              Arquivar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={baixarCsv}>
            <Download className="size-4" aria-hidden="true" />
            Baixar planilha (CSV)
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="alunos">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="perguntas">Perguntas mais erradas</TabsTrigger>
        </TabsList>
        <TabsContent value="alunos">
          {!alunos ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : alunos.length === 0 ? (
            <Card className="items-center gap-2 p-6 text-center">
              <Users className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Ninguém entrou ainda. Mostre o código à turma: no app, é Perfil → Minhas turmas.
              </p>
            </Card>
          ) : (
            <TabelaAlunos alunos={alunos} />
          )}
        </TabsContent>
        <TabsContent value="perguntas">
          {!perguntas ? <Skeleton className="h-40 w-full rounded-xl" /> : <PerguntasMaisErradas perguntas={perguntas} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
