import { Lesson } from '../types';
import { CheckCircle, Circle, Clock, Play } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`surface-glass block w-full cursor-pointer rounded-2xl border p-4 text-left transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        lesson.completed
          ? 'border-gain/35 bg-gain-soft'
          : 'border-border bg-card hover:border-ring/40'
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`grid size-10 shrink-0 place-items-center rounded-full ${
            lesson.completed ? 'bg-gain text-gain-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          {lesson.completed ? <CheckCircle className="size-5" /> : <Circle className="size-5" />}
        </span>

        <div className="min-w-0 flex-1">
          <h4 className={`truncate font-display ${lesson.completed ? 'text-gain' : 'text-foreground'}`}>
            {lesson.title}
          </h4>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="tabular">{lesson.duration}</span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
            lesson.completed
              ? 'border border-border bg-secondary text-secondary-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <Play className="size-4" />
          {lesson.completed ? 'Revisar' : 'Assistir'}
        </span>
      </div>
    </button>
  );
}
