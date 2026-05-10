"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applyActivityForSolve } from "@/lib/streak";

export async function markSqlSolved(sqlQuestionId: string, solved: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("sql_progress")
    .select("id, attempts")
    .eq("user_id", user.id)
    .eq("sql_question_id", sqlQuestionId)
    .maybeSingle();

  const attempts = (existing?.attempts ?? 0) + 1;

  const { error } = await supabase.from("sql_progress").upsert(
    {
      user_id: user.id,
      sql_question_id: sqlQuestionId,
      solved,
      attempts,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,sql_question_id" }
  );

  if (error) throw error;

  if (solved) {
    await applyActivityForSolve(supabase, user.id);
  }

  revalidatePath("/sql");
  revalidatePath("/dashboard");
}
