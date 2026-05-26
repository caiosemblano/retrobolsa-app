import { Module } from '../types';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Calculator, TrendingUp, Globe, ChevronRight } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

const iconMap: Record<string, any> = {
  Calculator,
  TrendingUp,
  Globe,
};

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || Calculator;
  const progress = (module.completedLessons / module.lessonsCount) * 100;

  return (
    <Card
      className="p-5 cursor-pointer hover:bg-slate-50 transition-all border-2 hover:border-blue-300"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-700" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-slate-900 mb-2">{module.title}</h3>
          <p className="text-slate-600 mb-3">{module.description}</p>
          
          <div className="mb-2">
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {module.completedLessons} de {module.lessonsCount} aulas
            </span>
            <span className="text-blue-600">
              {Math.round(progress)}% completo
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </Card>
  );
}
