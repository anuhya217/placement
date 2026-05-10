import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/profile";
import { DsaTracker } from "@/components/dsa/dsa-tracker";
import { dsaQuestions } from "@/data/dsaQuestions";

export default async function DsaPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", profile.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">8-Week DSA Roadmap</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          A structured 8-week plan to master Data Structures and Algorithms with real LeetCode problems. Track your progress and save notes.
        </p>
      </div>
      <DsaTracker
        problems={dsaQuestions}
        progress={progress ?? []}
        leetcodeUsername={profile.leetcode_username}
      />
    </div>
  );
}
