import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { AchievementBadge } from '../AchievementBadge';
import { Separator } from '../ui/separator';
import { Trophy, Target, Heart, Award, Loader2, AlertCircle } from 'lucide-react';
import { userService } from '../../services/userService';
import { UserProfile } from '../../types';

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getProfile();
        setProfile(res.data);
      } catch {
        setError('Não foi possível carregar o perfil. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600">Carregando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-700 text-center">{error || 'Perfil não encontrado.'}</p>
      </div>
    );
  }

  const avatarUrl = profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Perfil</h1>
        <p className="text-slate-600">Seu progresso e conquistas</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            <AvatarImage src={avatarUrl} alt={profile.username} />
            <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-slate-900 mb-1">{profile.username}</h2>
            <div className="flex items-center gap-2 text-orange-600">
              <Trophy className="w-4 h-4" />
              <span>{profile.totalPoints.toLocaleString('pt-BR')} pontos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 p-3 rounded-lg text-center">
            <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-slate-600 text-sm mb-1">Melhor Posição</div>
            <div className="text-blue-700">{profile.bestRank}º lugar</div>
          </div>
          <div className="bg-white/80 p-3 rounded-lg text-center">
            <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-slate-600 text-sm mb-1">Competições</div>
            <div className="text-green-700">{profile.completedCompetitions}</div>
          </div>
          <div className="bg-white/80 p-3 rounded-lg text-center">
            <Heart className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-slate-600 text-sm mb-1">Ativo Favorito</div>
            <div className="text-orange-700 text-xs">{profile.favoriteAsset}</div>
          </div>
        </div>
      </Card>

      <Separator className="my-6" />

      <div>
        <h2 className="text-slate-900 mb-4">Conquistas</h2>
        {profile.achievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {profile.achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center bg-slate-50 border-dashed">
            <p className="text-slate-600">Nenhuma conquista desbloqueada ainda.</p>
          </Card>
        )}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-slate-900 mb-2">Continue Progredindo!</h3>
        <p className="text-slate-600 text-sm">
          Complete mais aulas e participe de competições para desbloquear novas conquistas e subir no ranking.
        </p>
      </div>
    </div>
  );
}
