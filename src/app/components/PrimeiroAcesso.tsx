import { useState } from 'react';
import { Link } from 'react-router';
import { GraduationCap, School, Sparkles, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { rotas } from '../routes';

const passos = [
  {
    icone: Wallet,
    titulo: 'Como funciona uma rodada',
    texto:
      'Você recebe R$ 100.000 e monta uma carteira com empresas e títulos de um período real do Brasil, sem saber os nomes. O jogo simula os anos com os retornos de verdade e, no fim, revela quem era quem.',
  },
  {
    icone: GraduationCap,
    titulo: 'Onde aprender',
    texto:
      'Em Aprender há aulas curtas, com vídeo e um quiz de 3 perguntas. As dicas do resultado de cada rodada levam direto à aula do assunto.',
  },
  {
    icone: Sparkles,
    titulo: 'O que é XP',
    texto:
      'XP mede dedicação: aulas, quizzes, carteiras, treinos e missões da semana dão XP e fazem você subir de nível, mesmo quando a carteira perde dinheiro.',
  },
  {
    icone: School,
    titulo: 'Como entrar numa turma',
    texto:
      'Se o seu professor usa o RetroBolsa, ele passa um código de 6 letras. Digite o código em Perfil → Minhas turmas para ver o ranking da turma e as tarefas.',
  },
] as const;

/** O passo a passo do primeiro acesso: 4 telas curtas. Terminar ou pular marca como visto. */
export function PrimeiroAcesso() {
  const { updateUser } = useAuth();
  const [passo, setPasso] = useState(0);
  const [aberto, setAberto] = useState(true);
  const atual = passos[passo];
  const Icone = atual.icone;
  const ultimo = passo === passos.length - 1;

  const concluir = () => {
    setAberto(false);
    updateUser({ onboarded: true });
    userService.markOnboarded().catch(() => undefined); // Se falhar, o passo a passo volta no próximo acesso.
  };

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => !abrir && concluir()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <span
            aria-hidden="true"
            className="mx-auto mb-2 grid size-14 place-items-center rounded-2xl border border-info/30 bg-info-soft text-info"
          >
            <Icone className="size-7" />
          </span>
          <p className="text-center text-xs uppercase tracking-wide text-muted-foreground">
            Passo {passo + 1} de {passos.length}
          </p>
          <DialogTitle className="text-center font-display text-xl">{atual.titulo}</DialogTitle>
          <DialogDescription className="text-center text-base">{atual.texto}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-1.5" aria-hidden="true">
          {passos.map((p, i) => (
            <span key={p.titulo} className={`h-1.5 w-6 rounded-full ${i === passo ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {ultimo && (
          <p className="text-center text-sm">
            Quer os detalhes?{' '}
            <Link to={rotas.comoFunciona} onClick={concluir} className="font-medium text-info underline-offset-4 hover:underline">
              Veja como funciona
            </Link>
            .
          </p>
        )}

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          {passo === 0 ? (
            <Button variant="ghost" onClick={concluir}>
              Pular
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setPasso(passo - 1)}>
              Voltar
            </Button>
          )}
          <Button onClick={ultimo ? concluir : () => setPasso(passo + 1)}>{ultimo ? 'Começar' : 'Próximo'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
