"use client";

import type { ReactNode } from "react";
import type { LeetCodeDsaQuestion } from "@/data/dsaQuestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        {title}
      </h4>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </div>
  );
}

export function ProblemDetailDialog({
  problem,
  open,
  onOpenChange,
  leetcodeUsername,
}: {
  problem: LeetCodeDsaQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leetcodeUsername?: string | null;
}) {
  if (!problem) return null;

  const lcUser = leetcodeUsername?.trim().replace(/^@/, "");
  const profileLc = lcUser ? `https://leetcode.com/u/${lcUser}/` : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl gap-4 sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-left">{problem.title}</DialogTitle>
            <Badge variant="secondary">{problem.topic}</Badge>
            <Badge
              variant={
                problem.difficulty === "Hard"
                  ? "destructive"
                  : problem.difficulty === "Medium"
                    ? "default"
                    : "outline"
              }
            >
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className="ml-auto">Week {problem.week}</Badge>
          </div>
          <DialogDescription className="sr-only">
            Interview-style problem briefing and links
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-10rem)] pr-4">
          <div className="flex flex-col gap-4 pb-4">
            <Section title="Problem">{problem.description}</Section>
            
            {problem.hints && problem.hints.length > 0 && (
              <div className="rounded-lg border border-amber-500/35 bg-amber-500/[0.07] px-3 py-2">
                <Section title="Hints / Interview Angle">
                  <ul className="list-disc pl-4 space-y-1">
                    {problem.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </Section>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800 sm:flex-row sm:flex-wrap">
          <Button asChild variant="gradient" className="gap-2">
            <a href={problem.leetcode_url} target="_blank" rel="noopener noreferrer">
              Solve on LeetCode <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          
          {profileLc ? (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <a href={profileLc} target="_blank" rel="noopener noreferrer">
                Your LeetCode profile <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <p className="w-full text-xs text-zinc-500">
              Add your LeetCode username under Settings to jump to your profile.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
