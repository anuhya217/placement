import { Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase.rpc("get_leaderboard", {
    limit_count: 50,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Ranked by DSA problems solved — ties broken by current streak.
        </p>
      </div>

      {error ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">RPC unavailable</CardTitle>
            <CardDescription>
              Run <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">supabase/schema.sql</code> in your Supabase project to create{" "}
              <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">get_leaderboard</code>.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-500" /> Top performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {(rows ?? []).map(
              (
                row: {
                  id: string;
                  full_name: string | null;
                  dsa_solved: number;
                  current_streak: number;
                },
                i: number
              ) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold dark:bg-zinc-800">
                      {i + 1}
                    </span>
                    <span className="font-medium">
                      {row.full_name ?? "Anonymous"}
                    </span>
                  </span>
                  <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
                    {Number(row.dsa_solved)} solved · streak {row.current_streak}
                  </span>
                </li>
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
