import { useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { userService } from '../services/userService';

interface TrocarSenhaFormProps {
  /** Rótulo do campo da senha em uso ("Senha atual" ou "Senha temporária"). */
  rotuloAtual?: string;
  onTrocada: () => void;
}

const mensagemDaApi = (error: any) =>
  error?.response?.data?.erro || 'Não foi possível trocar a senha.';

/** Troca de senha: a atual, a nova e a confirmação, com as regras conferidas antes de ir à API. */
export function TrocarSenhaForm({ rotuloAtual = 'Senha atual', onTrocada }: TrocarSenhaFormProps) {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (event: FormEvent) => {
    event.preventDefault();
    if (!atual) return setErro(`Digite a ${rotuloAtual.toLowerCase()}.`);
    if (nova.length < 8) return setErro('A nova senha precisa ter no mínimo 8 caracteres.');
    if (nova !== confirmacao) return setErro('A confirmação é diferente da nova senha.');
    setEnviando(true);
    setErro(null);
    try {
      await userService.changePassword(atual, nova, confirmacao);
      setAtual('');
      setNova('');
      setConfirmacao('');
      onTrocada();
    } catch (error) {
      setErro(mensagemDaApi(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="senha-atual">{rotuloAtual}</Label>
        <Input id="senha-atual" type="password" autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="senha-nova">Nova senha</Label>
        <Input
          id="senha-nova"
          type="password"
          autoComplete="new-password"
          aria-describedby="senha-nova-ajuda"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
        />
        <p id="senha-nova-ajuda" className="text-xs text-muted-foreground">
          Use ao menos 8 caracteres.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="senha-confirmacao">Confirmar a nova senha</Label>
        <Input
          id="senha-confirmacao"
          type="password"
          autoComplete="new-password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
        />
      </div>
      {erro && (
        <p role="alert" className="text-sm text-loss">
          {erro}
        </p>
      )}
      <Button type="submit" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Trocar senha'}
      </Button>
    </form>
  );
}
