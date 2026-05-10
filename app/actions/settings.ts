"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const usernameSchema = z
  .string()
  .max(64)
  .regex(/^[\w\-]*$/i)
  .optional();

export async function updateLeetcodeUsername(raw: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const cleaned = raw.trim().replace(/^@/, "");

  if (cleaned.length === 0) {
    const { error } = await supabase
      .from("profiles")
      .update({ leetcode_username: null })
      .eq("id", user.id);
    if (error) throw new Error(error.message);
    revalidatePath("/settings");
    revalidatePath("/dsa");
    return;
  }

  const parsed = usernameSchema.safeParse(cleaned);
  if (!parsed.success) {
    throw new Error("Letters, numbers, underscore, hyphen only (max 64).");
  }

  const username = cleaned;

  const { error } = await supabase
    .from("profiles")
    .update({ leetcode_username: username })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/dsa");
}
