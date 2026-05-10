import { Sparkles } from "lucide-react";
import { getProfile } from "@/lib/auth/profile";
import { getDashboardSnapshot } from "@/lib/queries/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function RecommendationsPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const snap = await getDashboardSnapshot(profile.id);
  const weak = [...snap.topicProgress]
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Smart recommendations</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Topics ranked by lowest completion in your DSA bank — prioritize these this week.
        </p>
      </div>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Focus stack
          </CardTitle>
          <CardDescription>
            Derived from your latest progress snapshot — refresh by solving items in the DSA tracker.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {weak.map((t) => (
            <div key={t.category} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{t.category}</span>
                <span className="text-zinc-500">
                  {t.solved}/{t.total} ({t.percent}%)
                </span>
              </div>
              <Progress value={t.percent} />
              <p className="text-xs text-zinc-500">
                Drill 2–3 medium problems in this pillar, then revisit with timed retries.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
