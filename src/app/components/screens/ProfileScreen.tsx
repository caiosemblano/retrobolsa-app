import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Trophy, Target, Award, History } from 'lucide-react';
import { userService } from '../../services/userService';
import { UserProfile } from '../../types';
import { AchievementBadge } from '../AchievementBadge';
import { formatarData } from '../../utils/date';

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile()
      .then((response) => setProfile(response.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-muted-foreground">
        Não foi possível carregar o perfil.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 pb-24">
      <div>
        <h1 className="font-display text-3xl">Perfil</h1>
        <p className="text-muted-foreground">Seu progresso e estatísticas</p>
      </div>

      {/* Cartão do jogador */}
      <Card className="gap-5 border-gold/25 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-20 border-2 border-gold/40 shadow-[0_0_24px_-8px_var(--gold)]">
            <AvatarFallback className="bg-muted font-display text-xl font-bold text-foreground">
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl">{profile.username}</h2>
            <div className="mt-1 flex items-center gap-2 text-gold">
              <Trophy className="size-4 shrink-0" aria-hidden="true" />
              <span className="tabular font-display font-semibold">
                {profile.totalPoints.toLocaleString('pt-BR')} pontos
              </span>
            </div>
            <div className="truncate text-sm text-muted-foreground">{profile.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/70 p-3.5 text-center">
            <Target className="mx-auto mb-1 size-5 text-info" aria-hidden="true" />
            <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Melhor posição
            </div>
            <div className="tabular font-display text-lg font-semibold text-info">
              {profile.bestRank ? `${profile.bestRank}º lugar` : '—'}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/70 p-3.5 text-center">
            <Award className="mx-auto mb-1 size-5 text-gain" aria-hidden="true" />
            <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Competições
            </div>
            <div className="tabular font-display text-lg font-semibold text-gain">
              {profile.completedCompetitions}
            </div>
          </div>
        </div>
      </Card>

      {/* Histórico de rodadas */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <History className="size-5 text-muted-foreground" aria-hidden="true" />
          <h2 className="font-display text-xl">Histórico de rodadas</h2>
        </div>

        {profile.history && profile.history.length > 0 ? (
          <div className="space-y-3">
            {profile.history.map((item) => {
              const isPositive = item.totalReturn >= 0;
              return (
                <Card
                  key={item.roundNumber}
                  className="p-4 transition-colors duration-200 hover:border-ring/30"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <Badge variant="info">Rodada {item.roundNumber}</Badge>
                        {item.submittedAt && (
                          <span className="tabular text-xs text-muted-foreground">
                            {formatarData(item.submittedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="truncate font-display text-sm font-medium">
                        {item.scenarioTitle || `Cenário Econômico da Rodada ${item.roundNumber}`}
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="min-w-[70px] rounded-lg border border-border bg-muted/70 px-3 py-1.5">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Rank</div>
                        <div className="tabular font-display text-sm font-semibold text-gold">
                          {item.rank ? `${item.rank}º` : '—'}
                        </div>
                      </div>
                      <div className="min-w-[80px] rounded-lg border border-border bg-muted/70 px-3 py-1.5">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Retorno</div>
                        <div
                          className={`tabular font-display text-sm font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}
                        >
                          {item.totalReturn !== null && item.totalReturn !== undefined
                            ? `${item.totalReturn.toFixed(2)}%`
                            : '—'}
                        </div>
                      </div>
                      <div className="min-w-[100px] rounded-lg border border-border bg-muted/70 px-3 py-1.5">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Patrimônio
                        </div>
                        <div className="tabular font-display text-sm font-semibold text-foreground">
                          {item.finalValue !== null && item.finalValue !== undefined
                            ? `R$ ${item.finalValue.toLocaleString('pt-BR')}`
                            : '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não completou nenhuma rodada de competição.
            </p>
          </Card>
        )}
      </section>

      {/* Conquistas */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-display text-xl">Conquistas</h2>
          </div>
          {profile.achievements.length > 0 && (
            <span className="tabular text-sm text-muted-foreground">
              {profile.achievements.filter((achievement) => achievement.unlocked).length} de{' '}
              {profile.achievements.length} desbloqueadas
            </span>
          )}
        </div>

        {profile.achievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profile.achievements.map((achievement) => (
              <AchievementBadge key={achievement.code} achievement={achievement} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma conquista disponível no momento.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
