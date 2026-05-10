export type UserRole = "student" | "admin";

export type ProblemCategory =
  | "Arrays"
  | "Strings"
  | "Trees"
  | "Graphs"
  | "Dynamic Programming"
  | "Greedy"
  | "Recursion";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type SqlCategory =
  | "Window Functions"
  | "Joins"
  | "Ranking"
  | "Aggregations"
  | "Subqueries";

export type MockTestType = "hr" | "technical" | "aptitude";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  /** Saved LeetCode handle for profile link (LeetCode does not support “login with LC” OAuth for arbitrary sites). */
  leetcode_username?: string | null;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Problem {
  id: string;
  category: ProblemCategory;
  title: string;
  slug: string | null;
  difficulty: Difficulty;
  /** Short teaser shown in lists */
  description: string | null;
  /** Full interview-style articulation (omit until migration/seed ran) */
  problem_statement?: string | null;
  input_format?: string | null;
  output_format?: string | null;
  sample_io?: string | null;
  constraints_text?: string | null;
  /** When absent and `slug` matches LC slug, UI derives canonical URL */
  leetcode_url?: string | null;
  interviewer_tips?: string | null;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  problem_id: string;
  solved: boolean;
  notes: string | null;
  updated_at: string;
}

export interface SqlQuestion {
  id: string;
  category: SqlCategory;
  title: string;
  difficulty: Difficulty;
  question_text: string;
  hints: string | null;
  solution_sql: string | null;
  explanation: string | null;
  created_at: string;
}

export interface SqlProgress {
  id: string;
  user_id: string;
  sql_question_id: string;
  solved: boolean;
  attempts: number;
  updated_at: string;
}

export interface ResumeReport {
  id: string;
  user_id: string;
  storage_path: string | null;
  file_name: string | null;
  ats_score: number | null;
  report: ResumeAnalysis;
  created_at: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  missingSkills: string[];
  grammarSuggestions: string[];
  improvements: string[];
  interviewReadiness: string;
  summary: string;
}

export interface MockTest {
  id: string;
  title: string;
  test_type: MockTestType;
  duration_minutes: number;
  questions: MockQuestion[];
  is_published: boolean;
  created_at: string;
}

export interface MockQuestion {
  id: string;
  prompt: string;
  choices?: string[];
  correctIndex?: number;
  points?: number;
}

export interface InterviewHistoryRow {
  id: string;
  user_id: string;
  mock_test_id: string | null;
  score: number;
  max_score: number;
  answers: unknown;
  duration_seconds: number | null;
  completed_at: string;
}

export interface ActivityDay {
  date: string;
  count: number;
}
