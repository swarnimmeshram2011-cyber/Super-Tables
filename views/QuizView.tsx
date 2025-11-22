import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { Question, WrongAnswer, TestResult } from '../types';
import { StorageService } from '../storageService';
import { ArrowLeft, Clock, Star, RefreshCw, Sparkles, XCircle, CheckCircle } from 'lucide-react';

interface QuizConfig {
  mode: 'PRACTICE' | 'TEST' | 'SPEED' | 'DAILY' | 'RETRY';
  tables: number[];
  questionCount?: number; // Infinite if undefined
  timeLimitSeconds?: number;
  questions?: Question[]; // Pre-provided questions (for retry/daily)
}

interface Props {
  config: QuizConfig;
  onBack: () => void;
  onFinish: () => void;
}

export const QuizView: React.FC<Props> = ({ config, onBack, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(config.timeLimitSeconds || null);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  
  const timerRef = useRef<any>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  // Initialize Quiz
  useEffect(() => {
    generateQuestion();
    
    if (config.timeLimitSeconds) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            endQuiz();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const generateQuestion = () => {
    // If using pre-set questions (Retry / Daily)
    if (config.questions) {
      if (totalAnswered >= config.questions.length) {
        endQuiz();
        return;
      }
      setCurrentQuestion(config.questions[totalAnswered]);
      return;
    }

    // If limited count test
    if (config.questionCount && totalAnswered >= config.questionCount) {
      endQuiz();
      return;
    }

    // Generate Random Question based on tables
    const table = config.tables[Math.floor(Math.random() * config.tables.length)];
    const num = Math.floor(Math.random() * 12) + 1;
    setCurrentQuestion({ num1: table, num2: num, answer: table * num });
  };

  const endQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowResult(true);

    // Save Result
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    if (config.mode !== 'PRACTICE') {
      const result: TestResult = {
        date: new Date().toLocaleDateString(),
        score: score,
        total: totalAnswered,
        mode: config.mode,
        timeTakenSeconds: timeTaken
      };
      StorageService.addResult(result);

      if (config.mode === 'DAILY') {
        StorageService.incrementStreak();
      }

      // Update Streak for Speed Test if needed
      if (config.mode === 'SPEED') {
        // Logic for best speed could go here
      }
    }

    // If Retry mode, clear the corrected wrong answers from storage
    if (config.mode === 'RETRY') {
       // Find which questions were answered correctly this time
       // This is a simplified approach; normally we'd track exactly which ID was fixed
       // For now, we can just clear all if score is 100%, or implement specific removal in StorageService
       if (score === totalAnswered) {
         StorageService.clearWrongAnswers(config.questions || []);
       }
    }
  };

  const handleSubmit = () => {
    if (!currentQuestion || !input) return;

    const val = parseInt(input);
    const isCorrect = val === currentQuestion.answer;

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('CORRECT');
      // Play sound
      playSound('correct');
    } else {
      setFeedback('WRONG');
      playSound('wrong');
      
      // Save wrong answer
      if (config.mode !== 'PRACTICE' && config.mode !== 'RETRY') {
        StorageService.addWrongAnswer({
          ...currentQuestion,
          userAnswer: val,
          timestamp: Date.now()
        });
      }
      setWrongAnswers(prev => [...prev, { ...currentQuestion, userAnswer: val, timestamp: Date.now() }]);
    }

    // Wait then next question
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setTotalAnswered(t => t + 1);
      generateQuestion();
    }, 1500);
  };

  const playSound = (type: 'correct' | 'wrong') => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  };

  const handleNumPad = (num: number) => {
    if (input.length < 4) setInput(prev => prev + num.toString());
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  if (showResult) {
    const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    let message = "Good Try!";
    if (percentage === 100) message = "Perfect Score! 🌟";
    else if (percentage >= 80) message = "Awesome Job! 🚀";
    else if (percentage >= 50) message = "Keep Practicing! 💪";

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 animate-pop-in">
        <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-2xl border-4 border-white text-center max-w-lg w-full">
           <div className="mb-6 text-6xl animate-bounce-short">
             {percentage >= 80 ? '🏆' : '🎯'}
           </div>
           <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 font-display">
             Quiz Complete!
           </h2>
           <p className="text-xl text-gray-500 font-bold mb-6">{message}</p>

           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-100 p-4 rounded-2xl border-2 border-green-200">
                <div className="text-xs text-green-600 font-bold uppercase">Score</div>
                <div className="text-3xl font-black text-green-700">{score}/{totalAnswered}</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl border-2 border-blue-200">
                <div className="text-xs text-blue-600 font-bold uppercase">Accuracy</div>
                <div className="text-3xl font-black text-blue-700">{percentage}%</div>
              </div>
           </div>

           <Button variant="primary" size="lg" onClick={onFinish} className="w-full">
             <CheckCircle className="mr-2" /> Done
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="glass" size="sm" onClick={onBack}>
           <ArrowLeft /> Exit
        </Button>
        {timeLeft !== null && (
          <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-xl ${timeLeft < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-blue-600'}`}>
             <Clock size={20} /> {timeLeft}s
          </div>
        )}
        <div className="font-bold text-gray-600 bg-white/50 px-3 py-1 rounded-lg">
           {totalAnswered + 1} / {config.questionCount || '∞'}
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col justify-center mb-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden border-4 border-white">
           {feedback && (
             <div className={`absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm bg-white/30 animate-pop-in`}>
                <div className={`text-6xl font-black ${feedback === 'CORRECT' ? 'text-green-500 drop-shadow-lg' : 'text-red-500 drop-shadow-lg'}`}>
                  {feedback === 'CORRECT' ? 'AWESOME!' : `ANSWER: ${currentQuestion?.answer}`}
                </div>
             </div>
           )}

           <div className="text-gray-400 font-bold text-xl mb-4 uppercase tracking-widest">Solve This</div>
           <div className="flex items-center justify-center gap-4 text-6xl md:text-7xl font-black text-gray-800 font-mono mb-8">
              <span>{currentQuestion?.num1}</span>
              <span className="text-kidBlue">×</span>
              <span>{currentQuestion?.num2}</span>
           </div>

           {/* Input Display */}
           <div className={`
              h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-5xl font-black border-4 transition-colors
              ${feedback === 'CORRECT' ? 'border-green-400 bg-green-50 text-green-600' : 
                feedback === 'WRONG' ? 'border-red-400 bg-red-50 text-red-600' : 
                'border-blue-200 text-gray-800'}
           `}>
              {input}<span className="animate-pulse text-blue-300">|</span>
           </div>
        </div>
      </div>

      {/* Custom Numpad */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] rounded-xl py-4 text-3xl font-bold text-blue-600 transition-all hover:bg-blue-50"
            onClick={() => handleNumPad(num)}
            disabled={feedback !== null}
          >
            {num}
          </button>
        ))}
        <button 
          className="bg-red-100 shadow-[0_4px_0_0_rgba(220,38,38,0.1)] active:shadow-none active:translate-y-[4px] rounded-xl py-4 flex items-center justify-center text-red-500 font-bold transition-all hover:bg-red-200"
          onClick={handleBackspace}
          disabled={feedback !== null}
        >
          <XCircle size={32} />
        </button>
        <button 
          className="bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] rounded-xl py-4 text-3xl font-bold text-blue-600 transition-all hover:bg-blue-50"
          onClick={() => handleNumPad(0)}
          disabled={feedback !== null}
        >
          0
        </button>
        <button 
          className="bg-green-500 shadow-[0_4px_0_0_rgba(21,128,61,0.3)] active:shadow-none active:translate-y-[4px] rounded-xl py-4 flex items-center justify-center text-white font-bold transition-all hover:bg-green-600"
          onClick={handleSubmit}
          disabled={feedback !== null || input === ''}
        >
          <CheckCircle size={32} />
        </button>
      </div>
    </div>
  );
};