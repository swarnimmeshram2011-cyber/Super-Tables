import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowLeft, Play } from 'lucide-react';

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
      // Auto confirm for single mode? Maybe wait for button to be explicit
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl font-bold text-kidBlue flex-1 text-center">{title}</h2>
      </div>

      <p className="text-center text-gray-600 mb-6 text-lg">
        {mode === 'SINGLE' ? 'Pick a table to start:' : 'Select tables to include in your test:'}
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
          const isSelected = selected.includes(num);
          return (
            <button
              key={num}
              onClick={() => toggleTable(num)}
              className={`aspect-square rounded-2xl text-2xl font-bold transition-all transform active:scale-95 shadow-md
                ${isSelected 
                  ? 'bg-kidBlue text-white ring-4 ring-blue-200 scale-105' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {mode === 'MULTI' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 text-center max-w-md mx-auto">
           <label className="block text-gray-700 font-bold mb-2">How many questions?</label>
           <div className="flex justify-center gap-4">
             {[10, 20, 50].map(count => (
               <button
                 key={count}
                 onClick={() => setQuestionCount(count)}
                 className={`px-4 py-2 rounded-xl font-bold ${questionCount === count ? 'bg-kidYellow text-white' : 'bg-gray-100 text-gray-600'}`}
               >
                 {count}
               </button>
             ))}
           </div>
        </div>
      )}

      <div className="text-center">
        <Button 
          size="lg" 
          variant="success" 
          onClick={handleStart}
          disabled={selected.length === 0}
          className={selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        >
           <Play className="mr-2" /> Start
        </Button>
      </div>
    </div>
  );
};