import CreatorRailSkeleton from "@/components/skeletons/CreatorRailSkeleton";
import VideoCardSkeleton from "@/components/skeletons/VideoCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Live Hero Skeleton */}
       <div className="relative aspect-[9/16] sm:aspect-video rounded-[32px] overflow-hidden bg-card border border-border shadow-sm">
          <Skeleton className="w-full h-full" />
       </div>

      {/* Creator Rail */}
      <section>
          <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-32" />
          </div>
          <CreatorRailSkeleton />
      </section>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
           <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
