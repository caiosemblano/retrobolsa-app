import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Presentation, Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { adminUserService, UsuarioDoAdmin } from '../../services/adminUserService';

const papel: Record<UsuarioDoAdmin['role'], string> = { PLAYER: 'Jogador', TEACHER: 'Professor', ADMIN: 'Admin' };
const mensagemDaApi = (error: any) => error?.response?.data?.erro || 'Não foi possível mudar o papel.';

/** O admin encontra alguém pelo nome ou e-mail e o promove a professor (ou o volta a jogador). */
export function Professores() {
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState<UsuarioDoAdmin[] | null>(null);
  const [titulo, setTitulo] = useState('Professores atuais');
  const [ocupado, setOcupado] = useState<string | null>(null);

  const buscar = async (termo: string) => {
    try {
      const { data } = await adminUserService.search(termo);
      setResultado(data);
      setTitulo(termo ? `Resultado para “${termo}”` : 'Professores atuais');
    } catch {
      setResultado([]);
      toast.error('Não foi possível buscar os usuários.');
    }
  };

  useEffect(() => {
    void buscar('');
  }, []);

  const enviar = (event: FormEvent) => {
    event.preventDefault();
    void buscar(busca.trim());
  };

  const mudar = async (usuario: UsuarioDoAdmin, novo: 'PLAYER' | 'TEACHER') => {
    setOcupado(usuario.id);
    try {
      const { data } = await adminUserService.changeRole(usuario.id, novo);
      setResultado((atuais) => (atuais ?? []).map((u) => (u.id === data.id ? data : u)));
      toast.success(novo === 'TEACHER' ? `${data.username} agora é professor(a).` : `${data.username} voltou a ser jogador(a).`);
    } catch (error) {
      toast.error(mensagemDaApi(error));
    } finally {
      setOcupado(null);
    }
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <Presentation className="size-5 text-info" aria-hidden="true" />
        <h2 className="font-display text-lg">Professores</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Não há cadastro de professor: encontre a pessoa pelo nome de usuário ou e-mail e promova-a aqui.
      </p>
      <form onSubmit={enviar} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Buscar usuário"
            placeholder="Nome de usuário ou e-mail"
            className="pl-9"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>

      {resultado && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{titulo}</h3>
          {resultado.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ninguém encontrado.</p>
          ) : (
            <ul className="space-y-2">
              {resultado.map((usuario) => (
                <li
                  key={usuario.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/70 p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usuario.username}</span>
                      <Badge variant={usuario.role === 'TEACHER' ? 'info' : 'secondary'}>{papel[usuario.role]}</Badge>
                    </div>
                    <div className="truncate text-sm text-muted-foreground">{usuario.email}</div>
                  </div>
                  {usuario.role === 'PLAYER' && (
                    <Button size="sm" disabled={ocupado === usuario.id} onClick={() => mudar(usuario, 'TEACHER')}>
                      Tornar professor
                    </Button>
                  )}
                  {usuario.role === 'TEACHER' && (
                    <Button size="sm" variant="outline" disabled={ocupado === usuario.id} onClick={() => mudar(usuario, 'PLAYER')}>
                      Voltar a jogador
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
