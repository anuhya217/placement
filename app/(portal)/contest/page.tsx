import Link from "next/link";
import { pickDailyContestProblem } from "@/lib/contest/pick";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/profile";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ContestPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data: problems } = await supabase.from("problems").select("*");
  const pick = pickDailyContestProblem(problems ?? [], profile.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contest mode</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          One deterministic challenge per UTC day — practice under pressure, then log notes in DSA tracker.
        </p>
      </div>

      <Card className="border-emerald-500/30 bg-emerald-500/[0.03] dark:border-emerald-500/25">
        <CardHeader>
          <CardTitle className="text-xl">Today&apos;s pick</CardTitle>
          <CardDescription>
            Same problem for you all day — revisit tomorrow for a fresh roll.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pick ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{pick.category}</Badge>
                <Badge>{pick.difficulty}</Badge>
              </div>
              <h2 className="text-lg font-semibold">{pick.title}</h2>
              {pick.description ? (
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {pick.description}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/dsa">Open DSA tracker</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">Back to dashboard</Link>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              No problems in the bank yet — ask an admin to seed questions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
