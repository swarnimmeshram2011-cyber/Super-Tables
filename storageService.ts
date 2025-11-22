import { UserProfile, WrongAnswer, TestResult, TableProgress, CertificateData, Question } from './types';

const KEYS = {
  PROFILE: 'st_profile',
  PROGRESS: 'st_progress',
  WRONG_ANSWERS: 'st_wrong',
  RESULTS: 'st_results',
  CERTIFICATES: 'st_certs',
  DAILY_STREAK: 'st_streak',
  LAST_DAILY_DATE: 'st_last_daily'
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Student',
  darkMode: false,
  soundEnabled: true,
  parentPin: '1234'
};

export const StorageService = {
  getProfile: (): UserProfile => {
    const stored = localStorage.getItem(KEYS.PROFILE);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },
  
  getProgress: (): TableProgress => {
    const stored = localStorage.getItem(KEYS.PROGRESS);
    return stored ? JSON.parse(stored) : {};
  },
  saveProgress: (tableId: number) => {
    const current = StorageService.getProgress();
    current[tableId] = true;
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(current));
  },

  getWrongAnswers: (): WrongAnswer[] => {
    const stored = localStorage.getItem(KEYS.WRONG_ANSWERS);
    return stored ? JSON.parse(stored) : [];
  },
  addWrongAnswer: (wa: WrongAnswer) => {
    const current = StorageService.getWrongAnswers();
    // Avoid exact duplicates
    const exists = current.some(c => c.num1 === wa.num1 && c.num2 === wa.num2);
    if (!exists) {
      current.push(wa);
      localStorage.setItem(KEYS.WRONG_ANSWERS, JSON.stringify(current));
    }
  },
  clearWrongAnswers: (questionsSolved: Question[]) => {
    let current = StorageService.getWrongAnswers();
    // Remove solved questions from the wrong list
    current = current.filter(w => !questionsSolved.some(s => s.num1 === w.num1 && s.num2 === w.num2));
    localStorage.setItem(KEYS.WRONG_ANSWERS, JSON.stringify(current));
  },

  getResults: (): TestResult[] => {
    const stored = localStorage.getItem(KEYS.RESULTS);
    return stored ? JSON.parse(stored) : [];
  },
  addResult: (result: TestResult) => {
    const current = StorageService.getResults();
    current.push(result);
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(current));
  },

  getCertificates: (): CertificateData[] => {
    const stored = localStorage.getItem(KEYS.CERTIFICATES);
    return stored ? JSON.parse(stored) : [];
  },
  addCertificate: (cert: CertificateData) => {
    const current = StorageService.getCertificates();
    if (!current.some(c => c.tableNumber === cert.tableNumber)) {
      current.push(cert);
      localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(current));
    }
  },

  getStreak: (): number => {
    const streak = parseInt(localStorage.getItem(KEYS.DAILY_STREAK) || '0');
    const lastDate = localStorage.getItem(KEYS.LAST_DAILY_DATE);
    if (!lastDate) return 0;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastDate === today) return streak;
    if (lastDate === yesterday) return streak;
    return 0; // Broken streak
  },
  incrementStreak: () => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(KEYS.LAST_DAILY_DATE);
    
    if (lastDate === today) return; // Already done today

    let current = StorageService.getStreak();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastDate === yesterday) {
      current++;
    } else {
      current = 1;
    }
    
    localStorage.setItem(KEYS.DAILY_STREAK, current.toString());
    localStorage.setItem(KEYS.LAST_DAILY_DATE, today);
  }
};