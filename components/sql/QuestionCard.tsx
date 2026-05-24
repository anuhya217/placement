"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { LeetCodeSqlQuestion } from "@/data/sqlQuestions";

interface QuestionCardProps {
  question: LeetCodeSqlQuestion;
  isCompleted: boolean;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export function QuestionCard({ question, isCompleted, onToggleComplete }: QuestionCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("sql_bookmarks") || "{}");
    setIsBookmarked(!!bookmarks[question.id]);
  }, [question.id]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("sql_bookmarks") || "{}");
    if (isBookmarked) {
      delete bookmarks[question.id];
    } else {
      bookmarks[question.id] = true;
    }
    localStorage.setItem("sql_bookmarks", JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-zinc-400/50 dark:hover:border-zinc-700">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-zinc-200 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-zinc-700" />
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/practice/${question.slug}`}
              className="text-base font-semibold hover:underline"
            >
              {question.title}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="secondary" className={difficultyColors[question.difficulty]}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-zinc-500">
              {question.category}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            className={`h-8 w-8 rounded-full ${isBookmarked ? "text-blue-500" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            <span className="sr-only">Bookmark</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleComplete(question.id, !isCompleted)}
            className={`h-8 w-8 rounded-full ${isCompleted ? "text-emerald-500" : "text-zinc-400 hover:text-emerald-500"}`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 fill-emerald-50 dark:fill-emerald-950" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
            <span className="sr-only">Mark as completed</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {question.description}
        </CardDescription>
        <div className="mt-3 flex flex-wrap gap-1">
          {question.company_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
          {question.company_tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              +{question.company_tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1 pb-4">
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={`/practice/${question.slug}`}>Practice Details</Link>
          </Button>
          <Button size="sm" asChild className="w-full gap-2" variant="default">
            <a href={question.leetcode_url} target="_blank" rel="noopener noreferrer">
              Solve on LeetCode <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
