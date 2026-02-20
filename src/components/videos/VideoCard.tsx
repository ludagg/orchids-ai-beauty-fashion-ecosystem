"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 opacity-60 group-hover:opacity-80 transition-opacity" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 drop-shadow-md leading-tight">
                    {video.title}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 border border-white/20">
                            <AvatarImage src={video.user.image || undefined} />
                            <AvatarFallback>{video.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-white/90 truncate max-w-[80px]">
                            {video.user.name}
                        </span>
                    </div>

                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1 hover:scale-110 transition-transform"
                    >
                        <Heart
                            className={cn("w-4 h-4 drop-shadow-sm", isLiked ? "fill-red-500 text-red-500" : "text-white")}
                        />
                        <span className="text-xs font-medium">{likesCount}</span>
                    </button>
                </div>
            </div>
        </Link>
    </div>
  );
}
