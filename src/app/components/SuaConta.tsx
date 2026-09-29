import { toast } from 'sonner';
import { KeyRound, UserCog } from 'lucide-react';
import { Card } from './ui/card';
import { TrocarSenhaForm } from './TrocarSenhaForm';

/** No perfil: o que a pessoa pode fazer com a própria conta. */
export function SuaConta() {
  return (
    <section aria-labelledby="conta-titulo">
      <h2 id="conta-titulo" className="mb-4 flex items-center gap-2 font-display text-xl">
        <UserCog className="size-5 text-muted-foreground" aria-hidden="true" />
        Sua conta
      </h2>
      <Card className="gap-0 p-0">
        <details className="group p-5">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
            <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
            Trocar senha
          </summary>
          <div className="mt-4 max-w-sm">
            <TrocarSenhaForm onTrocada={() => toast.success('Senha trocada.')} />
          </div>
        </details>
      </Card>
    </section>
  );
}
