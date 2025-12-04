import React, { useState } from 'react';
import { Task } from '../types';
import { generateMicroTasks } from '../services/geminiService';
import { CheckCircle2, Circle, Plus, RefreshCw, BookOpen, Coffee, Users, Heart } from 'lucide-react';

interface MicroHabitsProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTasks: (newTasks: Task[]) => void;
}

const MicroHabits: React.FC<MicroHabitsProps> = ({ tasks, onToggleTask, onAddTasks }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'study' | 'life' | 'social' | 'health'>('study');
  const [userMood, setUserMood] = useState('평범함');

  const handleGenerateTasks = async () => {
    setLoading(true);
    const generated = await generateMicroTasks(selectedCategory, userMood);
    
    const newTasks: Task[] = generated.map((t, idx) => {
      // Validate difficulty type safely
      const validDifficulty = ['easy', 'medium', 'hard'].includes(t.difficulty) 
        ? (t.difficulty as 'easy' | 'medium' | 'hard') 
        : 'easy';

      return {
        id: Date.now().toString() + idx,
        text: t.text,
        completed: false,
        category: selectedCategory,
        difficulty: validDifficulty
      };
    });
    
    onAddTasks(newTasks);
    setLoading(false);
  };

  const categories = [
    { id: 'study', label: '공부/학습', icon: <BookOpen size={18} />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'life', label: '생활 습관', icon: <Coffee size={18} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'social', label: '사회 연결', icon: <Users size={18} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'health', label: '몸 마음 건강', icon: <Heart size={18} />, color: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">오늘의 작은 발걸음</h2>
        
        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                selectedCategory === cat.id 
                ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.icon}
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* AI Generator Control */}
        <div className="bg-slate-50 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <input 
                type="text" 
                placeholder="지금 기분이 어떤가요? (예: 조금 무기력해)"
                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-full"
                value={userMood}
                onChange={(e) => setUserMood(e.target.value)}
            />
            <button 
                onClick={handleGenerateTasks}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
            >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                <span>AI 미션 받기</span>
            </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {tasks.length === 0 ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                <p>아직 등록된 미션이 없어요.</p>
                <p className="text-sm mt-2">'AI 미션 받기'를 눌러 시작해보세요!</p>
            </div>
        ) : (
            tasks.map((task) => (
            <div 
                key={task.id} 
                onClick={() => onToggleTask(task.id)}
                className={`group flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                task.completed 
                    ? 'bg-slate-50 border-slate-100 opacity-60' 
                    : 'bg-white border-slate-100 hover:border-indigo-200'
                }`}
            >
                <div className="flex items-center gap-4">
                <div className={`transition-colors duration-300 ${task.completed ? 'text-green-500' : 'text-slate-300 group-hover:text-indigo-400'}`}>
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div>
                    <p className={`text-base font-medium transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.text}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        task.category === 'study' ? 'bg-indigo-50 text-indigo-500' :
                        task.category === 'life' ? 'bg-orange-50 text-orange-500' :
                        task.category === 'social' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'
                    }`}>
                    {task.category === 'study' ? '공부' : 
                     task.category === 'life' ? '생활' : 
                     task.category === 'social' ? '관계' : '건강'}
                    </span>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MicroHabits;