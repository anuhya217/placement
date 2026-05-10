import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-10">
      <Skeleton className="w-full h-[300px] rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="w-full h-[150px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-48 h-8 rounded-lg" />
          <Skeleton className="w-full h-[400px] rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-32 h-8 rounded-lg" />
          <Skeleton className="w-full h-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
