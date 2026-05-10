import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-24">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
