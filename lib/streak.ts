import type { SupabaseClient } from "@supabase/supabase-js";

function utcDateString(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Increments today's activity count and updates coding streak once per day. */
export async function applyActivityForSolve(
  supabase: SupabaseClient,
  userId: string
) {
  const today = utcDateString(new Date());

  const { data: logRow } = await supabase
    .from("activity_log")
    .select("id, problems_solved")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .maybeSingle();

  if (logRow) {
    await supabase
      .from("activity_log")
      .update({ problems_solved: (logRow.problems_solved ?? 0) + 1 })
      .eq("id", logRow.id);
  } else {
    await supabase.from("activity_log").insert({
      user_id: userId,
      activity_date: today,
      problems_solved: 1,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("last_activity_date, current_streak, longest_streak")
    .eq("id", userId)
    .single();

  const last = profile?.last_activity_date as string | null | undefined;
  if (last === today) {
    return;
  }

  let streak = profile?.current_streak ?? 0;
  let longest = profile?.longest_streak ?? 0;

  if (!last) {
    streak = 1;
  } else {
    const lastD = new Date(last + "T00:00:00Z");
    const todayD = new Date(today + "T00:00:00Z");
    const diffDays = Math.round(
      (todayD.getTime() - lastD.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) streak += 1;
    else streak = 1;
  }

  if (streak > longest) longest = streak;

  await supabase
    .from("profiles")
    .update({
      last_activity_date: today,
      current_streak: streak,
      longest_streak: longest,
    })
    .eq("id", userId);
}
