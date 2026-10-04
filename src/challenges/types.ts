import React from 'react';

export type ChallengeCategory = 
  | 'Events' 
  | 'Forms' 
  | 'UI Patterns' 
  | 'State & Hooks' 
  | 'Interview Essentials';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  component: React.ComponentType;
  code: string;
  tips: string[];
  interviewQuestions: InterviewQA[];
  testChecklist: string[];
}
