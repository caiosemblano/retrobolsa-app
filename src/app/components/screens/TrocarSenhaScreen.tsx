import { toast } from 'sonner';
import { KeyRound, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { TrocarSenhaForm } from '../TrocarSenhaForm';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Quem entrou com a senha temporária que o admin gerou cai aqui antes de qualquer
 * outra tela, e só segue depois de criar uma senha nova.
 */
export function TrocarSenhaScreen({ onTrocada }: { onTrocada: () => void }) {
  const { updateUser, logout } = useAuth();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8">
        <div className="space-y-2 text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid size-14 place-items-center rounded-2xl border border-gold/30 bg-gold-soft text-gold"
          >
            <KeyRound className="size-7" />
          </span>
          <h1 className="font-display text-2xl">Crie uma senha nova</h1>
          <p className="text-sm text-muted-foreground">
            Você entrou com uma senha temporária. Para continuar, troque-a por uma senha só sua.
          </p>
        </div>
        <TrocarSenhaForm
          rotuloAtual="Senha temporária"
          onTrocada={() => {
            updateUser({ mustChangePassword: false });
            toast.success('Senha trocada. Bom jogo!');
            onTrocada();
          }}
        />
        <Button variant="ghost" className="w-full" onClick={logout}>
          <LogOut className="size-4" aria-hidden="true" />
          Sair
        </Button>
      </div>
    </div>
  );
}
