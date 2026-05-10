import type { Problem } from "@/types";

/** Canonical LeetCode problem URL — works when `slug` matches LeetCode’s URL slug (e.g. two-sum). */
export function leetcodeProblemHref(slug: string): string {
  const clean = slug.replace(/^\/+/, "").replace(/\/+$/, "");
  return `https://leetcode.com/problems/${clean}/`;
}

/** Explicit DB URL beats slug derivation. */
export function resolvePracticeUrls(problem: Problem): {
  leetcode: string | null;
  onlineIde: string;
} {
  const leet =
    problem.leetcode_url?.trim() ||
    (problem.slug ? leetcodeProblemHref(problem.slug) : null);
  return {
    leetcode: leet || null,
    onlineIde:
      "https://www.onlinegdb.com/online_c++_compiler?lang=cpp",
  };
}
