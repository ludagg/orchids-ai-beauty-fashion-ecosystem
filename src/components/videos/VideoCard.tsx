"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [isHovering, setIsHovering] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
        toast.error("Please login to like videos");
        return;
    }

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
        const res = await fetch(`/api/videos/${video.id}/like`, {
            method: "POST"
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Sync with server state
        setIsLiked(data.liked);
        setLikesCount(data.likes);
    } catch (err) {
        // Revert on failure
        setIsLiked(!newLikedState);
        setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
        toast.error("Failed to update like");
    }
  };

  return (
    <div
        className="relative group rounded-xl overflow-hidden bg-muted/30 mb-4 break-inside-avoid"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
    >
        <Link
            href={`/app/videos-creations/${video.id}`}
            className="block relative aspect-[9/16] w-full bg-black outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            aria-label={`Watch video: ${video.title}`}
        >
            {/* Thumbnail */}
            {video.thumbnailUrl ? (
                <Image
                    src={video.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/20">
                    <Play className="w-12 h-12" aria-hidden="true" />
                </div>
            )}

            {/* Video Preview on Hover (Optional, maybe for desktop) */}
            {isHovering && (
                <video
                    src={video.videoUrl}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover hidden md:block"
                    aria-hidden="true"
                />
            )}

            {/* Play Icon - Top Right */}
            <div className="absolute top-3 right-3 p-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
                <Play className="w-3 h-3 text-white fill-white" aria-hidden="true" />
            </div>

            {/* Overlay Gradient - Bottom Only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none" />

            {/* Content Info (Non-interactive labels) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-end justify-between pointer-events-none">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                    <span className="text-[10px] font-medium text-white/80 truncate">
                        @{video.user.name.replace(/\s+/g, '')}
                    </span>
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 drop-shadow-sm">
                        {video.title}
                    </h3>
                </div>
            </div>
        </Link>

        {/* Like Button - Absolute sibling to the Link to fix nesting */}
        <div className="absolute bottom-3 right-3 z-20">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1 hover:scale-110 transition-transform p-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring bg-black/20 backdrop-blur-sm md:bg-transparent"
                        aria-label={`${isLiked ? 'Unlike' : 'Like'} video. ${likesCount} likes`}
                    >
                        <Heart
                            className={cn("w-4 h-4 drop-shadow-sm", isLiked ? "fill-red-500 text-red-500" : "text-white")}
                            aria-hidden="true"
                        />
                        <span className="text-xs font-medium text-white">{likesCount}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>{isLiked ? 'Unlike' : 'Like'}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    </div>
  );
}
