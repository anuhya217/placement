export type ActivityType = "SOLVED_DSA" | "SOLVED_SQL" | "BOOKMARKED" | "COMPLETED_WEEK";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  time: string; // ISO date string or relative string
  points: number;
}

export interface DashboardStats {
  dsaSolved: number;
  dsaTotal: number;
  sqlSolved: number;
  sqlTotal: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Recommendation {
  id: string;
  title: string;
  topic: string;
  description: string;
  url: string;
  type: "dsa" | "sql";
}
