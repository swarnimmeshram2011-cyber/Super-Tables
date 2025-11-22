import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { Question, WrongAnswer, TestResult } from '../types';
import { StorageService } from '../storageService';
import { ArrowLeft, Clock, Award, RefreshCw } from 'lucide-react';

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
  const [startTime] = useState(Date.now());
  
  // For Retry Mode tracking
  const [solvedWrongQuestions, setSolvedWrongQuestions] = useState<Question[]>([]);

  const timerRef = useRef<number | undefined>(undefined);

  // Generate a random question based on tables
  const generateQuestion = (): Question => {
    const table = config.tables[Math.floor(Math.random() * config.tables.length)];
    const multiplier = Math.floor(Math.random() * 12) + 1;
    return { num1: table, num2: multiplier, answer: table * multiplier };
  };

  // Initialize
  useEffect(() => {
    if (config.questions && config.questions.length > 0) {
      setCurrentQuestion(config.questions[0]);
    } else {
      setCurrentQuestion(generateQuestion());
    }

    if (config.timeLimitSeconds) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(timerRef.current);
            finishQuiz();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishQuiz = () => {
    setShowResult(true);
    clearInterval(timerRef.current);
    
    // Save Result
    const resultData: TestResult = {
      date: new Date().toLocaleDateString(),
      score: score,
      total: totalAnswered,
      mode: config.mode,
      timeTakenSeconds: (Date.now() - startTime) / 1000
    };
    StorageService.addResult(resultData);
    
    if (config.mode === 'DAILY') {
      StorageService.incrementStreak();
    }

    if (config.mode === 'RETRY') {
        StorageService.clearWrongAnswers(solvedWrongQuestions);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentQuestion || feedback) return;

    const userVal = parseInt(input);
    const isCorrect = userVal === currentQuestion.answer;

    if (isCorrect) {
      setFeedback('CORRECT');
      setScore(s => s + 1);
      playSound('success');
      if (config.mode === 'RETRY') {
          setSolvedWrongQuestions(prev => [...prev, currentQuestion]);
      }
    } else {
      setFeedback('WRONG');
      playSound('error');
      // Save wrong answer
      const wa: WrongAnswer = {
        ...currentQuestion,
        userAnswer: userVal,
        timestamp: Date.now()
      };
      StorageService.addWrongAnswer(wa);
    }

    setTotalAnswered(t => t + 1);

    // Next Question logic
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      
      if (config.questions) {
        // Fixed list mode (Daily/Retry)
        if (totalAnswered + 1 >= config.questions.length) {
          finishQuiz();
        } else {
          setCurrentQuestion(config.questions[totalAnswered + 1]);
        }
      } else if (config.questionCount && totalAnswered + 1 >= config.questionCount) {
        // Limited random mode
        finishQuiz();
      } else {
        // Infinite or timed mode
        if (timeLeft === 0) return; 
        setCurrentQuestion(generateQuestion());
      }
    }, isCorrect ? 1000 : 2500); // Longer delay for wrong answers to see correction
  };

  const playSound = (type: 'success' | 'error') => {
    const profile = StorageService.getProfile();
    if (!profile.soundEnabled) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  };

  if (showResult) {
    const percentage = totalAnswered === 0 ? 0 : Math.round((score / totalAnswered) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full animate-fade-in">
        <h2 className="text-4xl font-bold text-kidBlue mb-8">
          {config.mode === 'SPEED' ? "Time's Up!" : "Quiz Complete!"}
        </h2>
        
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-md border-4 border-kidYellow">
          <div className="text-6xl font-bold text-kidPurple mb-4">{score} / {totalAnswered}</div>
          <div className={`text-2xl font-bold mb-8 ${percentage >= 80 ? 'text-kidGreen' : 'text-kidRed'}`}>
             {percentage}% Accuracy
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">
            {percentage === 100 ? "PERFECT! You are a math wizard! 🧙‍♂️" : 
             percentage >= 80 ? "Great job! Keep practicing! 🚀" : 
             "Don't give up! Try again! 💪"}
          </p>

          <div className="space-y-4">
            <Button variant="primary" size="lg" onClick={onFinish}>Return Home</Button>
            {percentage < 100 && config.mode === 'TEST' && (
               <Button variant="secondary" onClick={onFinish}>Try Retry Mode later</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="p-10 text-center text-2xl">Loading Quiz...</div>;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>Exit</Button>
        {config.timeLimitSeconds && (
           <div className={`flex items-center gap-2 text-2xl font-bold font-mono px-4 py-2 rounded-xl ${timeLeft! < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
             <Clock size={24} /> {timeLeft}s
           </div>
        )}
        <div className="text-xl font-bold text-gray-500">
            Score: {score}
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center items-center">
         <div className="w-full bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center border-b-8 border-gray-200 relative overflow-hidden">
            {feedback === 'CORRECT' && (
               <div className="absolute inset-0 bg-green-100 flex items-center justify-center z-10 animate-bounce">
                 <span className="text-6xl font-bold text-green-600">Correct! 🎉</span>
               </div>
            )}
            {feedback === 'WRONG' && (
               <div className="absolute inset-0 bg-red-100 flex flex-col items-center justify-center z-10">
                 <span className="text-4xl font-bold text-red-600 mb-2">Oops! 😅</span>
                 <span className="text-2xl text-gray-700">
                    {currentQuestion.num1} × {currentQuestion.num2} = <b>{currentQuestion.answer}</b>
                 </span>
               </div>
            )}

            <div className="text-gray-500 text-xl mb-4 uppercase tracking-widest font-bold">Solve this</div>
            <div className="text-7xl font-bold text-gray-800 font-mono mb-2">
               {currentQuestion.num1} × {currentQuestion.num2}
            </div>
            <div className="text-6xl text-gray-300">= ?</div>
         </div>

         {/* Numpad / Input */}
         <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <input 
               type="number" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               className="w-full text-center text-5xl p-4 rounded-2xl border-4 border-kidBlue focus:border-kidYellow outline-none mb-4 font-mono"
               placeholder="?"
               autoFocus
               readOnly={!!feedback} // Lock input during feedback
            />
            <Button type="submit" size="lg" disabled={!input || !!feedback} className="w-full shadow-lg">
               Check Answer
            </Button>
         </form>
      </div>
    </div>
  );
};