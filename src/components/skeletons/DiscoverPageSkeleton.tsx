import { Skeleton } from "@/components/ui/skeleton";
import SalonCardSkeleton from "./SalonCardSkeleton";

export default function DiscoverPageSkeleton() {
  return (
    <div className="flex-1 min-h-screen bg-background pb-20 lg:pb-10">
      <div className="p-4 space-y-8 max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1]">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Trending Styles */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-4 overflow-hidden pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48">
                <Skeleton className="aspect-[3/4] rounded-2xl mb-2" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
        </section>

        {/* Top Salons */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SalonCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Marketplace Picks */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <Skeleton className="h-6 w-56" />
             <Skeleton className="h-4 w-16" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="group">
                 <Skeleton className="aspect-[3/4] rounded-2xl mb-3" />
                 <Skeleton className="h-4 w-3/4 rounded-md mb-1" />
                 <Skeleton className="h-3 w-1/2 rounded-md mb-2" />
                 <Skeleton className="h-4 w-1/3 rounded-md" />
               </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
