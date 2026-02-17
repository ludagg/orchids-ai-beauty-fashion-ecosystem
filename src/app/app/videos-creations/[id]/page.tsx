"use client";

import { Users, Heart, Share2, X, Play, Pause, Volume2, VolumeX, CheckCircle2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchVideo() {
        try {
            const res = await fetch(`/api/videos/${id}`);
            if (res.ok) {
                const data = await res.json();
                setVideo(data);
                setLiked(data.isLiked);
                setLikesCount(data.likes);
                setIsFollowing(data.isFollowing);

                // Increment view
                await fetch(`/api/videos/${id}/view`, { method: 'POST' });
            }
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setLoading(false);
        }
    }
    if (id) fetchVideo();
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
        if (isPlaying) videoRef.current.play().catch(e => console.log("Autoplay failed", e));
        else videoRef.current.pause();
    }
  }, [isPlaying, video]);

  const handleLike = async () => {
    if (!session) {
        toast.error("Please login to like");
        return;
    }
    // Optimistic update
    const previousLiked = liked;
    const previousCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
        const res = await fetch(`/api/videos/${id}/like`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            setLiked(data.liked);
            setLikesCount(data.likes);
        } else {
            // Revert
            setLiked(previousLiked);
            setLikesCount(previousCount);
            toast.error("Failed to like video");
        }
    } catch (error) {
        setLiked(previousLiked);
        setLikesCount(previousCount);
        console.error("Error liking video:", error);
    }
  };

  const handleFollow = async () => {
    if (!session) {
        toast.error("Please login to follow");
        return;
    }
    // Optimistic update
    const previousFollowing = isFollowing;
    setIsFollowing(!isFollowing);

    try {
        const res = await fetch(`/api/users/${video.userId}/follow`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            setIsFollowing(data.following);
            if (data.following) toast.success(`You are now following ${video.user?.name || "Creator"}`);
            else toast.success(`Unfollowed ${video.user?.name || "Creator"}`);
        } else {
            setIsFollowing(previousFollowing);
            toast.error("Failed to follow user");
        }
    } catch (error) {
         setIsFollowing(previousFollowing);
         console.error("Error following user:", error);
    }
  };

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!video) {
      return <div className="min-h-screen flex items-center justify-center">Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <main className="w-full max-w-[1280px] p-4 space-y-4">
        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden group shadow-2xl">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-contain bg-black"
            loop
            muted={isMuted}
            playsInline
          />

          {/* Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-10 pointer-events-auto">
             <div className="flex items-center gap-4">
              {video.isLive && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-card" />
                    Live
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                <Users className="w-3.5 h-3.5" />
                {video.views} views
              </div>
            </div>

            <Link href="/app/videos-creations">
              <button className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/10">
                <X className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            {!isPlaying && (
                <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    <Play className="w-10 h-10 fill-current ml-1" />
                </div>
            )}
          </div>

           {/* Click to Toggle Play */}
           <div
             className="absolute inset-0 z-0 cursor-pointer pointer-events-auto"
             onClick={() => setIsPlaying(!isPlaying)}
           />

           {/* Bottom Right Volume */}
           <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
             <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
           </div>
        </div>

        {/* Video Info & Shopping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground leading-tight">{video.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">{video.category}</span>
                    </div>
                </div>

                {/* Creator & Actions */}
                <div className="flex items-center justify-between border-b border-border pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                             <img src={video.user?.image || "https://github.com/shadcn.png"} alt={video.user?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground flex items-center gap-1">
                                {video.user?.name || "Unknown Creator"}
                                {video.salon && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />}
                            </h3>
                            <button
                                onClick={handleFollow}
                                className="text-xs font-bold text-primary hover:underline"
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        </div>
                    </div>

                     <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border ${
                            liked
                                ? "bg-rose-50 text-rose-600 border-rose-200"
                                : "bg-muted text-foreground border-transparent hover:bg-muted/80"
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                            <span>{likesCount}</span>
                        </button>
                    </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed">
                    <p className="font-bold mb-1">Description</p>
                    {video.description || "No description provided."}
                </div>
            </div>

            {/* Shop the Look Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-3xl p-6 sticky top-6 shadow-xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Shop the Look</h3>
                        <span className="ml-auto bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                            {video.products?.length || 0} items
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {video.products && video.products.length > 0 ? (
                            video.products.map((product: any) => (
                                <Link href={`/app/marketplace/${product.id}`} key={product.id} className="flex gap-3 p-3 rounded-2xl hover:bg-secondary transition-all group border border-transparent hover:border-border">
                                    <div className="w-20 h-24 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mb-2">{product.brand || "Generic"}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="font-bold">{(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ShoppingBag className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No products tagged in this video.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
