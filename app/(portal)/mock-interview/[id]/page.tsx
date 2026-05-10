import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MockTest } from "@/types";
import { MockRunner } from "@/components/mock/mock-runner";

export default async function MockInterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: test } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!test) notFound();

  return <MockRunner test={test as MockTest} />;
}
