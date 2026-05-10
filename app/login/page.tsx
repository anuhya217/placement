import Link from "next/link";
import { Suspense } from "react";
import { Brain } from "lucide-react";
import { LoginForm } from "@/app/login/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Link
        href="/"
        className="mb-10 flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Brain className="h-5 w-5" />
        </span>
        Placement AI
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Use your placement portal credentials.
        </p>
        <div className="mt-6">
          <Suspense
            fallback={<Skeleton className="h-48 w-full rounded-lg" />}
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
