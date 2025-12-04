import React, { useState } from 'react';
import { Task, AppView, UserStats } from './types';
import MicroHabits from './components/MicroHabits';
import GrowthGarden from './components/GrowthGarden';
import MindfulChat from './components/MindfulChat';
import { LayoutGrid, Sprout, MessageCircle, Menu, X, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HABITS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // App State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    streak: 3,
    tasksCompleted: 12
  });

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleting = !t.completed;
        if (isCompleting) {
          // Add XP and Stats logic
          const xpGain = t.difficulty === 'hard' ? 30 : t.difficulty === 'medium' ? 20 : 10;
          setStats(s => {
            const newXp = s.xp + xpGain;
            const levelUp = newXp >= s.level * 100;
            return {
              ...s,
              xp: levelUp ? newXp - (s.level * 100) : newXp,
              level: levelUp ? s.level + 1 : s.level,
              tasksCompleted: s.tasksCompleted + 1
            };
          });
        } else {
             // Revert stats logic if unchecked (simplified)
             const xpLoss = t.difficulty === 'hard' ? 30 : t.difficulty === 'medium' ? 20 : 10;
             setStats(s => ({
                 ...s,
                 xp: Math.max(0, s.xp - xpLoss),
                 tasksCompleted: Math.max(0, s.tasksCompleted - 1)
             }));
        }
        return { ...t, completed: isCompleting };
      }
      return t;
    }));
  };

  const handleAddTasks = (newTasks: Task[]) => {
    setTasks(prev => [...prev, ...newTasks]);
    // Switch to habits view if generated elsewhere
    setCurrentView(AppView.HABITS);
  };

  const NavItem = ({ view, icon, label }: { view: AppView, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 z-20">
        <div className="flex items-center gap-2 mb-10 text-indigo-600">
          <Leaf size={28} />
          <h1 className="text-2xl font-bold tracking-tight">ReBloom</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem view={AppView.HABITS} icon={<LayoutGrid size={20} />} label="오늘의 미션" />
          <NavItem view={AppView.GARDEN} icon={<Sprout size={20} />} label="성장 정원" />
          <NavItem view={AppView.CHAT} icon={<MessageCircle size={20} />} label="마음 코칭" />
        </nav>

        <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">현재 레벨</p>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700">Lv.{stats.level}</span>
            <span className="text-xs text-indigo-500 font-medium">{Math.floor(stats.xp)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${(stats.xp / (stats.level * 100)) * 100}%` }}></div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 p-4 z-30 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <Leaf size={24} />
          <span className="font-bold text-lg">ReBloom</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-20 pt-20 px-6 md:hidden">
           <nav className="space-y-4">
            <NavItem view={AppView.HABITS} icon={<LayoutGrid size={20} />} label="오늘의 미션" />
            <NavItem view={AppView.GARDEN} icon={<Sprout size={20} />} label="성장 정원" />
            <NavItem view={AppView.CHAT} icon={<MessageCircle size={20} />} label="마음 코칭" />
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative pt-16 md:pt-0">
        <div className="h-full max-w-5xl mx-auto p-4 md:p-8">
            {currentView === AppView.HABITS && (
                <div className="h-full animate-fade-in">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">환영합니다!</h2>
                        <p className="text-slate-500">오늘도 작은 한 걸음부터 시작해볼까요?</p>
                    </div>
                    <div className="h-[calc(100%-80px)]">
                        <MicroHabits tasks={tasks} onToggleTask={handleToggleTask} onAddTasks={handleAddTasks} />
                    </div>
                </div>
            )}

            {currentView === AppView.GARDEN && (
                <div className="h-full animate-fade-in">
                     <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">나의 성장 정원</h2>
                        <p className="text-slate-500">당신의 노력이 아름답게 피어나고 있어요.</p>
                    </div>
                    <div className="h-[calc(100%-80px)] overflow-y-auto">
                        <GrowthGarden stats={stats} />
                    </div>
                </div>
            )}

            {currentView === AppView.CHAT && (
                <div className="h-full animate-fade-in flex flex-col">
                     <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-800">AI 마음 코치</h2>
                        <p className="text-slate-500">혼자 고민하지 마세요. 언제든 들어드릴게요.</p>
                    </div>
                    <div className="flex-1 h-full min-h-0">
                        <MindfulChat />
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;