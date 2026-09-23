import { CheckCircle, ChevronLeft, ChevronRight, Clock, PlayCircle } from 'lucide-react';
import { ArticleDetail } from '../services/articleService';
import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';
import { Card } from './ui/card';

/** Formato de ID do YouTube. O banco já barra outros valores; aqui é a segunda trava antes do src do iframe. */
const ID_DE_VIDEO = /^[A-Za-z0-9_-]{11}$/;

/** URL de embed (domínio sem cookies de rastreamento), ou null se não há um vídeo válido. */
export function urlDoVideo(videoId?: string | null): string | null {
  return videoId && ID_DE_VIDEO.test(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : null;
}

interface LessonViewProps {
  article: ArticleDetail;
  /** Posição da aula no módulo, a partir de 1. */
  position: number;
  total: number;
  saving: boolean;
  onBack: () => void;
  onComplete: () => void;
  /** Ausente na última aula do módulo. */
  onNext?: () => void;
}

export function LessonView({ article, position, total, saving, onBack, onComplete, onNext }: LessonViewProps) {
  const videoUrl = urlDoVideo(article.videoId);

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 pb-24">
      <Button variant="ghost" onClick={onBack}>
        <ChevronLeft className="size-4" aria-hidden="true" />
        Voltar para {article.moduleTitle}
      </Button>

      <div>
        <p className="tabular text-sm text-muted-foreground">
          Aula {position} de {total}
        </p>
        <h1 className="font-display text-2xl">{article.title}</h1>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="tabular">{article.durationMin} min</span>
        </div>
      </div>

      {videoUrl ? (
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-2xl border border-border bg-muted">
          <iframe
            src={videoUrl}
            title={`Vídeo da aula: ${article.title}`}
            className="size-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </AspectRatio>
      ) : (
        <Card className="items-center gap-2 p-8 text-center">
          <PlayCircle className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Esta aula ainda não tem vídeo.</p>
        </Card>
      )}

      {article.content && (
        <Card className="gap-2 p-5">
          <h2 className="font-display text-lg">Resumo da aula</h2>
          <p className="leading-relaxed text-muted-foreground">{article.content}</p>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {article.completed ? (
          <Button variant="outline" disabled className="sm:flex-1">
            <CheckCircle className="size-4" aria-hidden="true" />
            Aula concluída
          </Button>
        ) : (
          <Button onClick={onComplete} disabled={saving} className="sm:flex-1">
            {saving ? 'Salvando…' : 'Marcar como concluída'}
          </Button>
        )}
        {onNext && (
          <Button variant="secondary" onClick={onNext} className="sm:flex-1">
            Próxima aula
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
