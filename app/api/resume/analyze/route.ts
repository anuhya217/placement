import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromPdfBuffer } from "@/lib/pdf/extract";
import { analyzeResumeText } from "@/services/ai/resume-analyzer";

export const runtime = "nodejs";
export const maxDuration = 60; // Max allowed for Vercel Hobby tier

const MAX_BYTES = 4.5 * 1024 * 1024; // Vercel Serverless limit is 4.5MB

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 4.5MB)" },
        { status: 400 }
      );
    }

    const mime = (file as File).type || "application/octet-stream";
    if (mime !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF uploads are allowed" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromPdfBuffer(buffer);

    if (!text || text.length < 40) {
      return NextResponse.json(
        { error: "Could not extract enough text from the PDF" },
        { status: 422 }
      );
    }

    const analysis = await analyzeResumeText(text);

    const safeName = z
      .string()
      .max(200)
      .safeParse((file as File).name || "resume.pdf");
    const fileName = safeName.success ? safeName.data : "resume.pdf";

    const path = `${user.id}/${Date.now()}-${fileName.replace(/[^\w.\-]+/g, "_")}`;

    const { error: upErr } = await supabase.storage
      .from("resumes")
      .upload(path, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (upErr) {
      console.error(upErr);
      return NextResponse.json(
        { error: "Storage upload failed. Ensure the resumes bucket exists." },
        { status: 500 }
      );
    }

    const { error: dbErr } = await supabase.from("resume_reports").insert({
      user_id: user.id,
      storage_path: path,
      file_name: fileName,
      ats_score: analysis.atsScore,
      report: analysis as unknown as Record<string, unknown>,
    });

    if (dbErr) {
      console.error(dbErr);
      return NextResponse.json(
        { error: "Could not save report" },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
