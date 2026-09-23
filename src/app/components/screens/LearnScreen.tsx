import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../ModuleCard';
import { LessonCard } from '../LessonCard';
import { LessonView } from '../LessonView';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import { articleService, ArticleDetail } from '../../services/articleService';
import { Module } from '../../types';

/** A API grava o ícone em kebab-case ("trending-up"); o ModuleCard usa o nome do componente ("TrendingUp"). */
function nomeDoIcone(kebab?: string | null): string {
  if (!kebab) return 'GraduationCap';
  return kebab
    .split('-')
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join('');
}

export function LearnScreen() {
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    articleService.getAll()
      .then((response) => setArticles(response.data))
      .catch(() => toast.error('Não foi possível carregar as aulas.'))
      .finally(() => setLoading(false));
  }, []);

  const modules = useMemo<Module[]>(
    () =>
      Object.values(
        articles.reduce<Record<string, Module>>((grouped, article) => {
          const current = grouped[article.moduleId] || {
            id: article.moduleId,
            title: article.moduleTitle,
            description: article.moduleDescription || 'Conteúdos financeiros para suas competições.',
            icon: nomeDoIcone(article.moduleIcon),
            lessonsCount: 0,
            completedLessons: 0,
          };
          current.lessonsCount += 1;
          if (article.completed) current.completedLessons += 1;
          grouped[article.moduleId] = current;
          return grouped;
        }, {}),
      ),
    [articles],
  );

  const moduleArticles = selectedModule
    ? articles.filter((article) => article.moduleId === selectedModule.id)
    : [];

  // Lida de `articles` a cada render (e não guardada em estado) para refletir a conclusão na hora.
  const selectedArticle = articles.find((article) => article.id === selectedArticleId) ?? null;

  const concluir = async (article: ArticleDetail) => {
    setSaving(true);
    try {
      await articleService.complete(article.id);
      // Só marca depois que a API confirmou: antes, uma falha deixava a aula
      // "concluída" na tela sem ter sido salva.
      setArticles((current) =>
        current.map((item) => (item.id === article.id ? { ...item, completed: true } : item)),
      );
      toast.success('Aula concluída!');
    } catch {
      toast.error('Não foi possível salvar a conclusão. Tente de novo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (selectedArticle) {
    const aulasDoModulo = articles.filter((article) => article.moduleId === selectedArticle.moduleId);
    const indice = aulasDoModulo.findIndex((article) => article.id === selectedArticle.id);
    const proxima = aulasDoModulo[indice + 1];
    return (
      <LessonView
        article={selectedArticle}
        position={indice + 1}
        total={aulasDoModulo.length}
        saving={saving}
        onBack={() => setSelectedArticleId(null)}
        onComplete={() => concluir(selectedArticle)}
        onNext={proxima ? () => setSelectedArticleId(proxima.id) : undefined}
      />
    );
  }

  if (selectedModule) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
        <Button variant="ghost" onClick={() => setSelectedModule(null)}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          Voltar para módulos
        </Button>

        <div>
          <h1 className="font-display text-2xl">{selectedModule.title}</h1>
          <p className="text-muted-foreground">{selectedModule.description}</p>
        </div>

        <div className="space-y-3">
          {moduleArticles.map((article) => (
            <LessonCard
              key={article.id}
              lesson={{
                id: article.id,
                moduleId: article.moduleId,
                title: article.title,
                duration: `${article.durationMin} min`,
                completed: article.completed,
              }}
              onClick={() => setSelectedArticleId(article.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-info/25 bg-info-soft text-info"
        >
          <GraduationCap className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl leading-tight">Aprender</h1>
          <p className="text-muted-foreground text-sm">Aprimore seus conhecimentos financeiros</p>
        </div>
      </div>

      {modules.length ? (
        <div className="space-y-3">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} onClick={() => setSelectedModule(module)} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma aula disponível.</p>
        </Card>
      )}
    </div>
  );
}
