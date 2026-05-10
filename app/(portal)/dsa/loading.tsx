import { Skeleton } from "@/components/ui/skeleton";

export default function DsaLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>
      
      {/* Progress Bars Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-16 w-full rounded-2xl sm:w-1/2" />
        <Skeleton className="h-16 w-full rounded-2xl sm:w-1/2" />
      </div>

      {/* Topics Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((week) => (
          <div key={week} className="space-y-2">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
