import { Skeleton } from "@/components/ui/skeleton";

export default function SqlLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>
      
      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-full lg:w-[400px] rounded-lg" />
      
      <div className="space-y-4 mt-6">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
