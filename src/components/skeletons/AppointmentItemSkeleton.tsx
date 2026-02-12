import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>
        <Skeleton className="h-2 w-16 rounded-md" />
      </div>
    </div>
  );
}
