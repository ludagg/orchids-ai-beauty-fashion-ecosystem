"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Play,
  Share2,
  Video,
  Lock,
  Grid,
  Users,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface CreatorProfile {
    user: {
        id: string;
        name: string;
        image: string | null;
        bio: string;
        handle: string;
    };
    stats: {
        followers: number;
        following: number;
        likes: number;
    };
    isFollowing: boolean;
}

interface Video {
    id: string;
    title: string;
    thumbnailUrl: string;
    views: number;
}

export default function CreatorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
        if (!id) return;
        try {
            const [profileRes, videosRes] = await Promise.all([
                fetch(`/api/users/${id}`),
                fetch(`/api/videos?userId=${id}`)
            ]);

            if (profileRes.ok) {
                setProfile(await profileRes.json());
            }
            if (videosRes.ok) {
                setVideos(await videosRes.json());
            }
        } catch (error) {
            console.error("Error fetching creator:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [id]);

  const handleFollow = async () => {
      if (!session) {
          toast.error("Please login to follow creators");
          router.push("/auth?mode=signin");
          return;
      }
      if (!profile) return;

      setFollowingLoading(true);
      try {
          const res = await fetch(`/api/users/${profile.user.id}/follow`, {
              method: 'POST'
          });

          if (res.ok) {
              const data = await res.json();
              setProfile(prev => prev ? ({
                  ...prev,
                  isFollowing: data.following,
                  stats: {
                      ...prev.stats,
                      followers: data.following ? prev.stats.followers + 1 : prev.stats.followers - 1
                  }
              }) : null);
              toast.success(data.following ? "Following!" : "Unfollowed");
          } else {
              const err = await res.json();
              toast.error(err.error || "Action failed");
          }
      } catch (error) {
          console.error("Follow error", error);
          toast.error("Something went wrong");
      } finally {
          setFollowingLoading(false);
      }
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center h-screen">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
      )
  }

  if (!profile) {
      return (
        <div className="text-center py-20">
            <h2 className="text-xl font-bold">User not found</h2>
        </div>
      )
  }

  const { user, stats, isFollowing } = profile;

  return (
    <div className="max-w-4xl mx-auto min-h-screen pb-20 pt-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-6 mb-8">

        {/* Avatar */}
        <div className="relative group">
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background shadow-xl overflow-hidden">
                <Avatar className="w-full h-full">
                    <AvatarImage src={user.image || undefined} className="object-cover" />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
        </div>

        {/* Name & Handle */}
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight font-display flex items-center justify-center gap-2">
                {user.name}
                {/* Check role if available, for now assume standard badge logic or hide */}
                {/* <Badge variant="secondary" className="text-[10px] h-5 px-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">Pro</Badge> */}
            </h1>
            <p className="text-muted-foreground font-medium">{user.handle}</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 md:gap-12 py-2 w-full max-w-2xl">
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-lg font-bold">{stats.following}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-lg font-bold">{stats.followers}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
            </div>
             <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{stats.likes}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Likes</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
            <Button
                className={`flex-1 min-w-[120px] transition-all ${isFollowing ? "bg-muted text-foreground hover:bg-muted/80" : ""}`}
                size="lg"
                onClick={handleFollow}
                disabled={followingLoading}
                variant={isFollowing ? "secondary" : "default"}
            >
                {followingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isFollowing ? "Following" : "Follow")}
            </Button>
            <Button variant="secondary" size="lg" className="flex-1 min-w-[120px]">
                Message
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11">
                <Share2 className="w-5 h-5" />
            </Button>
        </div>

        {/* Bio */}
         <p className="text-sm text-center max-w-md mx-auto leading-relaxed pt-2">
            {user.bio}
        </p>

      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b h-12 p-0 rounded-none mb-2">
          <TabsTrigger
            value="videos"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Grid className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Heart className="w-4 h-4 mr-2" />
            Liked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
             {videos.length === 0 ? (
                 <div className="text-center py-20 text-muted-foreground">No videos yet.</div>
             ) : (
                <div className="grid grid-cols-3 gap-px md:gap-1">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
             )}
        </TabsContent>

         <TabsContent value="liked" className="mt-0">
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="bg-muted rounded-full p-6">
                    <Lock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">This user's liked videos are private</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    Videos liked by {user.name} are currently hidden.
                </p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
    return (
        <div className="aspect-[9/16] relative bg-muted cursor-pointer overflow-hidden group">
            {video.thumbnailUrl ? (
                 <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Video className="w-8 h-8 opacity-20" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Play className="w-8 h-8 text-white fill-white" />
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white drop-shadow-md">
                <Play className="w-3 h-3 fill-white" />
                <span className="text-xs font-semibold">{video.views}</span>
            </div>
        </div>
    )
}
