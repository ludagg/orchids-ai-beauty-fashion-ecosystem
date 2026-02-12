import { Skeleton } from "@/components/ui/skeleton";

export default function VideoCardSkeleton() {
  return (
    <div className="relative aspect-[9/16] rounded-[24px] overflow-hidden bg-card border border-border shadow-sm">
      <Skeleton className="w-full h-full" />

      {/* Top Badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full bg-background/50" />
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-background/50" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full bg-background/50" />
            <Skeleton className="h-3 w-20 bg-background/50" />
          </div>
          <Skeleton className="h-3 w-8 bg-background/50" />
        </div>
      </div>
    </div>
  );
}
