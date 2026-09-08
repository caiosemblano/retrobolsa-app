import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, CandlestickChart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { LoginPayload } from '../../services/authService';

interface Props {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export function LoginScreen({ onLoginSuccess, onGoToRegister }: Props) {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit = async (data: LoginPayload) => {
    try {
      await login(data);
      toast.success('Bem-vindo de volta!');
      onLoginSuccess();
    } catch (err: any) {
      const detail =
        err?.response?.data?.erro ??
        err?.response?.data?.message ??
        'Email ou senha incorretos.';
      toast.error(detail);
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
          <p className="mt-1 text-sm text-muted-foreground">Simulador histórico de investimentos</p>
        </div>

        {/* Card */}
        <div className="surface-glass rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 font-display text-xl">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="login-email" className="mb-1.5 block">
                E-mail
              </Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-erro' : undefined}
                className={errors.email ? 'border-destructive' : ''}
                {...register('email', {
                  required: 'Preencha o e-mail.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail inválido.' },
                })}
              />
              {errors.email && (
                <p id="login-email-erro" role="alert" className="mt-1.5 text-xs text-loss">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="login-senha" className="mb-1.5 block">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="login-senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.senha}
                  aria-describedby={errors.senha ? 'login-senha-erro' : undefined}
                  className={`pr-12 ${errors.senha ? 'border-destructive' : ''}`}
                  {...register('senha', {
                    required: 'Preencha a senha.',
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
              {errors.senha && (
                <p id="login-senha-erro" role="alert" className="mt-1.5 text-xs text-loss">
                  {errors.senha.message}
                </p>
              )}
            </div>

            <Button id="login-submit" type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className="size-5 animate-spin rounded-full border-2 border-current/30 border-t-current"
                />
              ) : (
                <>
                  <LogIn className="size-5" aria-hidden="true" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <button
              type="button"
              onClick={onGoToRegister}
              className="cursor-pointer font-semibold text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cadastre-se grátis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
