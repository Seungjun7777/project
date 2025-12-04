import React from 'react';
import { UserStats } from '../types';
import { Sprout, Flower, Trees, Sun, Cloud, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

interface GrowthGardenProps {
  stats: UserStats;
}

const GrowthGarden: React.FC<GrowthGardenProps> = ({ stats }) => {
  // Determine plant stage based on level
  const renderPlant = () => {
    if (stats.level < 3) {
      return <Sprout size={120} className="text-green-400 animate-bounce duration-[3000ms]" strokeWidth={1.5} />;
    } else if (stats.level < 7) {
      return <Flower size={120} className="text-pink-400 animate-pulse duration-[4000ms]" strokeWidth={1.5} />;
    } else {
      return <Trees size={120} className="text-green-600" strokeWidth={1.5} />;
    }
  };

  const nextLevelXp = stats.level * 100;
  const progressPercent = Math.min((stats.xp / nextLevelXp) * 100, 100);

  const weeklyData = [
    { name: '월', tasks: 2 },
    { name: '화', tasks: 4 },
    { name: '수', tasks: 3 },
    { name: '목', tasks: stats.tasksCompleted % 5 }, // Fake data for demo
    { name: '금', tasks: 0 },
    { name: '토', tasks: 0 },
    { name: '일', tasks: 0 },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-sm border border-white overflow-hidden min-h-[300px]">
        {/* Background Elements */}
        <div className="absolute top-4 right-8 text-yellow-400 animate-spin">
          <Sun size={48} />
        </div>
        <div className="absolute top-10 left-10 text-blue-200 animate-pulse">
          <Cloud size={32} />
        </div>

        {/* Plant */}
        <div className="z-10 mt-8 mb-4 transform transition-all duration-500 ease-in-out hover:scale-110">
          {renderPlant()}
        </div>
        
        {/* Stats */}
        <h2 className="text-2xl font-bold text-slate-700 z-10">Lv.{stats.level} 나의 정원</h2>
        <p className="text-slate-500 mb-4 z-10">누적 완료 미션: {stats.tasksCompleted}개</p>

        {/* XP Bar */}
        <div className="w-full max-w-xs bg-white rounded-full h-4 mb-2 z-10 shadow-inner">
          <div 
            className="bg-green-400 h-4 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 z-10">{stats.xp} / {nextLevelXp} XP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            주간 활동 리듬
           </h3>
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={weeklyData}>
                 <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#86efac' : '#4ade80'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">현재 연속 기록</h3>
            <div className="text-5xl font-bold text-indigo-500 mb-1">{stats.streak}일</div>
            <p className="text-sm text-slate-500">매일 조금씩 성장하고 있어요!</p>
        </div>
      </div>
    </div>
  );
};

export default GrowthGarden;