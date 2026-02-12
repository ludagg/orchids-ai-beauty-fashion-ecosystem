import { Skeleton } from "@/components/ui/skeleton";

export default function SalonCardSkeleton() {
  return (
    <div className="flex bg-card p-3 rounded-2xl border border-border h-[130px]">
      <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="ml-4 flex-1 py-1 flex flex-col justify-between">
        <div className="space-y-2">
            <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
        <Skeleton className="h-3 w-1/3 self-start rounded-md" />
      </div>
    </div>
  );
}
