import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/profile";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPage() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const [{ data: problems }, { data: sqlQuestions }, { data: users }] =
    await Promise.all([
      supabase.from("problems").select("*").order("created_at", { ascending: false }),
      supabase
        .from("sql_questions")
        .select("id, title, category, difficulty")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin console</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage curriculum content and user roles — protected by Supabase RLS.
        </p>
      </div>
      <AdminPanel
        problems={problems ?? []}
        sqlQuestions={sqlQuestions ?? []}
        users={users ?? []}
      />
    </div>
  );
}
