import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ModuleCard } from '../ModuleCard';
import { LessonCard } from '../LessonCard';
import { Button } from '../ui/button';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import { articleService, ArticleDetail } from '../../services/articleService';
import { Module } from '../../types';

export function LearnScreen() {
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { articleService.getAll().then((response) => setArticles(response.data)).catch(() => toast.error('Não foi possível carregar as aulas.')).finally(() => setLoading(false)); }, []);
  const modules = useMemo<Module[]>(() => Object.values(articles.reduce<Record<string, Module>>((grouped, article) => { const current = grouped[article.moduleId] || { id: article.moduleId, title: article.moduleTitle, description: 'Conteúdos financeiros para suas competições.', icon: 'GraduationCap', lessonsCount: 0, completedLessons: 0 }; current.lessonsCount += 1; if (article.completed) current.completedLessons += 1; grouped[article.moduleId] = current; return grouped; }, {})), [articles]);
  const moduleArticles = selectedModule ? articles.filter((article) => article.moduleId === selectedModule.id) : [];
  if (loading) return <div className="p-8 text-center text-slate-600">Carregando aulas...</div>;
  if (selectedModule) return <div className="max-w-4xl mx-auto p-4 pb-20"><Button variant="ghost" className="mb-4" onClick={() => setSelectedModule(null)}><ChevronLeft className="w-4 h-4 mr-2" />Voltar para módulos</Button><div className="mb-6"><h1 className="text-slate-900 mb-2">{selectedModule.title}</h1><p className="text-slate-600">{selectedModule.description}</p></div><div className="space-y-3">{moduleArticles.map((article) => <LessonCard key={article.id} lesson={{ id: article.id, moduleId: article.moduleId, title: article.title, duration: `${article.durationMin} min`, completed: article.completed }} onClick={async () => { if (!article.completed) { await articleService.complete(article.id); setArticles((current) => current.map((item) => item.id === article.id ? { ...item, completed: true } : item)); toast.success('Aula concluída!'); } else toast.info(article.content || 'Aula concluída.'); }} />)}</div></div>;
  return <div className="max-w-4xl mx-auto p-4 pb-20"><div className="flex items-center gap-3 mb-6"><div className="p-3 bg-blue-100 rounded-lg"><GraduationCap className="w-8 h-8 text-blue-700" /></div><div><h1 className="text-slate-900 mb-1">Aprender</h1><p className="text-slate-600">Aprimore seus conhecimentos financeiros</p></div></div>{modules.length ? <div className="space-y-4">{modules.map((module) => <ModuleCard key={module.id} module={module} onClick={() => setSelectedModule(module)} />)}</div> : <p className="text-slate-500">Nenhuma aula disponível.</p>}</div>;
}
