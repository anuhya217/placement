import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { coachReply } from "@/services/ai/chat";

export const maxDuration = 60; // Max allowed for Vercel Hobby tier

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(8000),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const reply = await coachReply(parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
