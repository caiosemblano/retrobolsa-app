import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, CandlestickChart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterPayload } from '../../services/authService';

interface Props {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export function RegisterScreen({ onRegisterSuccess, onGoToLogin }: Props) {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterPayload>();

  const senha = watch('senha');

  const onSubmit = async (data: RegisterPayload) => {
    try {
      await registerUser(data);
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      onRegisterSuccess();
    } catch (err: any) {
      // O backend retorna detalhes de validação como lista [{campo, mensagem}]
      const detalhes = err?.response?.data?.detalhes as Array<{ campo: string; mensagem: string }> | undefined;
      if (detalhes && detalhes.length > 0) {
        detalhes.forEach((d) => toast.error(`${d.campo}: ${d.mensagem}`));
      } else {
        const msg = err?.response?.data?.erro ?? 'Erro ao criar conta. Tente novamente.';
        toast.error(msg);
      }
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="mb-8 text-center">
          <span
            aria-hidden="true"
            className="mb-4 inline-grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-[0_16px_40px_-16px_var(--primary)]"
          >
            <CandlestickChart className="size-8" />
          </span>
          <h1 className="font-display text-3xl font-bold">Cartola Financeiro</h1>
          <p className="mt-1 text-sm text-muted-foreground">Crie sua conta e comece a investir</p>
        </div>

        {/* Card */}
        <div className="surface-glass rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 font-display text-xl">Criar conta gratuita</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="register-username" className="mb-1.5 block">
                Nome de usuário
              </Label>
              <Input
                id="register-username"
                type="text"
                autoComplete="username"
                placeholder="investidor_retro"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'register-username-erro' : undefined}
                className={errors.username ? 'border-destructive' : ''}
                {...register('username', {
                  required: 'Escolha um nome de usuário.',
                  minLength: { value: 3, message: 'Mínimo de 3 caracteres.' },
                })}
              />
              {errors.username && (
                <p id="register-username-erro" role="alert" className="mt-1.5 text-xs text-loss">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="register-email" className="mb-1.5 block">
                E-mail
              </Label>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'register-email-erro' : undefined}
                className={errors.email ? 'border-destructive' : ''}
                {...register('email', {
                  required: 'Preencha o e-mail.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail inválido.' },
                })}
              />
              {errors.email && (
                <p id="register-email-erro" role="alert" className="mt-1.5 text-xs text-loss">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="register-senha" className="mb-1.5 block">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="register-senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  aria-invalid={!!errors.senha}
                  aria-describedby={errors.senha ? 'register-senha-erro' : 'register-senha-ajuda'}
                  className={`pr-12 ${errors.senha ? 'border-destructive' : ''}`}
                  {...register('senha', {
                    required: 'Crie uma senha.',
                    minLength: { value: 8, message: 'Mínimo de 8 caracteres.' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.senha ? (
                <p id="register-senha-erro" role="alert" className="mt-1.5 text-xs text-loss">
                  {errors.senha.message}
                </p>
              ) : (
                <p id="register-senha-ajuda" className="mt-1.5 text-xs text-muted-foreground">
                  Use ao menos 8 caracteres.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="register-confirmar-senha" className="mb-1.5 block">
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="register-confirmar-senha"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  aria-invalid={!!errors.confirmarSenha}
                  aria-describedby={errors.confirmarSenha ? 'register-confirmar-erro' : undefined}
                  className={`pr-12 ${errors.confirmarSenha ? 'border-destructive' : ''}`}
                  {...register('confirmarSenha', {
                    required: 'Confirme a senha.',
                    validate: (val) => val === senha || 'As senhas não coincidem.',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p id="register-confirmar-erro" role="alert" className="mt-1.5 text-xs text-loss">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>

            <Button
              id="register-submit"
              type="submit"
              size="lg"
              className="mt-2 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className="size-5 animate-spin rounded-full border-2 border-current/30 border-t-current"
                />
              ) : (
                <>
                  <UserPlus className="size-5" aria-hidden="true" />
                  Criar conta
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="cursor-pointer font-semibold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
