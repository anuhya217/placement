import { createClient } from "@/lib/supabase/server";

// This fetches daily counts from `user_progress` and `sql_progress` 
// and maps them into an array suitable for react-activity-calendar
export async function getActivityHeatmap(userId: string) {
  const supabase = await createClient();

  const [
    { data: dsaProgress },
    { data: sqlProgress }
  ] = await Promise.all([
    supabase
      .from("user_progress")
      .select("updated_at")
      .eq("user_id", userId)
      .eq("solved", true),
    supabase
      .from("sql_progress")
      .select("updated_at")
      .eq("user_id", userId)
      .eq("solved", true)
  ]);

  const map = new Map<string, number>();

  const processDates = (progressList: { updated_at: string | null }[]) => {
    if (!progressList) return;
    for (const row of progressList) {
      if (!row.updated_at) continue;
      const d = new Date(row.updated_at);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      map.set(dateStr, (map.get(dateStr) ?? 0) + 1);
    }
  };

  processDates(dsaProgress || []);
  processDates(sqlProgress || []);

  const data = Array.from(map.entries()).map(([date, count]) => ({
    date,
    count,
    level: Math.min(count, 4) // For calendar UI, cap the heat level at 4
  }));

  // Ensure there's at least one data point for today so the calendar renders correctly up to current date
  const today = new Date().toISOString().split("T")[0];
  if (!map.has(today)) {
    data.push({ date: today, count: 0, level: 0 });
  }

  // Sort chronologically
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
