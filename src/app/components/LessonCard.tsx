import { Lesson } from '../types';
import { Card } from './ui/card';
import { CheckCircle, Circle, Clock, Play } from 'lucide-react';
import { Button } from './ui/button';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        lesson.completed
          ? 'bg-green-50 border-green-200 hover:bg-green-100'
          : 'hover:bg-slate-50 border-slate-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          lesson.completed ? 'bg-green-600' : 'bg-slate-200'
        }`}>
          {lesson.completed ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <Circle className="w-6 h-6 text-slate-500" />
          )}
        </div>

        <div className="flex-1">
          <h4 className={lesson.completed ? 'text-green-900' : 'text-slate-900'}>
            {lesson.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-slate-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration}</span>
          </div>
        </div>

        <Button
          variant={lesson.completed ? 'secondary' : 'default'}
          size="sm"
          className={lesson.completed ? '' : 'bg-orange-500 hover:bg-orange-600'}
        >
          <Play className="w-4 h-4 mr-1" />
          {lesson.completed ? 'Revisar' : 'Assistir'}
        </Button>
      </div>
    </Card>
  );
}
