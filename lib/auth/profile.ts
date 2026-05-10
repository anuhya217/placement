import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const meta = user.user_metadata as { full_name?: string } | undefined;
  const { data: created, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          meta?.full_name ??
          user.email?.split("@")[0] ??
          "Student",
        role: "student",
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error || !created) return null;
  return created as Profile;
}
