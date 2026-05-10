"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/profile";
import type { Difficulty, ProblemCategory } from "@/types";

async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Forbidden");
  }
}

export async function adminCreateProblem(input: {
  category: ProblemCategory;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  problem_statement?: string | null;
  input_format?: string | null;
  output_format?: string | null;
  sample_io?: string | null;
  constraints_text?: string | null;
  leetcode_url?: string | null;
  interviewer_tips?: string | null;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("problems").insert({
    category: input.category,
    title: input.title,
    slug: input.slug,
    difficulty: input.difficulty,
    description: input.description,
    problem_statement: input.problem_statement || null,
    input_format: input.input_format || null,
    output_format: input.output_format || null,
    sample_io: input.sample_io || null,
    constraints_text: input.constraints_text || null,
    leetcode_url: input.leetcode_url || null,
    interviewer_tips: input.interviewer_tips || null,
  });
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/dsa");
}

export async function adminDeleteProblem(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("problems").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/dsa");
}

export async function adminCreateSqlQuestion(input: {
  category: string;
  title: string;
  difficulty: Difficulty;
  questionText: string;
  solutionSql: string;
  explanation: string;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("sql_questions").insert({
    category: input.category,
    title: input.title,
    difficulty: input.difficulty,
    question_text: input.questionText,
    solution_sql: input.solutionSql,
    explanation: input.explanation,
  });
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/sql");
}

export async function adminDeleteSqlQuestion(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("sql_questions").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/sql");
}

export async function adminSetUserRole(userId: string, role: "student" | "admin") {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/admin");
}
