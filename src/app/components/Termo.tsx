import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { CircleHelp, PlayCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { glossario, type TermoId, type Verbete } from '../content/glossario';
import { rotas } from '../routes';

interface TermoProps {
  id: TermoId;
  /** Texto do gatilho; por padrão, a sigla do verbete. */
  children?: ReactNode;
  className?: string;
}

/**
 * Sigla que explica a si mesma: um toque abre o que ela significa e como ler o
 * número. Popover e não tooltip, porque tooltip não abre no toque do celular.
 */
export function Termo({ id, children, className = '' }: TermoProps) {
  const verbete: Verbete = glossario[id];

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`O que é ${verbete.nome}?`}
        // Fica acima de áreas clicáveis que cobrem o card inteiro (como no AssetCard).
        className={`pointer-events-auto relative z-10 inline-flex min-h-6 cursor-help items-center gap-1 rounded underline decoration-dotted decoration-muted-foreground/60 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      >
        {children ?? verbete.sigla}
        <CircleHelp className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="w-80 max-w-[calc(100vw-2rem)] space-y-2 rounded-xl text-sm">
        <p className="font-display text-base font-semibold">{verbete.nome}</p>
        <p>{verbete.oQueE}</p>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Como ler: </span>
          {verbete.comoLer}
        </p>
        {verbete.aula && (
          <Link
            to={rotas.aula(verbete.aula.moduloId, verbete.aula.aulaId)}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PlayCircle className="size-4" aria-hidden="true" />
            Assistir à aula
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
}
