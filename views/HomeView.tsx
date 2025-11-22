import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { Button } from '../components/Button';
import { StorageService } from '../storageService';
import { BookOpen, Edit3, CheckSquare, RotateCcw, Zap, Calendar, Wand2, Award, BarChart2, Users, Settings, Gamepad2 } from 'lucide-react';

interface Props {
  onNavigate: (view: AppView) => void;
}

export const HomeView: React.FC<Props> = ({ onNavigate }) => {
  const [greeting, setGreeting] = useState('');
  const [name, setName] = useState('Friend');

  useEffect(() => {
    const profile = StorageService.getProfile();
    setName(profile.name);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const menuItems = [
    { label: 'Learn Tables', icon: BookOpen, view: AppView.LEARN_LIST, color: 'from-blue-400 to-blue-600', desc: 'Start Here!' },
    { label: 'Practice', icon: Edit3, view: AppView.PRACTICE, color: 'from-green-400 to-green-600', desc: 'Train Brain' },
    { label: 'Test Mode', icon: CheckSquare, view: AppView.TEST_CONFIG, color: 'from-purple-400 to-purple-600', desc: 'Get Score' },
    { label: 'Play Memory', icon: Gamepad2, view: AppView.MEMORY_GAME, color: 'from-pink-400 to-pink-600', desc: 'Match Cards' },
    { label: 'Speed Run', icon: Zap, view: AppView.SPEED_TEST, color: 'from-yellow-400 to-yellow-600', desc: 'Go Fast!' },
    { label: 'Daily Goal', icon: Calendar, view: AppView.DAILY_CHALLENGE, color: 'from-orange-400 to-orange-600', desc: 'Streak 🔥' },
    { label: 'Table Tricks', icon: Wand2, view: AppView.TRICKS, color: 'from-teal-400 to-teal-600', desc: 'Secrets 🤫' },
    { label: 'Awards', icon: Award, view: AppView.CERTIFICATES, color: 'from-indigo-400 to-indigo-600', desc: 'Trophies' },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto animate-pop-in">
      {/* Hero Section */}
      <header className="text-center mb-10 py-8 bg-white/60 backdrop-blur-md rounded-[3rem] shadow-xl border-4 border-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-500 mb-2">{greeting}, {name}! 👋</h2>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-sm" style={{ fontFamily: 'Fredoka One, cursive' }}>
            Super Tables
          </h1>
          <p className="text-xl text-gray-600 mt-2 font-medium">Let's become a Math Wizard today!</p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 px-2">
        {menuItems.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            style={{ animationDelay: `${idx * 50}ms` }}
            className={`
              bg-gradient-to-br ${item.color} 
              text-white p-6 rounded-3xl shadow-lg border-b-8 border-black/10
              transform transition-all duration-200 hover:scale-105 hover:-translate-y-2 active:scale-95 active:border-b-0 active:translate-y-2
              flex flex-col items-center text-center h-48 justify-center relative overflow-hidden group animate-pop-in
            `}
          >
             {/* Background shine */}
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
             
             <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm shadow-inner group-hover:rotate-12 transition-transform duration-300">
               <item.icon size={36} strokeWidth={2.5} />
             </div>
             
             <div className="font-black text-xl leading-tight tracking-tight shadow-black/20 drop-shadow-md">{item.label}</div>
             <div className="text-sm font-medium opacity-90 mt-2 bg-black/10 px-3 py-1 rounded-full">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center gap-4 max-w-lg mx-auto mb-8">
        <Button variant="glass" className="flex-1 flex-col py-4 gap-1" onClick={() => onNavigate(AppView.RETRY_WRONG)}>
          <RotateCcw className="text-red-500" />
          <span className="text-xs font-bold text-gray-600">Fix Mistakes</span>
        </Button>
        <Button variant="glass" className="flex-1 flex-col py-4 gap-1" onClick={() => onNavigate(AppView.DASHBOARD)}>
          <BarChart2 className="text-blue-500" />
          <span className="text-xs font-bold text-gray-600">My Stats</span>
        </Button>
        <Button variant="glass" className="flex-1 flex-col py-4 gap-1" onClick={() => onNavigate(AppView.PARENT_LOGIN)}>
          <Users className="text-purple-500" />
          <span className="text-xs font-bold text-gray-600">Parents</span>
        </Button>
        <Button variant="glass" className="flex-1 flex-col py-4 gap-1" onClick={() => onNavigate(AppView.SETTINGS)}>
          <Settings className="text-gray-500" />
          <span className="text-xs font-bold text-gray-600">Settings</span>
        </Button>
      </div>
    </div>
  );
};