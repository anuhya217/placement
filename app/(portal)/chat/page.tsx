import { CoachChat } from "@/components/chat/coach-chat";

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI placement coach</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Powered by your configured OpenAI or Gemini key — short, actionable guidance for Indian hiring cycles.
        </p>
      </div>
      <CoachChat />
    </div>
  );
}
