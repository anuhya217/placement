"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Msg = { role: "user" | "assistant"; content: string };

export function CoachChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m your Placement Coach. Ask about DSA plans, SQL patterns, HR stories, or resume strategy.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[min(560px,70vh)] flex-col rounded-xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-emerald-600 px-4 py-2 text-sm text-white"
                  : "mr-auto max-w-[85%] rounded-2xl bg-zinc-100 px-4 py-2 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
              }
            >
              {m.content}
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          ) : null}
        </div>
      </ScrollArea>
      <div className="flex gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
        <Input
          placeholder="Ask anything about placement prep…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button type="button" onClick={() => send()} disabled={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
