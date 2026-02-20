"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullPageVideoFeed, Video } from "@/components/videos/FullPageVideoFeed";

export default function VideosCreationsPage() {
  const { data: session } = useSession();
  const [feedType, setFeedType] = useState<"foryou" | "following">("foryou");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Reset feed when switching tabs
  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchVideos(1, true); // Fetch immediately
  }, [feedType]);

  const fetchVideos = useCallback(async (pageNum: number, isReset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", "10"); // Smaller limit for heavier video items

      if (feedType === "following") {
        params.append("following", "true");
      }

      const res = await fetch(`/api/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();

        // Transform data
        const transformed: Video[] = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl,
          views: Number(v.views),
          likes: Number(v.likes),
          isLiked: v.isLiked,
          user: {
            id: v.user.id,
            name: v.user.name,
            image: v.user.image,
          },
          products: v.products
        }));

        setVideos((prev) => {
          if (isReset) return transformed;
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const newVideos = transformed.filter((t: any) => !existingIds.has(t.id));
          return [...prev, ...newVideos];
        });

        if (transformed.length < 10) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  }, [feedType]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchVideos(nextPage);
    }
  };

  return (
    <div className="h-full w-full bg-black relative">
        {/* Floating Header Tabs */}
        <div className="absolute top-4 left-0 right-0 z-40 flex justify-center items-center gap-6 pointer-events-auto">
            <button
                onClick={() => setFeedType("following")}
                className={cn(
                    "text-lg font-bold drop-shadow-md transition-opacity duration-300",
                    feedType === "following" ? "text-white opacity-100 scale-110" : "text-white/60 opacity-60 hover:opacity-80"
                )}
            >
                Following
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
                onClick={() => setFeedType("foryou")}
                className={cn(
                    "text-lg font-bold drop-shadow-md transition-opacity duration-300",
                    feedType === "foryou" ? "text-white opacity-100 scale-110" : "text-white/60 opacity-60 hover:opacity-80"
                )}
            >
                For You
            </button>
        </div>

        {/* Video Feed */}
        {videos.length === 0 && loading ? (
            <div className="flex h-full items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-white/50" />
            </div>
        ) : (
            <FullPageVideoFeed
                videos={videos}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loading={loading}
            />
        )}
    </div>
  );
}
