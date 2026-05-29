import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, TrendingUp } from 'lucide-react';
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
      toast.success('Bem-vindo de volta! 🎉');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 mb-4 shadow-lg shadow-blue-500/30">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cartola Financeiro</h1>
          <p className="text-blue-300 mt-1 text-sm">Simulador Histórico de Investimentos</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/60 ${
                  errors.email ? 'border-red-500/70' : 'border-white/20 focus:border-blue-500/50'
                }`}
                {...register('email', {
                  required: 'Preencha o e-mail.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail inválido.' },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/60 ${
                    errors.senha ? 'border-red-500/70' : 'border-white/20 focus:border-blue-500/50'
                  }`}
                  {...register('senha', {
                    required: 'Preencha a senha.',
                    minLength: { value: 8, message: 'Mínimo de 8 caracteres.' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-400 text-xs mt-1">{errors.senha.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Link para cadastro */}
          <p className="text-center text-white/50 text-sm mt-6">
            Não tem conta?{' '}
            <button
              onClick={onGoToRegister}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Cadastre-se grátis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
