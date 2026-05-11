"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import type { UserProgress } from "@/types";
import { toggleDsaProgress, saveDsaNotes } from "@/app/actions/dsa";
import { formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProblemDetailDialog } from "@/components/dsa/problem-detail-dialog";
import type { LeetCodeDsaQuestion, Difficulty } from "@/data/dsaQuestions";
import { motion } from "framer-motion";
import { DsaRow } from "./dsa-row";

const categories = [
  "All",
  "Arrays & Hashing",
  "Two Pointers",
  "Stack",
  "Sliding Window",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1D Dynamic Programming",
  "2D Dynamic Programming",
  "Bit Manipulation",
];

const difficulties: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];

export function DsaTracker({
  problems,
  progress,
  leetcodeUsername,
}: {
  problems: LeetCodeDsaQuestion[];
  progress: UserProgress[];
  leetcodeUsername?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [diff, setDiff] = useState<(typeof difficulties)[number]>("All");
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [brief, setBrief] = useState<LeetCodeDsaQuestion | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    setClientLoaded(true);
    try {
      const saved = localStorage.getItem("dsa_bookmarks");
      if (saved) {
        setBookmarks(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const progressMap = useMemo(() => {
    const m = new Map<string, UserProgress>();
    progress.forEach((p) => m.set(p.problem_id, p));
    return m;
  }, [progress]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q);
      const matchC = cat === "All" || p.topic === cat;
      const matchD = diff === "All" || p.difficulty === diff;
      const matchB = !showBookmarkedOnly || bookmarks.has(p.id);
      return matchQ && matchC && matchD && matchB;
    });
  }, [problems, query, cat, diff, showBookmarkedOnly, bookmarks]);

  const weeks = useMemo(() => {
    const wMap = new Map<number, LeetCodeDsaQuestion[]>();
    filtered.forEach(p => {
      if (!wMap.has(p.week)) wMap.set(p.week, []);
      wMap.get(p.week)!.push(p);
    });
    return Array.from(wMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  const solvedCount = progress.filter((p) => p.solved).length;
  const pct = formatPercent(solvedCount, problems.length);

  async function onToggle(problemId: string, solved: boolean) {
    try {
      await toggleDsaProgress({ problemId, solved });
      toast.success(solved ? "Marked solved" : "Marked todo");
    } catch {
      toast.error("Could not update progress");
    }
  }

  async function onSaveNotes(problemId: string) {
    try {
      await saveDsaNotes({
        problemId,
        notes: notesDraft[problemId] ?? progressMap.get(problemId)?.notes ?? "",
      });
      toast.success("Notes saved");
    } catch {
      toast.error("Could not save notes");
    }
  }

  function toggleBookmark(id: string) {
    const next = new Set(bookmarks);
    if (next.has(id)) {
      next.delete(id);
      toast("Removed from bookmarks");
    } else {
      next.add(id);
      toast("Added to bookmarks");
    }
    setBookmarks(next);
    localStorage.setItem("dsa_bookmarks", JSON.stringify(Array.from(next)));
  }

  function toggleWeek(w: number) {
    setExpandedWeeks(prev => 
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
    );
  }

  if (!clientLoaded) return null;

  return (
    <>
      <ProblemDetailDialog
        problem={brief}
        open={brief !== null}
        onOpenChange={(open) => {
          if (!open) setBrief(null);
        }}
        leetcodeUsername={leetcodeUsername}
      />
      <div className="space-y-6">
        <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle>Roadmap Progress</CardTitle>
            <CardDescription>
              {solvedCount}/{problems.length} solved ({pct}% overall)
            </CardDescription>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="bg-emerald-500 h-full" 
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px] w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search problems or topics..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={diff} onValueChange={(v) => setDiff(v as typeof diff)}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant={showBookmarkedOnly ? "default" : "outline"}
              className="w-full md:w-auto gap-2"
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            >
              {showBookmarkedOnly ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              Bookmarks
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {weeks.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              No problems match your filters.
            </div>
          ) : (
            weeks.map(([weekNum, weekProblems]) => {
              const weekTotal = problems.filter(p => p.week === weekNum).length;
              const weekSolved = weekProblems.filter(p => progressMap.get(p.id)?.solved).length;
              const weekPct = weekTotal === 0 ? 0 : Math.round((weekSolved / weekTotal) * 100);
              const isExpanded = expandedWeeks.includes(weekNum);

              return (
                <Card key={weekNum} className="overflow-hidden border-zinc-200/80 dark:border-zinc-800 transition-all duration-200">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50 transition-colors"
                    onClick={() => toggleWeek(weekNum)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 font-semibold text-sm">
                        {weekNum}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Week {weekNum}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {weekSolved}/{weekTotal} solved
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block w-24 bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${weekPct}%` }} />
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
                    </div>
                  </div>

                  <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100 max-h-[10000px]' : 'opacity-0 max-h-0'}`}>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {weekProblems.map((p) => {
                        const row = progressMap.get(p.id);
                        const solved = row?.solved ?? false;
                        const noteVal = notesDraft[p.id] ?? row?.notes ?? "";
                        const isBookmarked = bookmarks.has(p.id);

                        return (
                          <DsaRow 
                            key={p.id}
                            problem={p}
                            solved={solved}
                            noteVal={noteVal}
                            isBookmarked={isBookmarked}
                            onToggle={onToggle}
                            onSaveNotes={onSaveNotes}
                            onUpdateDraft={(id, text) => setNotesDraft(prev => ({ ...prev, [id]: text }))}
                            toggleBookmark={toggleBookmark}
                            setBrief={setBrief}
                          />
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
