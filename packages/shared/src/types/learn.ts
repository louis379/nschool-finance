export interface LearningModule {
  id: string;
  title: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5;
  icon: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content_type: 'article' | 'quiz' | 'interactive';
  duration_minutes: number;
  order: number;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  module_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  completed_at: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'trading' | 'finance' | 'streak';
  condition: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}
