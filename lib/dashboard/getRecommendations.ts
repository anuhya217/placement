import { createClient } from "@/lib/supabase/server";
import { dsaQuestions } from "@/data/dsaQuestions";
import type { Recommendation } from "@/types/dashboard";

export async function getRecommendations(userId: string): Promise<Recommendation | null> {
  const supabase = await createClient();

  const { data: dsaProgress } = await supabase
    .from("user_progress")
    .select("problem_id")
    .eq("user_id", userId)
    .eq("solved", true);

  const solvedIds = new Set(dsaProgress?.map(p => p.problem_id) ?? []);

  // Find the first question in the sorted roadmap that is NOT solved
  const nextProblem = dsaQuestions.find(q => !solvedIds.has(q.id));

  if (!nextProblem) return null;

  return {
    id: nextProblem.id,
    title: nextProblem.title,
    topic: nextProblem.topic,
    description: `You're currently on Week ${nextProblem.week}. Tackle this next!`,
    url: "/dsa",
    type: "dsa"
  };
}
