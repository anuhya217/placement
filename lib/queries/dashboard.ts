import { createClient } from "@/lib/supabase/server";
import type { ProblemCategory } from "@/types";
import { formatPercent } from "@/lib/utils";

export async function getDashboardSnapshot(userId: string) {
  const supabase = await createClient();

  const [
    problemsRes,
    progressRes,
    profileRes,
    activityRes,
    resumeRes,
    interviewRes,
    sqlProgressRes,
    sqlTotalRes,
  ] = await Promise.all([
    supabase.from("problems").select("id, category"),
    supabase.from("user_progress").select("problem_id, solved").eq("user_id", userId),
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("activity_log")
      .select("activity_date, problems_solved")
      .eq("user_id", userId)
      .order("activity_date", { ascending: false })
      .limit(14),
    supabase
      .from("resume_reports")
      .select("ats_score")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("interview_history")
      .select("score, max_score")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(10),
    supabase
      .from("sql_progress")
      .select("solved")
      .eq("user_id", userId),
    supabase
      .from("sql_questions")
      .select("id", { count: "exact", head: true }),
  ]);

  const problems = problemsRes.data ?? [];
  const progress = progressRes.data ?? [];
  const solvedIds = new Set(
    progress.filter((p) => p.solved).map((p) => p.problem_id)
  );
  const totalProblems = problems.length;
  const solvedCount = solvedIds.size;

  const byCategory: Record<string, { total: number; solved: number }> = {};
  for (const p of problems) {
    const c = p.category as ProblemCategory;
    if (!byCategory[c]) byCategory[c] = { total: 0, solved: 0 };
    byCategory[c].total += 1;
    if (solvedIds.has(p.id)) byCategory[c].solved += 1;
  }

  const topicProgress = Object.entries(byCategory).map(([category, v]) => ({
    category,
    percent: formatPercent(v.solved, v.total),
    solved: v.solved,
    total: v.total,
  }));

  const weeklyRaw = (activityRes.data ?? []).slice(0, 7).reverse();
  const weeklyActivity = weeklyRaw.map((row) => ({
    date: row.activity_date,
    count: row.problems_solved ?? 0,
  }));

  const avgInterview =
    interviewRes.data && interviewRes.data.length > 0
      ? interviewRes.data.reduce(
          (acc, row) => acc + Number(row.score) / Number(row.max_score || 100),
          0
        ) / interviewRes.data.length
      : null;

  const sqlSolved =
    sqlProgressRes.data?.filter((r) => r.solved).length ?? 0;
  const sqlTotal = sqlTotalRes.count ?? 0;

  return {
    profile: profileRes.data,
    totalProblems,
    solvedCount,
    topicProgress,
    weeklyActivity,
    resumeScore: resumeRes.data?.ats_score ?? null,
    mockAvgPercent: avgInterview != null ? Math.round(avgInterview * 1000) / 10 : null,
    streak: profileRes.data?.current_streak ?? 0,
    sqlProgress: { solved: sqlSolved, total: sqlTotal },
  };
}
