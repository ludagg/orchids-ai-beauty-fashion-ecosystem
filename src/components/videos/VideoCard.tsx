"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

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
        <Link href={`/app/videos-creations/${video.id}`} className="block relative aspect-[9/16] w-full bg-black">
            {/* Thumbnail */}
            {video.thumbnailUrl ? (
                <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/20">
                    <Play className="w-12 h-12" />
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
                />
            )}

            {/* Play Icon - Top Right */}
            <div className="absolute top-3 right-3 p-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
                <Play className="w-3 h-3 text-white fill-white" />
            </div>

            {/* Overlay Gradient - Bottom Only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-end justify-between z-10">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                    <span className="text-[10px] font-medium text-white/80 truncate">
                        @{video.user.name.replace(/\s+/g, '')}
                    </span>
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 drop-shadow-sm">
                        {video.title}
                    </h3>
                </div>

                <button
                    onClick={handleLike}
                    className="flex items-center gap-1 hover:scale-110 transition-transform mb-0.5"
                >
                    <Heart
                        className={cn("w-4 h-4 drop-shadow-sm", isLiked ? "fill-red-500 text-red-500" : "text-white")}
                    />
                    <span className="text-xs font-medium">{likesCount}</span>
                </button>
            </div>
        </Link>
    </div>
  );
}
