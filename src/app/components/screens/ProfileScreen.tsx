import { Card } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { AchievementBadge } from '../AchievementBadge';
import { Separator } from '../ui/separator';
import { Trophy, Target, Heart, Award } from 'lucide-react';
import { userProfile } from '../../data/mockData';

export function ProfileScreen() {
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-2">Perfil</h1>
        <p className="text-slate-600">Seu progresso e conquistas</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-slate-900 mb-1">{userProfile.username}</h2>
            <div className="flex items-center gap-2 text-orange-600">
              <Trophy className="w-4 h-4" />
              <span>{userProfile.totalPoints.toLocaleString('pt-BR')} pontos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 p-3 rounded-lg text-center">
            <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-slate-600 text-sm mb-1">Melhor Posição</div>
            <div className="text-blue-700">{userProfile.bestRank}º lugar</div>
          </div>
          <div className="bg-white/80 p-3 rounded-lg text-center">
            <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-slate-600 text-sm mb-1">Competições</div>
            <div className="text-green-700">{userProfile.completedCompetitions}</div>
          </div>
          <div className="bg-white/80 p-3 rounded-lg text-center">
            <Heart className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-slate-600 text-sm mb-1">Ativo Favorito</div>
            <div className="text-orange-700 text-xs">{userProfile.favoriteAsset}</div>
          </div>
        </div>
      </Card>

      <Separator className="my-6" />

      <div>
        <h2 className="text-slate-900 mb-4">Conquistas</h2>
        <div className="grid grid-cols-2 gap-4">
          {userProfile.achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
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
