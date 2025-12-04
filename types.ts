export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'study' | 'life' | 'social' | 'health';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  HABITS = 'HABITS',
  GARDEN = 'GARDEN',
  CHAT = 'CHAT',
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  tasksCompleted: number;
}