"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[app error]", error);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="max-w-md space-y-2">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {process.env.NODE_ENV === "development" && error.message
            ? error.message
            : "Try again or return home."}
        </p>
      </div>
      <div className="flex gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
