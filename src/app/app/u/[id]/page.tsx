"use client";

import { useEffect, useState, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Heart, Play, Video } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load profile");
        }
        const data = await res.json();
        setProfileData(data);
        setFollowing(data.isFollowing);
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    async function fetchVideos() {
      try {
        const res = await fetch(`/api/videos?userId=${id}&limit=10`);
        if (res.ok) {
          const data = await res.json();
          setVideos(data.videos || []);
        }
      } catch (err) {
        console.error("Failed to load videos", err);
      } finally {
        setVideosLoading(false);
      }
    }

    fetchProfile();
    fetchVideos();
  }, [id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const res = await fetch(`/api/users/${id}/follow`, {
        method: "POST",
      });
      if (!res.ok) {
        if (res.status === 401) {
            toast.error("Please login to follow users");
            router.push("/auth/sign-in");
            return;
        }
        throw new Error("Failed to follow/unfollow");
      }
      const data = await res.json();
      setFollowing(data.following);
      toast.success(data.following ? "Followed successfully" : "Unfollowed successfully");

      // Update local stats
      setProfileData((prev: any) => ({
          ...prev,
          stats: {
              ...prev.stats,
              followers: data.following ? prev.stats.followers + 1 : prev.stats.followers - 1
          }
      }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profileData || !profileData.user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const { user, stats } = profileData;

  return (
    <div className="container max-w-4xl py-8">
      {/* Profile Header */}
      <Card className="mb-8 border-none bg-muted/50">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
                <p className="text-muted-foreground font-medium">{user.handle}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.followers}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.following}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.likes}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Likes</p>
                </div>
              </div>

              <p className="text-sm md:text-base max-w-2xl mx-auto md:mx-0">
                {user.bio || "No bio available."}
              </p>

              {user.role === 'salon_owner' && (
                  <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium mt-2">
                      Salon Owner
                  </div>
              )}
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3">
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                variant={following ? "outline" : "default"}
                className="w-full md:w-32 shadow-sm transition-all"
              >
                {followLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Content */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
           <Play className="h-5 w-5" /> Videos
        </h2>

        {videosLoading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-muted cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => router.push(`/app/videos-creations/${video.id}`)}
              >
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-white">
                     <p className="font-semibold line-clamp-1">{video.title}</p>
                     <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                         <Play className="h-3 w-3" fill="currentColor" /> {video.views}
                     </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No videos yet</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              This user hasn't uploaded any videos yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
