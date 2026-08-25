import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Trophy, Target, Award } from 'lucide-react';
import { userService } from '../../services/userService';
import { UserProfile } from '../../types';

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { userService.getProfile().then((response) => setProfile(response.data)).catch(() => undefined).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="p-8 text-center text-slate-600">Carregando perfil...</div>;
  if (!profile) return <div className="p-8 text-center text-slate-600">Não foi possível carregar o perfil.</div>;
  return <div className="max-w-4xl mx-auto p-4 pb-20"><div className="mb-6"><h1 className="text-slate-900 mb-2">Perfil</h1><p className="text-slate-600">Seu progresso e estatísticas</p></div><Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 mb-6"><div className="flex items-center gap-4 mb-4"><Avatar className="w-20 h-20 border-4 border-white shadow-lg"><AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div><h2 className="text-slate-900 mb-1">{profile.username}</h2><div className="flex items-center gap-2 text-orange-600"><Trophy className="w-4 h-4" /><span>{profile.totalPoints.toLocaleString('pt-BR')} pontos</span></div><div className="text-sm text-slate-500">{profile.email}</div></div></div><div className="grid grid-cols-2 gap-4"><div className="bg-white/80 p-3 rounded-lg text-center"><Target className="w-5 h-5 text-blue-600 mx-auto mb-1" /><div className="text-slate-600 text-sm mb-1">Melhor posição</div><div className="text-blue-700">{profile.bestRank ? `${profile.bestRank}º lugar` : '—'}</div></div><div className="bg-white/80 p-3 rounded-lg text-center"><Award className="w-5 h-5 text-green-600 mx-auto mb-1" /><div className="text-slate-600 text-sm mb-1">Competições</div><div className="text-green-700">{profile.completedCompetitions}</div></div></div></Card><Separator className="my-6" /><h2 className="text-slate-900 mb-4">Conquistas</h2><p className="text-slate-500">Conquistas e ativo favorito ainda não são fornecidos pela API.</p></div>;
}
