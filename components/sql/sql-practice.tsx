"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Database, Terminal } from "lucide-react";
import { toast } from "sonner";
import type { SqlProgress, SqlQuestion } from "@/types";
import { markSqlSolved } from "@/app/actions/sql";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export function SqlPractice({
  questions,
  progress,
}: {
  questions: SqlQuestion[];
  progress: SqlProgress[];
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const progMap = useMemo(() => {
    const m = new Map<string, SqlProgress>();
    progress.forEach((p) => m.set(p.sql_question_id, p));
    return m;
  }, [progress]);

  const filtered = questions.filter(
    (q) =>
      !query.trim() ||
      q.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      q.question_text.toLowerCase().includes(query.trim().toLowerCase())
  );

  async function onSolved(id: string, solved: boolean) {
    try {
      await markSqlSolved(id, solved);
      toast.success(solved ? "Logged as solved" : "Marked unsolved");
    } catch {
      toast.error("Update failed");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">SQL Prompt Library</h2>
            <p className="text-xs text-zinc-500">Practice your database queries</p>
          </div>
        </div>
        <Input
          placeholder="Search SQL prompts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:max-w-xs bg-white dark:bg-zinc-950"
        />
      </div>

      <div className="grid gap-4">
          {filtered.map((q) => {
            const row = progMap.get(q.id);
            const solved = row?.solved ?? false;
            const open = openId === q.id;
            return (
              <div
                key={q.id}
              >
                <Card className={`group transition-all duration-300 ${solved ? 'border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10' : 'hover:border-blue-500/30'}`}>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 space-y-0 pb-4">
                    <div className="space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className={`text-base ${solved ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                          {q.title}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">{q.category}</Badge>
                        <Badge variant={q.difficulty === "Hard" ? "destructive" : q.difficulty === "Medium" ? "default" : "outline"}>
                          {q.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Toggle solved after you write the query in your local SQL IDE.
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0 bg-white/50 dark:bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 w-full sm:w-auto mt-2 sm:mt-0">
                      <Checkbox
                        checked={solved}
                        onCheckedChange={(c) => onSolved(q.id, c === true)}
                        className={solved ? 'data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500' : ''}
                      />
                      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        onClick={() => setOpenId(open ? null : q.id)}
                      >
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Prompt Box */}
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900">
                      <div className="flex items-center px-4 py-2 bg-zinc-200/50 dark:bg-zinc-950/50 border-b border-zinc-200/80 dark:border-zinc-800/80">
                        <Terminal className="h-3.5 w-3.5 text-zinc-500 mr-2" />
                        <span className="text-xs font-medium text-zinc-500">Prompt</span>
                      </div>
                      <ScrollArea className="max-h-40 p-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-700 dark:text-zinc-300">
                          {q.question_text}
                        </pre>
                      </ScrollArea>
                    </div>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                            <div className="relative rounded-xl overflow-hidden border border-violet-500/30 bg-zinc-950 shadow-lg">
                              <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                                <div className="flex gap-1.5 mr-4">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>
                                <span className="text-xs font-medium text-zinc-400">solution.sql</span>
                              </div>
                              <div className="p-4 overflow-x-auto">
                                <pre className="font-mono text-sm text-violet-300">
                                  {q.solution_sql}
                                </pre>
                              </div>
                            </div>
                            
                            {q.explanation && (
                              <div className="mt-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/10 text-sm text-zinc-600 dark:text-zinc-400">
                                <span className="font-semibold text-violet-600 dark:text-violet-400 mr-2">Explanation:</span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </CardContent>
                </Card>
              </div>
            );
          })}
        
        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No SQL problems match your search.
          </div>
        )}
      </div>
    </div>
  );
}
