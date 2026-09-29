import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { adminCompetitionService, AdminAsset, NovaRodadaPayload } from '../../services/adminCompetitionService';

interface NovaRodadaFormProps {
  /** Número sugerido: o próximo depois da última rodada cadastrada. */
  proximoNumero: number;
  onCriada: (numero: number) => void;
  onCancelar: () => void;
}

interface Campos {
  roundNumber: string;
  budget: string;
  scenarioTitle: string;
  scenarioDescription: string;
  startYear: string;
  endYear: string;
  endsAt: string;
}

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Uma semana a partir de agora, às 23:59, no formato do input datetime-local. */
export function prazoPadrao(agora = new Date()): string {
  const d = new Date(agora);
  d.setDate(d.getDate() + 7);
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}T23:59`;
}

/** Anos que o motor simula (do inicial até o anterior ao final) e que faltam na base para o ativo. */
export function anosFaltando(ativo: AdminAsset, inicio: number, fim: number): number[] {
  if (!Number.isInteger(inicio) || !Number.isInteger(fim) || fim <= inicio) return [];
  const disponiveis = new Set(ativo.years);
  const faltam: number[] = [];
  for (let ano = inicio; ano < fim; ano++) if (!disponiveis.has(ano)) faltam.push(ano);
  return faltam;
}

const intervalo = (anos: number[]) =>
  anos.length === 0 ? 'sem anos na base' : anos.length === 1 ? `${anos[0]}` : `${anos[0]}–${anos[anos.length - 1]}`;

/** Confere o formulário antes de ir à API; devolve a primeira mensagem de erro, ou null. */
export function validar(campos: Campos, selecionados: AdminAsset[]): string | null {
  const numero = Number(campos.roundNumber);
  const inicio = Number(campos.startYear);
  const fim = Number(campos.endYear);
  if (!Number.isInteger(numero) || numero < 1) return 'Informe o número da rodada.';
  if (!campos.scenarioTitle.trim()) return 'Dê um título ao cenário.';
  if (!(Number(campos.budget) > 0)) return 'O orçamento precisa ser maior que zero.';
  if (!Number.isInteger(inicio) || inicio < 1900 || !Number.isInteger(fim) || fim < 1900) {
    return 'Informe os anos inicial e final.';
  }
  if (fim <= inicio) return 'O ano final precisa vir depois do inicial.';
  if (!campos.endsAt) return 'Informe o prazo para enviar a carteira.';
  if (selecionados.length === 0) return 'Escolha ao menos um ativo.';
  const semDados = selecionados.filter((ativo) => anosFaltando(ativo, inicio, fim).length > 0);
  if (semDados.length) {
    return `Sem dados no período para: ${semDados.map((ativo) => ativo.realName || ativo.anonymousName).join(', ')}.`;
  }
  const nomes = new Map<string, number>();
  selecionados.forEach((ativo) => nomes.set(ativo.anonymousName, (nomes.get(ativo.anonymousName) ?? 0) + 1));
  const repetido = [...nomes.entries()].find(([, vezes]) => vezes > 1);
  if (repetido) return `Dois ativos escolhidos têm o mesmo nome anônimo (${repetido[0]}): o jogador não os distinguiria.`;
  return null;
}

const mensagemDaApi = (error: any) =>
  error?.response?.data?.erro || error?.response?.data?.message || 'Não foi possível criar a rodada.';

/** Formulário do admin para montar uma rodada nova, que nasce como rascunho. */
export function NovaRodadaForm({ proximoNumero, onCriada, onCancelar }: NovaRodadaFormProps) {
  const [campos, setCampos] = useState<Campos>({
    roundNumber: String(proximoNumero),
    budget: '100000',
    scenarioTitle: '',
    scenarioDescription: '',
    startYear: '',
    endYear: '',
    endsAt: prazoPadrao(),
  });
  const [ativos, setAtivos] = useState<AdminAsset[] | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    adminCompetitionService
      .assets()
      .then((response) => setAtivos(response.data))
      .catch(() => setErro('Não foi possível carregar os ativos.'));
  }, []);

  const inicio = Number(campos.startYear);
  const fim = Number(campos.endYear);
  const periodoValido = Number.isInteger(inicio) && Number.isInteger(fim) && inicio >= 1900 && fim > inicio;

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (ativos ?? []).filter((ativo) =>
      !termo ||
      [ativo.anonymousName, ativo.realName, ativo.ticker, ativo.sector, ativo.bondType]
        .some((texto) => texto?.toLowerCase().includes(termo)),
    );
  }, [ativos, busca]);

  const mudar = (campo: keyof Campos) => (event: { target: { value: string } }) =>
    setCampos((atual) => ({ ...atual, [campo]: event.target.value }));

  const alternar = (id: string, marcado: boolean) =>
    setSelecionados((atual) => {
      const novo = new Set(atual);
      if (marcado) novo.add(id);
      else novo.delete(id);
      return novo;
    });

  const enviar = async (event: FormEvent) => {
    event.preventDefault();
    const escolhidos = (ativos ?? []).filter((ativo) => selecionados.has(ativo.id));
    const problema = validar(campos, escolhidos);
    if (problema) {
      setErro(problema);
      return;
    }
    const payload: NovaRodadaPayload = {
      roundNumber: Number(campos.roundNumber),
      budget: Number(campos.budget),
      scenarioTitle: campos.scenarioTitle.trim(),
      scenarioDescription: campos.scenarioDescription.trim() || undefined,
      startYear: inicio,
      endYear: fim,
      endsAt: campos.endsAt,
      assetIds: escolhidos.map((ativo) => ativo.id),
    };
    setErro(null);
    setEnviando(true);
    try {
      await adminCompetitionService.create(payload);
      onCriada(payload.roundNumber);
    } catch (error) {
      setErro(mensagemDaApi(error));
    } finally {
      setEnviando(false);
    }
  };

  const grupos: { tipo: AdminAsset['type']; titulo: string }[] = [
    { tipo: 'stock', titulo: 'Ações' },
    { tipo: 'bond', titulo: 'Títulos' },
  ];

  return (
    <Card className="gap-5 p-5">
      <h2 className="font-display text-xl">Nova rodada</h2>
      <form onSubmit={enviar} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nr-numero">Número da rodada</Label>
            <Input id="nr-numero" type="number" inputMode="numeric" min={1} value={campos.roundNumber} onChange={mudar('roundNumber')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nr-orcamento">Orçamento (R$)</Label>
            <Input id="nr-orcamento" type="number" inputMode="numeric" min={1} value={campos.budget} onChange={mudar('budget')} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nr-titulo">Título do cenário</Label>
            <Input id="nr-titulo" value={campos.scenarioTitle} onChange={mudar('scenarioTitle')} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nr-descricao">Descrição do cenário</Label>
            <Textarea
              id="nr-descricao"
              aria-describedby="nr-descricao-dica"
              value={campos.scenarioDescription}
              onChange={mudar('scenarioDescription')}
            />
            <p id="nr-descricao-dica" className="text-xs text-muted-foreground">
              É o que o jogador lê antes de montar a carteira: conte o momento sem citar o nome das empresas.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nr-inicio">Ano inicial</Label>
            <Input id="nr-inicio" type="number" inputMode="numeric" value={campos.startYear} onChange={mudar('startYear')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nr-fim">Ano final</Label>
            <Input
              id="nr-fim"
              type="number"
              inputMode="numeric"
              aria-describedby="nr-fim-dica"
              value={campos.endYear}
              onChange={mudar('endYear')}
            />
          </div>
          <p id="nr-fim-dica" className="text-xs text-muted-foreground sm:col-span-2" aria-live="polite">
            {periodoValido
              ? `O jogo simula de ${inicio} a ${fim - 1}; ${fim} é só o ponto de chegada do gráfico.`
              : 'O jogo simula do ano inicial até o ano anterior ao final.'}
          </p>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nr-prazo">Prazo para enviar a carteira</Label>
            <Input id="nr-prazo" type="datetime-local" value={campos.endsAt} onChange={mudar('endsAt')} />
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="font-display text-lg">
            Ativos <span className="text-sm font-normal text-muted-foreground">({selecionados.size} escolhidos)</span>
          </legend>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              aria-label="Buscar ativo"
              placeholder="Buscar por nome, código ou setor"
              className="pl-9"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
          {!ativos ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <div className="max-h-96 space-y-4 overflow-y-auto rounded-xl border border-border p-3">
              {grupos.map(({ tipo, titulo }) => {
                const doGrupo = visiveis.filter((ativo) => ativo.type === tipo);
                if (!doGrupo.length) return null;
                return (
                  <div key={tipo}>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{titulo}</h3>
                    <ul className="space-y-1">
                      {doGrupo.map((ativo) => {
                        const faltam = periodoValido ? anosFaltando(ativo, inicio, fim) : [];
                        const semDados = faltam.length > 0;
                        const id = `nr-ativo-${ativo.id}`;
                        return (
                          <li key={ativo.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/50">
                            <Checkbox
                              id={id}
                              className="mt-0.5"
                              checked={selecionados.has(ativo.id)}
                              disabled={semDados && !selecionados.has(ativo.id)}
                              onCheckedChange={(marcado) => alternar(ativo.id, marcado === true)}
                              aria-describedby={`${id}-info`}
                            />
                            <div className="min-w-0 flex-1">
                              <Label htmlFor={id} className="cursor-pointer font-medium">
                                {ativo.anonymousName}
                                {ativo.realName ? ` · ${ativo.realName}` : ''}
                                {ativo.ticker ? ` (${ativo.ticker})` : ''}
                              </Label>
                              <p id={`${id}-info`} className="text-xs text-muted-foreground">
                                {ativo.sector || ativo.bondType || (tipo === 'bond' ? 'Título' : 'Ação')} · dados de{' '}
                                {intervalo(ativo.years)}
                                {semDados && (
                                  <span className="text-loss"> · sem dados em {faltam.join(', ')}</span>
                                )}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              {visiveis.length === 0 && <p className="text-sm text-muted-foreground">Nenhum ativo encontrado.</p>}
            </div>
          )}
        </fieldset>

        {erro && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-loss/40 bg-loss-soft p-3 text-sm text-loss">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {erro}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando}>
            <Plus aria-hidden="true" />
            {enviando ? 'Criando...' : 'Criar rodada'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
