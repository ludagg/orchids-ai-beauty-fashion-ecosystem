"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, ShoppingBag, Volume2, VolumeX, Play, Pause, MoreVertical, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  brand?: string;
}

interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  likes: number;
  views: number;
  isLiked?: boolean;
  category?: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  products?: Product[];
}

interface FullPageVideoProps {
  video: Video;
  isActive: boolean;
  onOpenComments: () => void;
  onOpenProducts: () => void;
}

export default function FullPageVideo({ video, isActive, onOpenComments, onOpenProducts }: FullPageVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const { data: session } = useSession();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Sync play state with active state
  useEffect(() => {
    if (isActive) {
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
            setIsMuted(true);
          });
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      toast.error("Please login to like");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await fetch(`/api/videos/${video.id}/like`, { method: "POST" });
    } catch (error) {
      console.error("Like failed", error);
      // Revert
      setLiked(!newLiked);
      setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed or cancelled", err);
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        poster={video.thumbnailUrl}
      />

      {/* Play/Pause Overlay Indicator (Animated) */}
      <AnimatePresence>
        {!isPlaying && isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-0" />

      {/* Right Sidebar Actions */}
      <div className="absolute right-2 bottom-28 z-20 flex flex-col items-center gap-6 pb-4 md:right-4 md:bottom-12">
        {/* Creator Avatar */}
        <div className="relative group">
          <Link href={`/app/videos-creations/creator/${video.user.id}`}>
            <div className="p-0.5 rounded-full border-2 border-white/50 hover:border-primary transition-colors cursor-pointer">
              <Avatar className="w-10 h-10 md:w-12 md:h-12 border border-black">
                <AvatarImage src={video.user.image} alt={video.user.name} />
                <AvatarFallback>{video.user.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </Link>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full p-0.5 shadow-sm scale-75 cursor-pointer">
            <div className="w-3 h-3 flex items-center justify-center font-bold text-[10px]">+</div>
          </div>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleLike}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all active:scale-90"
          >
            <Heart
              className={`w-7 h-7 md:w-8 md:h-8 transition-all ${
                liked ? "fill-rose-500 text-rose-500 scale-110" : "text-white"
              }`}
            />
          </button>
          <span className="text-white text-xs font-bold shadow-black drop-shadow-md">
            {likesCount}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments();
            }}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all active:scale-90"
          >
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white fill-white/10" />
          </button>
          <span className="text-white text-xs font-bold shadow-black drop-shadow-md">
            Comment
          </span>
        </div>

        {/* Shop Button (Sidebar) */}
        {video.products && video.products.length > 0 && (
          <div className="flex flex-col items-center gap-1 animate-in slide-in-from-right-4 fade-in duration-500 delay-150">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenProducts();
              }}
              className="relative p-2.5 rounded-full bg-primary/90 hover:bg-primary transition-all active:scale-90 shadow-lg shadow-primary/20 group"
            >
              <ShoppingBag className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {video.products.length}
              </span>
            </button>
            <span className="text-white text-xs font-bold shadow-black drop-shadow-md">
              Shop
            </span>
          </div>
        )}

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all active:scale-90"
          >
            <Share2 className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </button>
          <span className="text-white text-xs font-bold shadow-black drop-shadow-md">
            Share
          </span>
        </div>

         {/* Mute Toggle */}
         <div className="flex flex-col items-center gap-1 mt-2">
            <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all"
            >
                {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
            </button>
         </div>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-24 md:pb-6 z-10 flex flex-col justify-end pointer-events-none">
        <div className="pointer-events-auto space-y-3">
            {/* Shop Product Pill - Anchored Bottom Left */}
            {video.products && video.products.length > 0 && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenProducts();
                    }}
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2 pr-4 w-fit cursor-pointer hover:bg-black/60 transition-all group"
                >
                    <div className="w-10 h-10 rounded-md bg-white overflow-hidden flex-shrink-0">
                        <img src={video.products[0].images?.[0]} alt={video.products[0].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-bold flex items-center gap-1">
                            Shop {video.products.length} items
                            <ShoppingBag className="w-3 h-3 text-primary" />
                        </span>
                        <span className="text-white/70 text-[10px] truncate max-w-[150px]">
                            {video.products[0].name}
                        </span>
                    </div>
                    <div className="ml-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
                        Buy
                    </div>
                </div>
            )}

          <div>
            <Link href={`/app/videos-creations/creator/${video.user.id}`} className="inline-block">
                <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md mb-1 hover:underline decoration-white/50">
                @{video.user.name}
                </h3>
            </Link>

            <div className="text-white/90 text-sm md:text-base leading-snug drop-shadow-md max-w-[90%] md:max-w-[70%]">
                <div className={`${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                    {video.description}
                    {video.category && (
                        <span className="font-bold text-primary ml-2">#{video.category}</span>
                    )}
                </div>
                {video.description && video.description.length > 60 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDescriptionExpanded(!isDescriptionExpanded);
                        }}
                        className="text-white/70 text-xs font-semibold mt-1 hover:text-white"
                    >
                        {isDescriptionExpanded ? "Show less" : "Show more"}
                    </button>
                )}
            </div>
          </div>

          {/* Scrolling Song/Audio ticker */}
          <div className="flex items-center gap-2 mt-2 text-white/80 text-xs">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="animate-spin duration-[3s]">🎵</span>
              </div>
              <div className="overflow-hidden w-[150px]">
                  <div className="whitespace-nowrap animate-marquee">
                      Original Sound - {video.user.name} • {video.title}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
