import { useState } from 'react';
import { ModuleCard } from '../ModuleCard';
import { LessonCard } from '../LessonCard';
import { Button } from '../ui/button';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import { modules, lessons } from '../../data/mockData';
import { Module } from '../../types';

export function LearnScreen() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const moduleLessons = selectedModule
    ? lessons.filter((lesson) => lesson.moduleId === selectedModule.id)
    : [];

  if (selectedModule) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setSelectedModule(null)}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para Módulos
        </Button>

        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">{selectedModule.title}</h1>
          <p className="text-slate-600">{selectedModule.description}</p>
        </div>

        <div className="space-y-3">
          {moduleLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => {
                // Lesson detail would open here
                alert(`Abrindo aula: ${lesson.title}`);
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <GraduationCap className="w-8 h-8 text-blue-700" />
        </div>
        <div>
          <h1 className="text-slate-900 mb-1">Aprender</h1>
          <p className="text-slate-600">Aprimore seus conhecimentos financeiros</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg mb-6">
        <h2 className="mb-2">Domine os Fundamentos</h2>
        <p className="text-blue-100 mb-4">
          Complete as aulas para melhorar suas estratégias e tomar decisões mais informadas nas competições.
        </p>
        <div className="bg-white/20 p-3 rounded">
          <div className="text-sm mb-1">Progresso Total</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: '53%' }}
              />
            </div>
            <span>53%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={() => setSelectedModule(module)}
          />
        ))}
      </div>
    </div>
  );
}
