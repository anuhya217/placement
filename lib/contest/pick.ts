import type { Problem } from "@/types";

export function pickDailyContestProblem(
  problems: Problem[],
  userId: string
): Problem | null {
  if (!problems.length) return null;
  const day = new Date().toISOString().slice(0, 10);
  let h = 0;
  const seed = `${userId}:${day}`;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return problems[h % problems.length];
}
