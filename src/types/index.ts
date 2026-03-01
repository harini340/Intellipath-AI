export interface Profile {
  id: string;
  full_name: string;
  education_level: string;
  career_goal: string;
  skill_assessment: {
    coding: number;
    aptitude: number;
    communication: number;
  };
  learning_preference: string;
  weekly_study_time: number;
  created_at: string;
}

export interface AssessmentResponse {
  id: string;
  user_id: string;
  category: 'coding' | 'aptitude' | 'communication';
  responses: any;
  score: number;
  created_at: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  roadmap: RoadmapStep[];
  strengths: string[];
  weaknesses: string[];
  difficulty_level: string;
  created_at: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[];
  completed: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  initial_code: string;
  test_cases: { input: string; expected: string }[];
}
