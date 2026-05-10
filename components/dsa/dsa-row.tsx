import React from "react";
import { FileText, ExternalLink, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { LeetCodeDsaQuestion } from "@/data/dsaQuestions";

interface DsaRowProps {
  problem: LeetCodeDsaQuestion;
  solved: boolean;
  noteVal: string;
  isBookmarked: boolean;
  onToggle: (id: string, solved: boolean) => void;
  onSaveNotes: (id: string) => void;
  onUpdateDraft: (id: string, text: string) => void;
  toggleBookmark: (id: string) => void;
  setBrief: (p: LeetCodeDsaQuestion) => void;
}

export const DsaRow = React.memo(function DsaRow({
  problem: p,
  solved,
  noteVal,
  isBookmarked,
  onToggle,
  onSaveNotes,
  onUpdateDraft,
  toggleBookmark,
  setBrief
}: DsaRowProps) {
  return (
    <div className="p-4 sm:px-6 flex flex-col md:flex-row gap-4 md:items-start group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
      <div className="flex items-start gap-4 flex-1">
        <Checkbox
          checked={solved}
          onCheckedChange={(c) => onToggle(p.id, c === true)}
          className="mt-1"
        />
        <div className="space-y-1 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-medium ${solved ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
              {p.title}
            </span>
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{p.topic}</Badge>
            <Badge
              variant={p.difficulty === "Hard" ? "destructive" : p.difficulty === "Medium" ? "default" : "outline"}
              className="text-[10px] uppercase tracking-wider"
            >
              {p.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
            {p.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setBrief(p)}>
              <FileText className="h-3 w-3" />
              Briefing
            </Button>
            <Button variant="gradient" size="sm" className="h-7 text-xs gap-1.5 px-3" asChild>
              <a href={p.leetcode_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
                Solve
              </a>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-7 w-7 p-0 ${isBookmarked ? 'text-amber-500 hover:text-amber-600' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              onClick={() => toggleBookmark(p.id)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:w-64 shrink-0 flex flex-col gap-2">
        <Textarea
          rows={2}
          value={noteVal}
          onChange={(e) => onUpdateDraft(p.id, e.target.value)}
          className="text-xs resize-none h-16 min-h-[4rem]"
          placeholder="Add personal notes..."
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] uppercase tracking-wider w-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onSaveNotes(p.id)}
        >
          Save Note
        </Button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.solved === nextProps.solved &&
    prevProps.noteVal === nextProps.noteVal &&
    prevProps.isBookmarked === nextProps.isBookmarked
  );
});
