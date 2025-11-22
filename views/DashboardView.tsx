import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StorageService } from '../storageService';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const DashboardView: React.FC<Props> = ({ onBack }) => {
  const progress = StorageService.getProgress();
  const certs = StorageService.getCertificates();
  const streak = StorageService.getStreak();
  const results = StorageService.getResults();

  // Prepare Chart Data: Accuracy per table (simulated from basic progress for simplicity, or results analysis)
  const tableStats = Array.from({ length: 20 }, (_, i) => {
    const tableId = i + 1;
    const isDone = progress[tableId];
    return {
      name: `${tableId}`,
      completed: isDone ? 100 : 0,
      fill: isDone ? '#10B981' : '#E5E7EB'
    };
  });

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl font-bold text-kidBlue flex-1 text-center">My Progress</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-100 p-6 rounded-2xl border-2 border-orange-200 text-center">
           <div className="text-4xl font-bold text-orange-600 mb-1">{certs.length}</div>
           <div className="text-sm text-orange-800 font-bold uppercase">Certificates</div>
        </div>
        <div className="bg-blue-100 p-6 rounded-2xl border-2 border-blue-200 text-center">
           <div className="text-4xl font-bold text-blue-600 mb-1">{streak}</div>
           <div className="text-sm text-blue-800 font-bold uppercase">Day Streak 🔥</div>
        </div>
        <div className="bg-purple-100 p-6 rounded-2xl border-2 border-purple-200 text-center">
           <div className="text-4xl font-bold text-purple-600 mb-1">{results.length}</div>
           <div className="text-sm text-purple-800 font-bold uppercase">Tests Taken</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8 h-80">
         <h3 className="text-xl font-bold text-gray-700 mb-4">Tables Mastery</h3>
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={tableStats}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="name" tick={{fontSize: 12}} />
             <YAxis hide />
             <Tooltip cursor={{fill: 'transparent'}} />
             <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
               {tableStats.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.fill} />
               ))}
             </Bar>
           </BarChart>
         </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h3>
        <div className="space-y-3">
           {results.slice(-5).reverse().map((r, idx) => (
             <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${r.score === r.total ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                   {r.score === r.total ? '🏆' : '📝'}
                 </div>
                 <div>
                   <div className="font-bold text-gray-700">{r.mode} Mode</div>
                   <div className="text-xs text-gray-400">{r.date}</div>
                 </div>
               </div>
               <div className="font-bold text-kidBlue">{r.score}/{r.total}</div>
             </div>
           ))}
           {results.length === 0 && (
             <div className="text-center text-gray-400 py-4">No quizzes taken yet. Go play!</div>
           )}
        </div>
      </div>
    </div>
  );
};