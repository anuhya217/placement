import { createClient } from "@/lib/supabase/server";
import { dsaQuestions } from "@/data/dsaQuestions";
import { sqlQuestions } from "@/data/sqlQuestions";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    { count: dsaSolvedCount },
    { count: sqlSolvedCount },
    { data: profile }
  ] = await Promise.all([
    supabase
      .from("user_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("solved", true),
    supabase
      .from("sql_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("solved", true),
    supabase
      .from("profiles")
      .select("current_streak, longest_streak")
      .eq("id", userId)
      .single()
  ]);

  const dsaSolved = dsaSolvedCount ?? 0;
  const sqlSolved = sqlSolvedCount ?? 0;

  // Simple XP formula: 10 XP per question + bonus for streaks
  const xp = (dsaSolved * 10) + (sqlSolved * 10) + ((profile?.current_streak ?? 0) * 5);

  return {
    dsaSolved,
    dsaTotal: dsaQuestions.length,
    sqlSolved,
    sqlTotal: sqlQuestions.length,
    xp,
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
  };
}
