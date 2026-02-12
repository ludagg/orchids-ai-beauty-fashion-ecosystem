import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorRailSkeleton() {
  return (
    <div className="overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 sm:gap-6 min-w-max">
        {/* Create Button Skeleton */}
        <div className="flex flex-col items-center gap-2">
           <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px]" />
           <Skeleton className="h-3 w-10 rounded-full" />
        </div>

        {/* Creator Avatars */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 p-[2px]">
              <Skeleton className="w-full h-full rounded-[22px]" />
            </div>
            <Skeleton className="h-3 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
