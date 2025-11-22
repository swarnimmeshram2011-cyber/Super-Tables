export enum AppView {
  HOME = 'HOME',
  LEARN_LIST = 'LEARN_LIST',
  LEARN_DETAIL = 'LEARN_DETAIL',
  PRACTICE = 'PRACTICE',
  TEST_CONFIG = 'TEST_CONFIG',
  TEST_RUN = 'TEST_RUN',
  TEST_RESULT = 'TEST_RESULT',
  SPEED_TEST = 'SPEED_TEST',
  DAILY_CHALLENGE = 'DAILY_CHALLENGE',
  RETRY_WRONG = 'RETRY_WRONG',
  TRICKS = 'TRICKS',
  CERTIFICATES = 'CERTIFICATES',
  DASHBOARD = 'DASHBOARD',
  PARENT_LOGIN = 'PARENT_LOGIN',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD',
  SETTINGS = 'SETTINGS',
  MEMORY_GAME = 'MEMORY_GAME',
}

export interface UserProfile {
  name: string;
  darkMode: boolean;
  soundEnabled: boolean;
  parentPin: string;
}

export interface Question {
  num1: number;
  num2: number;
  answer: number;
}

export interface WrongAnswer extends Question {
  userAnswer: number;
  timestamp: number;
}

export interface TestResult {
  date: string;
  score: number;
  total: number;
  mode: 'TEST' | 'SPEED' | 'DAILY' | 'RETRY' | 'PRACTICE';
  timeTakenSeconds: number;
}

export interface TableProgress {
  [key: number]: boolean; // table number -> completed status
}

export interface CertificateData {
  id: string;
  studentName: string;
  tableNumber: number | 'ALL'; // 'ALL' for master certificate
  dateEarned: string;
}