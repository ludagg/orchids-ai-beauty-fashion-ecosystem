"use client";

import { useState, useEffect, useCallback } from "react";
import { StoriesRail } from "@/components/videos/StoriesRail";
import { MasonryVideoGrid } from "@/components/videos/MasonryVideoGrid";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function VideosCreationsPage() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    fetchVideos(1, true);
  }, []);

  const fetchVideos = useCallback(async (pageNum: number, isReset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", "20");

      const res = await fetch(`/api/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();

        // Transform data to match MasonryVideoGrid expectations
        const transformed = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl,
          views: v.views, // Ensure number
          likes: v.likes, // Ensure number
          isLiked: v.isLiked,
          user: {
            id: v.user.id,
            name: v.user.name,
            image: v.user.image,
          },
        }));

        setVideos((prev) => {
          if (isReset) return transformed;
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const newVideos = transformed.filter((t: any) => !existingIds.has(t.id));
          return [...prev, ...newVideos];
        });

        if (transformed.length < 20) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasMore && !loading && videos.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage);
    }
  }, [inView, hasMore, loading, videos.length, page, fetchVideos]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Stories Rail */}
      <div className="pt-2">
        <StoriesRail />
      </div>

      {/* Masonry Grid */}
      <div className="flex-1 max-w-[2000px] mx-auto w-full pt-4">
        <MasonryVideoGrid videos={videos} />

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={ref} className="h-4" />
      </div>
    </div>
  );
}
