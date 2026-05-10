import { ResumeAnalyzerPanel } from "@/components/resume/resume-analyzer";

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Resume Analyzer</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Upload a PDF — get ATS-oriented scoring, skill gaps, and structured improvements powered by OpenAI or Gemini.
        </p>
      </div>
      <ResumeAnalyzerPanel />
    </div>
  );
}
