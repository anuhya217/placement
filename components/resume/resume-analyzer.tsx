"use client";

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { ResumeAnalysis } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ResumeAnalyzerPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  async function analyze() {
    if (!file) {
      toast.error("Choose a PDF first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        body: fd,
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error (${res.status}): Please ensure your file is under 4.5MB and try again. If it persists, it may be a timeout.`);
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setResult(json.analysis as ResumeAnalysis);
      toast.success("Resume analyzed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Upload resume (PDF)</CardTitle>
          <CardDescription>
            Stored privately in Supabase Storage — text is parsed server-side and sent to your configured AI provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <UploadCloud className="mb-2 h-8 w-8 text-emerald-600" />
            <span className="text-sm font-medium">Drop PDF or click to browse</span>
            <span className="mt-1 text-xs text-zinc-500">Max 4.5MB · ATS-focused scoring</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {file ? (
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Selected: <strong>{file.name}</strong>
            </p>
          ) : null}
          <Button
            type="button"
            className="w-full"
            disabled={loading || !file}
            onClick={() => analyze()}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
              </>
            ) : (
              "Run AI analysis"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            ATS-style score, gaps, grammar nits, and interview readiness narrative.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result ? (
            <p className="text-sm text-zinc-500">
              Results appear here after a successful run. Reports are persisted to your account.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-zinc-500">ATS score</span>
                <Badge variant="default" className="text-base tabular-nums">
                  {result.atsScore}/100
                </Badge>
              </div>
              <Section title="Summary" body={result.summary} />
              <ListSection title="Missing skills" items={result.missingSkills} />
              <ListSection title="Grammar / wording" items={result.grammarSuggestions} />
              <ListSection title="Improvements" items={result.improvements} />
              <Section title="Interview readiness" body={result.interviewReadiness} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {body}
      </p>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
