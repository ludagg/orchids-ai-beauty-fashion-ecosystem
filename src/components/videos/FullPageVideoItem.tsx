"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, ShoppingBag, Music, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

interface Video {
  id: string;
  thumbnailUrl: string | null;
  videoUrl: string;
  title: string;
  description?: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  products?: Product[];
}

interface FullPageVideoItemProps {
  video: Video;
  isActive: boolean;
}

export function FullPageVideoItem({ video, isActive }: FullPageVideoItemProps) {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  // Handle Play/Pause based on active state
  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {
        // Autoplay might be blocked, user interaction required
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
      // Reset video
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
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
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user) {
      toast.error("Please login to like videos");
      return;
    }

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    if (newLikedState) {
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 800);
    }

    try {
      const res = await fetch(`/api/videos/${video.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIsLiked(data.liked);
      setLikesCount(data.likes);
    } catch (err) {
      setIsLiked(!newLikedState);
      setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
      toast.error("Failed to update like");
    }
  };

  const handleShopClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would open a sheet with products
    toast.success(`View products: ${video.products?.map(p => p.name).join(", ")}`);
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        poster={video.thumbnailUrl || undefined}
      />

      {/* Play/Pause Overlay Icon (Briefly shown or if paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <Play className="w-16 h-16 text-white/50 fill-white/50" />
        </div>
      )}

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-24 right-4 z-20 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/80 hover:bg-black/40 transition-colors"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Gradient Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Right Sidebar Actions */}
      <div className="absolute right-2 bottom-20 flex flex-col items-center gap-6 z-20 pb-safe">
        {/* Avatar / Follow */}
        <div className="relative mb-2">
            <Link href={`/profile/${video.user.id}`} className="block">
                <Avatar className="w-12 h-12 border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                    <AvatarImage src={video.user.image || undefined} />
                    <AvatarFallback>{video.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>
            {/* Plus Icon for Follow (Mock logic) */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center border border-white">
                <span className="text-xs font-bold">+</span>
            </div>
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <Heart className={cn("w-7 h-7 transition-all", isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white fill-transparent")} />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">{likesCount}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <MessageCircle className="w-7 h-7 text-white fill-white/10" />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">0</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 group">
             <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <Share2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-md">Share</span>
        </button>

        {/* Shop (Conditional) */}
        {video.products && video.products.length > 0 && (
             <button onClick={handleShopClick} className="flex flex-col items-center gap-1 group mt-2 animate-pulse">
                <div className="p-2 rounded-full bg-primary/80 backdrop-blur-sm group-hover:bg-primary transition-all shadow-lg shadow-primary/20">
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full mt-1">Shop</span>
            </button>
        )}

        {/* Music Disc Animation */}
         <div className="mt-4 animate-[spin_5s_linear_infinite]">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center relative overflow-hidden">
                 <Image
                    src={video.user.image || "/images/placeholder-avatar.png"}
                    alt="Music"
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 object-cover opacity-80"
                />
            </div>
        </div>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute left-4 right-16 bottom-8 z-20 flex flex-col gap-3 pb-safe pl-1">
        <div className="flex flex-col gap-1">
             <Link href={`/profile/${video.user.id}`} className="font-bold text-white text-lg drop-shadow-md hover:underline w-fit">
                @{video.user.name.replace(/\s+/g, '').toLowerCase()}
            </Link>
            <p className="text-white/90 text-sm font-normal line-clamp-2 drop-shadow-md">
                {video.description || video.title}
                <span className="font-bold ml-2">#rare #beauty</span>
            </p>
        </div>

        {/* Music Ticker */}
        <div className="flex items-center gap-2 text-white/90">
            <Music className="w-3 h-3" />
            <div className="text-xs font-medium overflow-hidden w-40">
                <div className="animate-marquee whitespace-nowrap">
                    Original Sound - {video.user.name} • Rare Beauty
                </div>
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
        />
      </div>

      {/* Heart Explosion Animation */}
      <AnimatePresence>
        {showHeartAnimation && (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 3, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            >
                <Heart className="w-32 h-32 fill-red-500 text-red-500 drop-shadow-xl" />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
