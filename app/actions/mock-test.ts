"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitMockTest(input: {
  mockTestId: string;
  score: number;
  maxScore: number;
  answers: unknown;
  durationSeconds: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("interview_history").insert({
    user_id: user.id,
    mock_test_id: input.mockTestId,
    score: input.score,
    max_score: input.maxScore,
    answers: input.answers as object,
    duration_seconds: input.durationSeconds,
  });

  if (error) throw error;
  revalidatePath("/mock-interview");
  revalidatePath("/dashboard");
}
