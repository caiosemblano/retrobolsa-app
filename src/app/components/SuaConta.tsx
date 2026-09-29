import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Download, KeyRound, Trash2, UserCog } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { TrocarSenhaForm } from './TrocarSenhaForm';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

/** No perfil: o que a pessoa pode fazer com a própria conta (senha e LGPD). */
export function SuaConta() {
  const { user, logout } = useAuth();
  const [excluindo, setExcluindo] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [baixando, setBaixando] = useState(false);

  const baixar = async () => {
    setBaixando(true);
    try {
      await userService.downloadMyData();
    } catch {
      toast.error('Não foi possível baixar os seus dados.');
    } finally {
      setBaixando(false);
    }
  };

  const excluir = async (event: FormEvent) => {
    event.preventDefault();
    if (!senha) {
      setErro('Digite a sua senha para confirmar.');
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await userService.deleteAccount(senha);
      setExcluindo(false);
      toast.success('Sua conta foi excluída.');
      logout();
    } catch (error) {
      setErro((error as any)?.response?.data?.erro || 'Não foi possível excluir a conta.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section aria-labelledby="conta-titulo">
      <h2 id="conta-titulo" className="mb-4 flex items-center gap-2 font-display text-xl">
        <UserCog className="size-5 text-muted-foreground" aria-hidden="true" />
        Sua conta
      </h2>
      <Card className="gap-0 divide-y divide-border p-0">
        <details className="p-5">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
            <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
            Trocar senha
          </summary>
          <div className="mt-4 max-w-sm">
            <TrocarSenhaForm onTrocada={() => toast.success('Senha trocada.')} />
          </div>
        </details>

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <div className="font-medium">Baixar meus dados</div>
            <p className="text-sm text-muted-foreground">Tudo o que o RetroBolsa guarda sobre você, num arquivo.</p>
          </div>
          <Button variant="outline" onClick={baixar} disabled={baixando}>
            <Download className="size-4" aria-hidden="true" />
            {baixando ? 'Baixando...' : 'Baixar'}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <div className="font-medium">Excluir minha conta</div>
            <p className="text-sm text-muted-foreground">Apaga a conta e tudo o que é dela. Não dá para desfazer.</p>
          </div>
          <Button variant="destructive" onClick={() => setExcluindo(true)}>
            <Trash2 className="size-4" aria-hidden="true" />
            Excluir
          </Button>
        </div>
      </Card>

      <Dialog
        open={excluindo}
        onOpenChange={(aberto) => {
          setExcluindo(aberto);
          if (!aberto) {
            setSenha('');
            setErro(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir a sua conta?</DialogTitle>
            <DialogDescription>
              Somem as carteiras, o XP, as conquistas, as aulas, os quizzes, os treinos, as turmas e as notificações.
              {user?.role === 'TEACHER' && ' As turmas que você criou também são apagadas, com as tarefas delas.'} Não
              dá para desfazer.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={excluir} noValidate className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="excluir-senha">Sua senha</Label>
              <Input
                id="excluir-senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
              />
            </div>
            {erro && (
              <p role="alert" className="text-sm text-loss">
                {erro}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setExcluindo(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={enviando}>
                {enviando ? 'Excluindo...' : 'Excluir para sempre'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
