import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRetry } from "@/services/ai/retry";
import {
  geminiModelCandidates,
  shouldTryNextGeminiModel,
} from "@/services/ai/gemini-models";

const COACH_SYSTEM = `You are “Placement Coach”, a concise, encouraging mentor for CS students preparing for campus placements in India. Give actionable bullet steps when relevant. Keep answers under 180 words unless the user asks for detail.`;

async function geminiCoachReply(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastErr: unknown;
  for (const modelName of geminiModelCandidates()) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      lastErr = e;
      if (!shouldTryNextGeminiModel(e)) throw e;
    }
  }
  throw lastErr ?? new Error("Gemini unavailable");
}

export async function coachReply(messages: { role: "user" | "assistant"; content: string }[]) {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  const geminiPrompt = `${COACH_SYSTEM}\n\nConversation:\n${transcript}\n\nReply as Placement Coach:`;

  const tryGeminiFirst =
    provider === "gemini" ||
    (!process.env.OPENAI_API_KEY && !!process.env.GEMINI_API_KEY);

  async function openaiPath() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY missing");
    const client = new OpenAI({ apiKey });
    const res = await withRetry(() =>
      client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.5,
        messages: [
          { role: "system", content: COACH_SYSTEM },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
      })
    );
    return res.choices[0]?.message?.content ?? "";
  }

  if (tryGeminiFirst && process.env.GEMINI_API_KEY) {
    try {
      return await geminiCoachReply(geminiPrompt);
    } catch {
      /* fall through to OpenAI if possible */
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return await openaiPath();
    } catch {
      if (process.env.GEMINI_API_KEY) {
        return geminiCoachReply(geminiPrompt);
      }
      throw new Error(
        "Coach failed on OpenAI and no Gemini fallback. Check API keys / quotas."
      );
    }
  }

  return geminiCoachReply(geminiPrompt);
}
