"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeProgress(userId: string | undefined) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const channel = supabase.channel("realtime_progress")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Instantly refresh Server Components to refetch stats
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sql_progress",
          filter: `user_id=eq.${userId}`
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);
}
