import { Module } from '../types';
import { Progress } from './ui/progress';
import { Calculator, TrendingUp, Globe, GraduationCap, ChevronRight } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

const iconMap: Record<string, any> = {
  Calculator,
  TrendingUp,
  Globe,
  GraduationCap,
};

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || Calculator;
  const progress = module.lessonsCount ? (module.completedLessons / module.lessonsCount) * 100 : 0;
  const isComplete = progress >= 100;

  return (
    <button
      type="button"
      onClick={onClick}
      className="surface-glass block w-full cursor-pointer rounded-2xl border border-border bg-card p-5 text-left transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-ring/40 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={`grid size-12 shrink-0 place-items-center rounded-xl border ${
            isComplete
              ? 'border-gain/30 bg-gain-soft text-gain'
              : 'border-info/25 bg-info-soft text-info'
          }`}
        >
          <Icon className="size-6" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 font-display text-lg">{module.title}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{module.description}</p>

          <Progress value={progress} className="mb-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="tabular text-muted-foreground">
              {module.completedLessons} de {module.lessonsCount} aulas
            </span>
            <span className={`tabular font-semibold ${isComplete ? 'text-gain' : 'text-info'}`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <ChevronRight className="size-5 shrink-0 self-center text-muted-foreground" aria-hidden="true" />
      </div>
    </button>
  );
}
