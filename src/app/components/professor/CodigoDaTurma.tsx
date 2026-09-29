import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface CodigoDaTurmaProps {
  codigo: string;
  nomeDaTurma: string;
}

/** O código em letras grandes, com um modo "projetar" para mostrar à sala inteira. */
export function CodigoDaTurma({ codigo, nomeDaTurma }: CodigoDaTurmaProps) {
  const [projetando, setProjetando] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Código para entrar</div>
        <div className="tabular font-display text-3xl font-bold tracking-[0.25em] text-gold">{codigo}</div>
      </div>
      <Button variant="outline" size="sm" onClick={() => setProjetando(true)}>
        <Maximize2 className="size-4" aria-hidden="true" />
        Projetar
      </Button>

      <Dialog open={projetando} onOpenChange={setProjetando}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{nomeDaTurma}</DialogTitle>
            <DialogDescription className="text-base">
              No RetroBolsa, abra Perfil → Minhas turmas e digite o código:
            </DialogDescription>
          </DialogHeader>
          <p
            className="tabular py-6 text-center font-display text-[clamp(3rem,14vw,9rem)] font-bold leading-none tracking-[0.15em] text-gold"
            aria-label={`Código ${codigo.split('').join(' ')}`}
          >
            {codigo}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
