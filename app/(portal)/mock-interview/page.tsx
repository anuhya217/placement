import Link from "next/link";
import { Timer } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function MockInterviewPage() {
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mock interviews</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Timed flows across HR, technical MCQs, and aptitude — scores sync to your dashboard analytics.
        </p>
      </div>

      <div className="grid gap-4">
        {(tests ?? []).map((t) => (
          <Card
            key={t.id}
            className="border-zinc-200/80 transition hover:shadow-md dark:border-zinc-800"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">{t.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Badge variant="secondary" className="capitalize">
                    {t.test_type}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Timer className="h-3.5 w-3.5" />
                    {t.duration_minutes} min timer
                  </span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/mock-interview/${t.id}`}>Start</Link>
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              {(t.questions as unknown[])?.length ?? 0} prompts · auto-submit scoring rubric (MCQ exact, HR length heuristic).
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
