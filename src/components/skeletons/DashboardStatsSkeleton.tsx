import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-card rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-10 h-6 rounded-lg" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
