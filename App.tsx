import React, { useState, useEffect } from 'react';
import { AppView, UserProfile } from './types';
import { StorageService } from './storageService';
import { Button } from './components/Button';

// Views
import { HomeView } from './views/HomeView';
import { LearnView } from './views/LearnView';
import { QuizView } from './views/QuizView';
import { DashboardView } from './views/DashboardView';
import { TableSelectView } from './views/TableSelectView';
import { TricksView } from './views/TricksView';
import { CertificatesView } from './views/CertificatesView';
import { ParentView } from './views/ParentView';
import { SettingsView } from './views/SettingsView';
import { MemoryView } from './views/MemoryView';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  
  // State for navigation/config
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [quizConfig, setQuizConfig] = useState<any>(null); // Using 'any' to simplify QuickView config pass
  
  // Load theme on mount
  useEffect(() => {
    if (profile.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [profile.darkMode]);

  const navigate = (v: AppView) => {
    setView(v);
    // Refresh profile in case it changed in settings
    setProfile(StorageService.getProfile());
  };

  const handleStartTest = (tables: number[], count?: number) => {
    setQuizConfig({
      mode: 'TEST',
      tables,
      questionCount: count || 10
    });
    setView(AppView.TEST_RUN);
  };

  const handleStartPractice = (tables: number[]) => {
    setQuizConfig({
      mode: 'PRACTICE',
      tables: tables,
      questionCount: undefined // Infinite
    });
    setView(AppView.TEST_RUN);
  };

  const handleLearn = (tables: number[]) => {
    setSelectedTables(tables); // Should be single
    setView(AppView.LEARN_DETAIL);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return <HomeView onNavigate={navigate} />;

      case AppView.LEARN_LIST:
        return (
          <TableSelectView 
            mode="SINGLE" 
            title="Choose a Table to Learn"
            onBack={() => navigate(AppView.HOME)}
            onConfirm={(tables) => handleLearn(tables)}
          />
        );

      case AppView.LEARN_DETAIL:
        return (
          <LearnView 
            tableId={selectedTables[0]} 
            userName={profile.name}
            onBack={() => navigate(AppView.LEARN_LIST)}
            onComplete={() => navigate(AppView.CERTIFICATES)} 
          />
        );

      case AppView.PRACTICE:
        return (
          <TableSelectView
            mode="SINGLE"
            title="Practice Mode"
            onBack={() => navigate(AppView.HOME)}
            onConfirm={(tables) => handleStartPractice(tables)}
          />
        );

      case AppView.TEST_CONFIG:
        return (
          <TableSelectView
            mode="MULTI"
            title="Configure Test"
            onBack={() => navigate(AppView.HOME)}
            onConfirm={(tables, count) => handleStartTest(tables, count)}
          />
        );

      case AppView.TEST_RUN:
        return (
          <QuizView 
            config={quizConfig} 
            onBack={() => navigate(AppView.HOME)}
            onFinish={() => navigate(AppView.HOME)}
          />
        );
      
      case AppView.SPEED_TEST:
        return (
          <QuizView 
            config={{
              mode: 'SPEED',
              tables: Array.from({length: 12}, (_, i) => i + 1), // 1-12 standard speed
              timeLimitSeconds: 60
            }}
            onBack={() => navigate(AppView.HOME)}
            onFinish={() => navigate(AppView.HOME)}
          />
        );

      case AppView.DAILY_CHALLENGE:
        return (
          <QuizView 
            config={{
              mode: 'DAILY',
              tables: Array.from({length: 12}, (_, i) => i + 1),
              questionCount: 10
            }}
            onBack={() => navigate(AppView.HOME)}
            onFinish={() => navigate(AppView.HOME)}
          />
        );

      case AppView.RETRY_WRONG:
        const wrongAnswers = StorageService.getWrongAnswers();
        if (wrongAnswers.length === 0) {
           return (
             <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pop-in">
               <div className="text-8xl mb-4">🎉</div>
               <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 font-display">Great Job!</h2>
               <p className="text-xl text-gray-600 mb-8 font-bold">You don't have any wrong answers saved.</p>
               <Button onClick={() => navigate(AppView.HOME)} size="lg">Go Home</Button>
             </div>
           );
        }
        return (
           <QuizView 
             config={{
               mode: 'RETRY',
               tables: [],
               questions: wrongAnswers
             }}
             onBack={() => navigate(AppView.HOME)}
             onFinish={() => navigate(AppView.HOME)}
           />
        );

      case AppView.TRICKS:
        return <TricksView onBack={() => navigate(AppView.HOME)} />;

      case AppView.CERTIFICATES:
        return <CertificatesView onBack={() => navigate(AppView.HOME)} />;

      case AppView.DASHBOARD:
        return <DashboardView onBack={() => navigate(AppView.HOME)} />;

      case AppView.PARENT_LOGIN:
      case AppView.PARENT_DASHBOARD:
        return <ParentView onBack={() => navigate(AppView.HOME)} />;

      case AppView.SETTINGS:
        return <SettingsView onBack={() => navigate(AppView.HOME)} />;

      case AppView.MEMORY_GAME:
        return <MemoryView onBack={() => navigate(AppView.HOME)} />;

      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;