import { useEffect, useState } from 'react';
import { ModuleCard } from '../ModuleCard';
import { LessonCard } from '../LessonCard';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { articleService } from '../../services/articleService';
import { Module, Lesson } from '../../types';
import { toast } from 'sonner';

export function LearnScreen() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoadingModules(true);
        const res = await articleService.getModules();
        setModules(res.data);
      } catch {
        setError('Não foi possível carregar os módulos. Tente novamente.');
      } finally {
        setIsLoadingModules(false);
      }
    };
    fetchModules();
  }, []);

  const handleSelectModule = async (mod: Module) => {
    setSelectedModule(mod);
    setIsLoadingLessons(true);
    try {
      const res = await articleService.getLessons(mod.id);
      setLessons(res.data);
    } catch {
      toast.error('Não foi possível carregar as lições deste módulo.');
      setLessons([]);
    } finally {
      setIsLoadingLessons(false);
    }
  };

  const handleCompleteLesson = async (lesson: Lesson) => {
    if (lesson.completed) return;
    try {
      await articleService.complete(lesson.id);
      setLessons(prev =>
        prev.map(l => (l.id === lesson.id ? { ...l, completed: true } : l))
      );
      if (selectedModule) {
        setModules(prev =>
          prev.map(m =>
            m.id === selectedModule.id
              ? { ...m, completedLessons: m.completedLessons + 1 }
              : m
          )
        );
      }
      toast.success(`Lição "${lesson.title}" concluída!`);
    } catch {
      toast.error('Não foi possível registrar a conclusão. Tente novamente.');
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessonsCount, 0);
  const completedLessons = modules.reduce((sum, m) => sum + m.completedLessons, 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (isLoadingModules) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600">Carregando módulos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-slate-700 text-center">{error}</p>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => {
            setSelectedModule(null);
            setLessons([]);
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para Módulos
        </Button>

        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">{selectedModule.title}</h1>
          <p className="text-slate-600">{selectedModule.description}</p>
        </div>

        {isLoadingLessons ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-slate-600 text-sm">Carregando lições...</p>
          </div>
        ) : lessons.length > 0 ? (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => handleCompleteLesson(lesson)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center bg-slate-50 border-dashed">
            <p className="text-slate-600">Nenhuma lição encontrada neste módulo.</p>
          </Card>
        )}
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
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>

      {modules.length > 0 ? (
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => handleSelectModule(module)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center bg-slate-50 border-dashed">
          <p className="text-slate-600">Nenhum módulo disponível ainda.</p>
        </Card>
      )}
    </div>
  );
}
