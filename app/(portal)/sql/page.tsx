import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/profile";
import { SqlPractice } from "@/components/sql/sql-practice";
import { LeetCodeSection } from "@/components/sql/LeetCodeSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SqlPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const [{ data: questions }, { data: progress }] = await Promise.all([
    supabase.from("sql_questions").select("*").order("category"),
    supabase.from("sql_progress").select("*").eq("user_id", profile.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">SQL Interview Practice</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Master SQL concepts and ace your interviews with top LeetCode questions and custom challenges.
        </p>
      </div>

      <Tabs defaultValue="leetcode" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="leetcode">Top 30 LeetCode</TabsTrigger>
          <TabsTrigger value="custom">Custom Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="leetcode" className="mt-0">
          <LeetCodeSection />
        </TabsContent>
        <TabsContent value="custom" className="mt-0">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Custom Platform Challenges
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Window functions, joins, and rankings — reveal solutions only after you attempt.
              </p>
            </div>
            <SqlPractice questions={questions ?? []} progress={progress ?? []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
