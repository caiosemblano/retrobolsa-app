import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlunoDaTurma } from '../../services/teacherService';
import { formatarData } from '../../utils/date';
import { formatarNumero } from '../../utils/numero';

type Coluna = 'username' | 'lessonsCompleted' | 'quizAverage' | 'roundsPlayed' | 'xp' | 'lastActivity';
type Direcao = 'asc' | 'desc';

const colunas: { chave: Coluna; titulo: string; numerica: boolean }[] = [
  { chave: 'username', titulo: 'Aluno', numerica: false },
  { chave: 'lessonsCompleted', titulo: 'Aulas', numerica: true },
  { chave: 'quizAverage', titulo: 'Quizzes', numerica: true },
  { chave: 'roundsPlayed', titulo: 'Rodadas', numerica: true },
  { chave: 'xp', titulo: 'XP e nível', numerica: true },
  { chave: 'lastActivity', titulo: 'Última atividade', numerica: false },
];

/** Ordena sem mexer na lista original; vazios (quem nunca fez quiz, por exemplo) sempre no fim. */
export function ordenarAlunos(alunos: AlunoDaTurma[], coluna: Coluna, direcao: Direcao): AlunoDaTurma[] {
  const sinal = direcao === 'asc' ? 1 : -1;
  return [...alunos].sort((a, b) => {
    const va = a[coluna];
    const vb = b[coluna];
    const vazioA = va === null || va === undefined;
    const vazioB = vb === null || vb === undefined;
    if (vazioA || vazioB) return vazioA === vazioB ? 0 : vazioA ? 1 : -1;
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sinal;
    return String(va).localeCompare(String(vb), 'pt-BR', { sensitivity: 'base' }) * sinal;
  });
}

/** A tabela de alunos do painel do professor, ordenável por qualquer coluna. */
export function TabelaAlunos({ alunos }: { alunos: AlunoDaTurma[] }) {
  const [coluna, setColuna] = useState<Coluna>('username');
  const [direcao, setDirecao] = useState<Direcao>('asc');
  const ordenados = useMemo(() => ordenarAlunos(alunos, coluna, direcao), [alunos, coluna, direcao]);

  const ordenarPor = (nova: Coluna, numerica: boolean) => {
    if (nova === coluna) {
      setDirecao(direcao === 'asc' ? 'desc' : 'asc');
    } else {
      setColuna(nova);
      // Números começam do maior (quem está melhor); textos, de A a Z.
      setDirecao(numerica || nova === 'lastActivity' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {colunas.map(({ chave, titulo, numerica }) => {
              const ativa = coluna === chave;
              const Icone = !ativa ? ArrowUpDown : direcao === 'asc' ? ArrowUp : ArrowDown;
              return (
                <TableHead
                  key={chave}
                  aria-sort={ativa ? (direcao === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className={numerica ? 'text-right' : undefined}
                >
                  <button
                    type="button"
                    onClick={() => ordenarPor(chave, numerica)}
                    className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-md px-1 font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {titulo}
                    <Icone className={`size-3.5 ${ativa ? 'text-foreground' : 'text-muted-foreground'}`} aria-hidden="true" />
                  </button>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenados.map((aluno) => (
            <TableRow key={aluno.username}>
              <TableCell className="font-medium">{aluno.username}</TableCell>
              <TableCell className="tabular text-right">{aluno.lessonsCompleted}</TableCell>
              <TableCell className="tabular text-right">
                {aluno.quizAverage === null || aluno.quizAverage === undefined ? (
                  <span className="text-muted-foreground">nenhum</span>
                ) : (
                  <>
                    {formatarNumero(aluno.quizAverage, 1)}%{' '}
                    <span className="text-xs text-muted-foreground">
                      em {aluno.quizzesTaken} {aluno.quizzesTaken === 1 ? 'quiz' : 'quizzes'}
                    </span>
                  </>
                )}
              </TableCell>
              <TableCell className="tabular text-right">{aluno.roundsPlayed}</TableCell>
              <TableCell className="tabular text-right">
                {aluno.xp} <span className="text-xs text-muted-foreground">· nível {aluno.level}</span>
              </TableCell>
              <TableCell className="tabular">
                {aluno.lastActivity ? formatarData(aluno.lastActivity) : <span className="text-muted-foreground">—</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
