/**
 * Model IDs change over time — see https://ai.google.dev/gemini-api/docs/models
 * Short names like `gemini-1.5-flash` may 404 on v1beta; prefer current 2.5.x stable IDs.
 */

export function geminiModelCandidates(): string[] {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  /** Order: broadly available Flash-class models → alternates */
  const fallback = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
  ];
  const combined = [...(fromEnv ? [fromEnv] : []), ...fallback];
  return [...new Set(combined)];
}

export function isLikelyGeminiQuotaError(err: unknown): boolean {
  const s = String(err instanceof Error ? err.message : err);
  return (
    /\b429\b/.test(s) ||
    /\bRESOURCE_EXHAUSTED\b/i.test(s) ||
    /quota/i.test(s) ||
    /QuotaFailure/i.test(s) ||
    /Too Many Requests/i.test(s)
  );
}

/** Wrong/retired model name or unsupported method — try next candidate. */
export function isLikelyGeminiModelUnavailable(err: unknown): boolean {
  const s = String(err instanceof Error ? err.message : err);
  return (
    /\b404\b/.test(s) ||
    /\bNOT_FOUND\b/i.test(s) ||
    /is not found/i.test(s) ||
    /not supported for generateContent/i.test(s)
  );
}

export function shouldTryNextGeminiModel(err: unknown): boolean {
  return isLikelyGeminiQuotaError(err) || isLikelyGeminiModelUnavailable(err);
}
