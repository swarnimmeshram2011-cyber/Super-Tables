import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowLeft, Play, Check } from 'lucide-react';

interface Props {
  mode: 'SINGLE' | 'MULTI';
  title: string;
  onBack: () => void;
  onConfirm: (tables: number[], questionCount?: number) => void;
}

export const TableSelectView: React.FC<Props> = ({ mode, title, onBack, onConfirm }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const toggleTable = (num: number) => {
    if (mode === 'SINGLE') {
      setSelected([num]);
    } else {
      if (selected.includes(num)) {
        setSelected(selected.filter(n => n !== num));
      } else {
        setSelected([...selected, num]);
      }
    }
  };

  const handleStart = () => {
    if (selected.length === 0) return;
    onConfirm(selected, mode === 'MULTI' ? questionCount : undefined);
  };

  // Colors for the bubbles
  const colors = [
    'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 
    'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 
    'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400', 
    'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 
    'bg-rose-400', 'bg-red-500', 'bg-orange-500', 'bg-blue-500'
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto h-full flex flex-col animate-pop-in">
      <div className="flex items-center mb-6">
        <Button variant="glass" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg flex-1 text-center font-display tracking-wide">
          {title}
        </h2>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border-4 border-white flex-1 flex flex-col">
        <p className="text-center text-gray-700 mb-6 text-xl font-bold">
          {mode === 'SINGLE' ? 'Tap a number bubble to begin!' : 'Tap bubbles to mix tables!'}
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 md:gap-4 mb-8 justify-items-center">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num, idx) => {
            const isSelected = selected.includes(num);
            const colorClass = colors[idx % colors.length];
            
            return (
              <button
                key={num}
                onClick={() => toggleTable(num)}
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-full text-2xl md:text-3xl font-black transition-all transform duration-300
                  flex items-center justify-center shadow-md border-4 border-white relative
                  ${isSelected 
                    ? `${colorClass} text-white scale-110 shadow-xl rotate-6 ring-4 ring-white` 
                    : 'bg-white text-gray-400 hover:bg-gray-50 hover:scale-105'
                  }
                `}
              >
                {num}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-white text-green-500 rounded-full p-1 shadow-sm">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {mode === 'MULTI' && (
          <div className="bg-white/80 p-6 rounded-3xl shadow-sm mb-8 text-center max-w-md mx-auto animate-pop-in">
             <label className="block text-gray-700 font-bold mb-3 text-lg">Number of Questions</label>
             <div className="flex justify-center gap-4">
               {[10, 20, 30, 50].map(count => (
                 <button
                   key={count}
                   onClick={() => setQuestionCount(count)}
                   className={`
                     px-4 py-2 rounded-xl font-bold transition-all
                     ${questionCount === count 
                       ? 'bg-kidBlue text-white scale-110 shadow-md' 
                       : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                     }
                   `}
                 >
                   {count}
                 </button>
               ))}
             </div>
          </div>
        )}

        <div className="mt-auto text-center pb-4">
          <Button 
            size="lg" 
            variant="success" 
            onClick={handleStart}
            disabled={selected.length === 0}
            className={`w-full max-w-xs mx-auto ${selected.length === 0 ? 'opacity-50 grayscale' : 'animate-bounce-short'}`}
          >
             <Play className="mr-2 fill-current" /> 
             {mode === 'SINGLE' ? 'Start Learning' : 'Start Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
};