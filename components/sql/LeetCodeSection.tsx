"use client";

import { useState, useMemo, useEffect } from "react";
import { FilterBar } from "./FilterBar";
import { QuestionCard } from "./QuestionCard";
import { ProgressStats } from "./ProgressStats";
import { sqlQuestions } from "@/data/sqlQuestions";
import { Separator } from "@/components/ui/separator";

export function LeetCodeSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("leetcode_sql_progress");
    if (stored) {
      try {
        setCompletedIds(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleToggleComplete = (id: string, completed: boolean) => {
    const newProgress = { ...completedIds, [id]: completed };
    setCompletedIds(newProgress);
    localStorage.setItem("leetcode_sql_progress", JSON.stringify(newProgress));
  };

  const topics = useMemo(() => {
    const uniqueTopics = new Set<string>();
    sqlQuestions.forEach((q) => uniqueTopics.add(q.category));
    return Array.from(uniqueTopics).sort();
  }, []);

  const filteredQuestions = useMemo(() => {
    return sqlQuestions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
      const matchesTopic = topicFilter === "All" || q.category === topicFilter;
      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [searchQuery, difficultyFilter, topicFilter]);

  const completedCount = useMemo(() => {
    return Object.values(completedIds).filter(Boolean).length;
  }, [completedIds]);

  if (!isMounted) return null; // Avoid hydration mismatch on progress stats

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Top 30 Most Important SQL Interview Questions
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          A curated list of the most frequently asked LeetCode SQL questions at top tech companies.
        </p>
      </div>

      <ProgressStats total={sqlQuestions.length} completed={completedCount} />

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        topics={topics}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredQuestions.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No questions match your filters.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isCompleted={!!completedIds[q.id]}
              onToggleComplete={handleToggleComplete}
            />
          ))
        )}
      </div>
      <Separator className="my-8" />
    </div>
  );
}
