"use client";

import { VideoCard } from "./VideoCard";

interface Video {
  id: string;
  thumbnailUrl: string | null;
  videoUrl: string;
  title: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface MasonryVideoGridProps {
  videos: Video[];
}

export function MasonryVideoGrid({ videos }: MasonryVideoGridProps) {
  if (!videos || videos.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
        No videos found
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-4 pb-20">
      {videos.map((video) => (
        <div key={video.id} className="break-inside-avoid mb-4">
            <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
}
