import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, TrendingUp } from 'lucide-react';
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
      toast.success('Conta criada com sucesso! Faça login para continuar. 🚀');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 mb-4 shadow-lg shadow-blue-500/30">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cartola Financeiro</h1>
          <p className="text-blue-300 mt-1 text-sm">Crie sua conta e comece a investir</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Criar conta gratuita</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                Nome de usuário
              </label>
              <input
                id="register-username"
                type="text"
                autoComplete="username"
                placeholder="investidor_retro"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/60 ${
                  errors.username ? 'border-red-500/70' : 'border-white/20 focus:border-blue-500/50'
                }`}
                {...register('username', {
                  required: 'Escolha um nome de usuário.',
                  minLength: { value: 3, message: 'Mínimo de 3 caracteres.' },
                })}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                E-mail
              </label>
              <input
                id="register-email"
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
                  id="register-senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/60 ${
                    errors.senha ? 'border-red-500/70' : 'border-white/20 focus:border-blue-500/50'
                  }`}
                  {...register('senha', {
                    required: 'Crie uma senha.',
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

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="register-confirmar-senha"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/60 ${
                    errors.confirmarSenha ? 'border-red-500/70' : 'border-white/20 focus:border-blue-500/50'
                  }`}
                  {...register('confirmarSenha', {
                    required: 'Confirme a senha.',
                    validate: (val) => val === senha || 'As senhas não coincidem.',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmarSenha.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Criar conta
                </>
              )}
            </button>
          </form>

          {/* Link para login */}
          <p className="text-center text-white/50 text-sm mt-6">
            Já tem conta?{' '}
            <button
              onClick={onGoToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
