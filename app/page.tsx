import Link from "next/link";
import { ArrowRight, Brain, LineChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 lg:pt-24">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl animate-fade-up space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              AI-Powered Placement Preparation Portal
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
              Ship placement prep like a{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                product engineer
              </span>
              .
            </h1>
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Track DSA by topic, drill SQL patterns, score your resume with ATS-aware AI,
              and run timed mock interviews — with streaks, analytics, and a calm Notion-inspired workspace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Start preparing <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-4 animate-fade-up rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70 lg:w-auto">
            <Feature icon={Brain} title="Resume intelligence" desc="PDF → ATS score, gaps, and rewrite prompts." />
            <Feature icon={LineChart} title="Analytics-first" desc="Weekly cadence, streaks, topic breakdown." />
            <Feature icon={Sparkles} title="Placement coach" desc="Chat assistant tuned for Indian hiring flows." />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "DSA Tracker",
              body: "Seven curated pillars — Arrays through Recursion — with notes and completion filters.",
            },
            {
              title: "SQL Interview Lab",
              body: "Window functions, joins, and rankings with solutions and explanations.",
            },
            {
              title: "Mock interview suite",
              body: "HR, technical MCQs, and aptitude with timers and scoring history.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {c.body}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Brain;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{title}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}
