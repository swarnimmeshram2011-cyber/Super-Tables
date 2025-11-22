import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Volume2, CheckCircle, ArrowLeft, Star } from 'lucide-react';
import { StorageService } from '../storageService';

interface Props {
  onBack: () => void;
  tableId: number;
  userName: string;
  onComplete: () => void;
}

export const LearnView: React.FC<Props> = ({ onBack, tableId, userName, onComplete }) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const handleSpeak = (num: number) => {
    if ('speechSynthesis' in window) {
      // Cancel previous speech
      window.speechSynthesis.cancel();
      
      const text = `${tableId} times ${num} is ${tableId * num}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Slightly higher pitch for kid-friendliness
      window.speechSynthesis.speak(utterance);
      setActiveRow(num);
    }
  };

  const handleMarkComplete = () => {
    StorageService.saveProgress(tableId);
    StorageService.addCertificate({
        id: Date.now().toString(),
        studentName: userName,
        tableNumber: tableId,
        dateEarned: new Date().toLocaleDateString()
    });
    
    // Check for Master Certificate (All 1-20)
    const progress = StorageService.getProgress();
    const allDone = Array.from({length: 20}, (_, i) => i + 1).every(n => progress[n] || n === tableId);
    
    if (allDone) {
        StorageService.addCertificate({
            id: 'MASTER-' + Date.now().toString(),
            studentName: userName,
            tableNumber: 'ALL',
            dateEarned: new Date().toLocaleDateString()
        });
    }

    onComplete();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto h-full flex flex-col animate-pop-in">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl font-bold text-blue-600 flex-1 text-center font-display drop-shadow-sm">
           The {tableId} Times Table
        </h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* List of equations */}
        <div className="flex-1 bg-white/80 backdrop-blur rounded-3xl shadow-xl overflow-y-auto border-4 border-white">
          <div className="grid gap-2 p-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <div 
                key={num}
                onClick={() => handleSpeak(num)}
                className={`
                  flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer transform
                  ${activeRow === num 
                    ? 'bg-yellow-100 ring-4 ring-yellow-400 scale-105 shadow-lg z-10' 
                    : 'hover:bg-blue-50 odd:bg-white even:bg-gray-50 hover:scale-102'}
                `}
              >
                <div className="text-2xl font-bold text-gray-700 font-mono tracking-wide">
                  {tableId} × {num} = <span className={`font-black ${activeRow === num ? 'text-blue-600 text-3xl' : 'text-gray-800'}`}>{tableId * num}</span>
                </div>
                <Volume2 className={`${activeRow === num ? 'text-blue-600' : 'text-gray-400'} transition-colors`} size={24} />
              </div>
            ))}
          </div>
        </div>

        {/* Visual Representation Panel */}
        <div className="hidden md:flex flex-1 flex-col">
           <div className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl border-4 border-white h-full flex flex-col items-center justify-center relative overflow-hidden">
              {activeRow ? (
                <div className="animate-pop-in w-full h-full flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-gray-500 mb-4">Visual Helper</h3>
                  <div className="text-5xl font-black text-blue-600 mb-8 font-mono">
                    {tableId} × {activeRow}
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 overflow-y-auto max-h-[400px] w-full">
                     <div className="flex flex-wrap justify-center gap-4">
                        {Array.from({length: tableId}).map((_, groupIdx) => (
                          <div key={groupIdx} className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm flex flex-wrap w-24 justify-center gap-1">
                             {Array.from({length: activeRow}).map((_, itemIdx) => (
                               <Star key={itemIdx} size={16} className="text-yellow-400 fill-yellow-400" />
                             ))}
                          </div>
                        ))}
                     </div>
                     <p className="text-center mt-4 text-gray-500 font-bold">
                       {tableId} groups of {activeRow} stars
                     </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                   <Star size={80} className="mx-auto mb-4 opacity-20" />
                   <p className="text-xl font-bold">Tap a row to see the magic!</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="mt-6 text-center pb-8">
        <Button variant="success" size="lg" onClick={handleMarkComplete} className="animate-bounce-short">
          <CheckCircle className="mr-2" />
          I Learned This Table!
        </Button>
      </div>
    </div>
  );
};