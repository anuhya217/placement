import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { dsaQuestions } from "@/data/dsaQuestions";
import type { ActivityItem } from "@/types/dashboard";

export async function getRecentActivity(userId: string): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const [
    { data: dsaProgress },
    { data: sqlProgress },
    { data: sqlQuestions }
  ] = await Promise.all([
    supabase
      .from("user_progress")
      .select("problem_id, updated_at")
      .eq("user_id", userId)
      .eq("solved", true)
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("sql_progress")
      .select("sql_question_id, updated_at")
      .eq("user_id", userId)
      .eq("solved", true)
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("sql_questions")
      .select("id, title")
  ]);

  const activities: ActivityItem[] = [];

  // Process DSA
  if (dsaProgress) {
    for (const p of dsaProgress) {
      const q = dsaQuestions.find(x => x.id === p.problem_id);
      if (q) {
        activities.push({
          id: `dsa-${p.problem_id}-${p.updated_at}`,
          type: "SOLVED_DSA",
          title: `Solved '${q.title}'`,
          time: p.updated_at,
          points: 10,
        });
      }
    }
  }

  // Process SQL
  if (sqlProgress && sqlQuestions) {
    for (const p of sqlProgress) {
      const q = sqlQuestions.find(x => x.id === p.sql_question_id);
      if (q) {
        activities.push({
          id: `sql-${p.sql_question_id}-${p.updated_at}`,
          type: "SOLVED_SQL",
          title: `Completed SQL: ${q.title}`,
          time: p.updated_at,
          points: 10,
        });
      }
    }
  }

  // Sort by updated_at descending and take top 5
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  
  const topActivities = activities.slice(0, 5).map(a => ({
    ...a,
    time: formatDistanceToNow(new Date(a.time), { addSuffix: true })
  }));

  return topActivities;
}
