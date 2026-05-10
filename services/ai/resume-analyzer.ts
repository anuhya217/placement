import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ResumeAnalysis } from "@/types";
import { withRetry } from "@/services/ai/retry";
import {
  geminiModelCandidates,
  isLikelyGeminiQuotaError,
  shouldTryNextGeminiModel,
} from "@/services/ai/gemini-models";

const SYSTEM = `You are an expert technical recruiter and ATS analyst. Analyze resumes for software engineering placement (India hiring context). Respond ONLY with valid JSON matching this shape:
{
  "atsScore": number (0-100),
  "missingSkills": string[],
  "grammarSuggestions": string[],
  "improvements": string[],
  "interviewReadiness": string (short paragraph),
  "summary": string (one paragraph overview)
}`;

function parseJson(content: string): ResumeAnalysis {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? jsonMatch[0] : trimmed;
  const parsed = JSON.parse(raw) as ResumeAnalysis;
  if (typeof parsed.atsScore !== "number") parsed.atsScore = 70;
  return parsed;
}

function explainAiFailure(primary: unknown): string {
  if (primary instanceof Error && isLikelyGeminiQuotaError(primary)) {
    return [
      "Google Gemini quota is exhausted for this model.",
      "Fix: enable billing / wait for reset, set GEMINI_MODEL to gemini-2.5-flash, or use AI_PROVIDER=openai",
      "with OPENAI_API_KEY.",
    ].join(" ");
  }
  if (primary instanceof Error) return primary.message;
  return String(primary);
}

async function analyzeWithOpenAI(text: string): Promise<ResumeAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const res = await withRetry(() =>
    client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Resume text:\n---\n${text.slice(0, 12000)}\n---`,
        },
      ],
    })
  );
  const content = res.choices[0]?.message?.content ?? "{}";
  return parseJson(content);
}

/** Tries GEMINI_MODEL (if set) then fallback models until one succeeds. */
async function analyzeWithGeminiMultiModel(text: string): Promise<ResumeAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const slice = text.slice(0, 12000);
  let lastErr: unknown;

  for (const modelName of geminiModelCandidates()) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: SYSTEM },
        { text: `Resume text:\n---\n${slice}\n---` },
      ]);
      const content = result.response.text();
      return parseJson(content);
    } catch (e) {
      lastErr = e;
      if (!shouldTryNextGeminiModel(e)) throw e;
    }
  }

  throw lastErr ?? new Error("All Gemini models failed");
}

export async function analyzeResumeText(resumeText: string): Promise<ResumeAnalysis> {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();

  const tryOpenAi = async () =>
    process.env.OPENAI_API_KEY
      ? analyzeWithOpenAI(resumeText)
      : Promise.reject(new Error("No OPENAI_API_KEY"));

  const tryGemini = async () =>
    process.env.GEMINI_API_KEY
      ? analyzeWithGeminiMultiModel(resumeText)
      : Promise.reject(new Error("No GEMINI_API_KEY"));

  const order =
    provider === "gemini" ? [tryGemini, tryOpenAi] : [tryOpenAi, tryGemini];

  let last: unknown;
  for (const fn of order) {
    try {
      return await fn();
    } catch (e) {
      last = e;
    }
  }

  throw new Error(
    `${explainAiFailure(last)} Alternatively configure the other provider in .env.local.`
  );
}
