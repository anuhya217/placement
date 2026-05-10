"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MockQuestion, MockTest } from "@/types";
import { submitMockTest } from "@/app/actions/mock-test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

function scoreTest(test: MockTest, answers: Record<string, string | number>) {
  const questions = test.questions as MockQuestion[];
  let score = 0;
  let max = 0;
  for (const q of questions) {
    const pts = q.points ?? 10;
    max += pts;
    const a = answers[q.id];
    if (q.choices && typeof q.correctIndex === "number") {
      if (a === q.correctIndex) score += pts;
    } else {
      const len = String(a ?? "").trim().length;
      if (len >= 28) score += pts;
    }
  }
  return { score, max };
}

export function MockRunner({ test }: { test: MockTest }) {
  const router = useRouter();
  const questions = test.questions as MockQuestion[];
  const durationSec = test.duration_minutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      toast.message("Time is up — submit your answers.");
    }
  }, [secondsLeft]);

  const mmss = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  async function submit() {
    setSubmitting(true);
    const { score, max } = scoreTest(test, answers);
    const elapsed = durationSec - secondsLeft;
    try {
      await submitMockTest({
        mockTestId: test.id,
        score,
        maxScore: max,
        answers,
        durationSeconds: elapsed,
      });
      toast.success(`Scored ${score}/${max}`);
      router.push("/mock-interview");
      router.refresh();
    } catch {
      toast.error("Could not save attempt");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{test.title}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 capitalize">
            {test.test_type} · {test.duration_minutes} min suggested
          </p>
        </div>
        <Badge variant={secondsLeft === 0 ? "destructive" : "secondary"} className="tabular-nums text-lg px-3 py-1">
          {mmss}
        </Badge>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <Card key={q.id} className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base">
                Q{idx + 1}. {q.prompt}
              </CardTitle>
              <CardDescription>
                {q.points != null ? `${q.points} pts` : "Answer carefully"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.choices ? (
                <div className="flex flex-col gap-2">
                  {q.choices.map((c, i) => (
                    <Button
                      key={c}
                      type="button"
                      variant={answers[q.id] === i ? "default" : "outline"}
                      className="h-auto justify-start py-3 text-left font-normal"
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: i }))
                      }
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              ) : (
                <Textarea
                  rows={4}
                  placeholder="Type a structured answer (≥30 chars for full credit in this demo rubric)."
                  value={String(answers[q.id] ?? "")}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={submitting}
        onClick={() => submit()}
      >
        {submitting ? "Saving…" : "Submit attempt"}
      </Button>
    </div>
  );
}
