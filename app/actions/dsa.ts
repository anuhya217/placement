"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applyActivityForSolve } from "@/lib/streak";

export async function toggleDsaProgress(input: {
  problemId: string;
  solved: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      problem_id: input.problemId,
      solved: input.solved,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,problem_id" }
  );

  if (error) throw error;

  if (input.solved) {
    await applyActivityForSolve(supabase, user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dsa");
}

export async function saveDsaNotes(input: {
  problemId: string;
  notes: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      problem_id: input.problemId,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,problem_id" }
  );

  if (error) throw error;
  revalidatePath("/dsa");
}
