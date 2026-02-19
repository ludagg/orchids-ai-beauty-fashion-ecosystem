import DashboardStatsSkeleton from "@/components/skeletons/DashboardStatsSkeleton";
import AppointmentItemSkeleton from "@/components/skeletons/AppointmentItemSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 bg-background p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <DashboardStatsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <AppointmentItemSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-3">
               {Array.from({ length: 4 }).map((_, i) => (
                 <Skeleton key={i} className="h-20 rounded-2xl" />
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
