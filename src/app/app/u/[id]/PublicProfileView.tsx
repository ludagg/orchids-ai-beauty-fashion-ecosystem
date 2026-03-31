"use client";

import {
  Heart,
  Play,
  Video,
  Share2,
  Loader2,
  Award,
  TrendingUp,
  Calendar,
  Star,
  Sparkles,
  MapPin,
  ArrowRight,
  UserPlus,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

// Interface for User Data
interface UserData {
    name: string;
    image: string | null;
    email: string;
    id: string;
    loyaltyPoints?: number;
    createdAt?: Date;
    bio?: string;
    socialLinks?: string;
    handle?: string;
}

interface VideoData {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    videoUrl: string;
    views: number;
    likes: number;
    createdAt: string;
    status: 'published' | 'draft' | 'private';
}

interface PublicProfileViewProps {
    user: UserData;
    stats: {
        followers: number;
        following: number;
        likes: number;
    };
    initialIsFollowing: boolean;
    isSalonOwner: boolean;
    currentUserId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

export default function PublicProfileView({ user, stats: initialStats, initialIsFollowing, isSalonOwner, currentUserId }: PublicProfileViewProps) {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [stats, setStats] = useState(initialStats);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  // Fetch Videos
  const fetchVideos = useCallback(async () => {
    try {
        const res = await fetch(`/api/videos?userId=${user.id}`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            setVideos(data.map((v: any) => ({
                ...v,
                status: v.status || 'published',
                thumbnailUrl: v.thumbnailUrl || v.videoUrl
            })));
        }
    } catch (error) {
        console.error("Failed to fetch videos", error);
    } finally {
        setIsLoadingVideos(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleToggleFollow = async () => {
    if (!currentUserId) {
      toast.error("Please login to follow users");
      router.push("/auth");
      return;
    }

    if (isTogglingFollow) return;
    setIsTogglingFollow(true);

    try {
        const res = await fetch(`/api/users/${user.id}/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: isFollowing ? 'unfollow' : 'follow' })
        });

        if (res.ok) {
            const data = await res.json();
            setIsFollowing(data.isFollowing);
            setStats(prev => ({
                ...prev,
                followers: data.isFollowing ? prev.followers + 1 : Math.max(0, prev.followers - 1)
            }));
            toast.success(data.isFollowing ? `You are now following ${user.name}` : `Unfollowed ${user.name}`);
        } else {
            toast.error("Failed to update follow status");
        }
    } catch (error) {
        toast.error("An error occurred");
    } finally {
        setIsTogglingFollow(false);
    }
  };

  const handleShare = async () => {
    try {
        await navigator.share({
            title: `${user.name} on Priisme`,
            url: window.location.href
        });
    } catch (err) {
        // Share not supported or cancelled
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard");
    }
  };

  const publishedVideos = videos.filter(v => v.status === 'published');

  // Display Logic - Always User Info
  const displayName = user.name;
  const displayHandle = user.handle || (user.email ? `@${user.email.split('@')[0]}` : "@creator");
  const displayAvatar = user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";
  const displayBio = user.bio || "Fashion enthusiast & style curator. Bringing you the latest trends.";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* Hero Section - Clean & Professional */}
      <motion.div variants={itemVariants} className="relative border-b border-border/50 bg-background pt-8 pb-8 md:pt-12 md:pb-12">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-10">

            {/* Avatar */}
            <div className="relative shrink-0 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-lg overflow-hidden bg-muted">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={displayAvatar} className="object-cover" alt={displayName} />
                      <AvatarFallback className="text-4xl font-semibold bg-muted text-muted-foreground">
                        {displayName ? displayName.substring(0, 2).toUpperCase() : "US"}
                      </AvatarFallback>
                    </Avatar>
                </div>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 space-y-6 w-full text-center lg:text-left pt-2">

              {/* Name and Badges */}
              <div className="space-y-2">
                <div className="flex flex-col lg:flex-row items-center gap-3 justify-center lg:justify-start">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {displayName}
                  </h1>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                    {isSalonOwner && (
                      <Badge variant="default" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        Partner
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      Verified
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground font-medium flex items-center justify-center lg:justify-start gap-1 text-base">
                  <span className="text-primary font-semibold">@</span>
                  {displayHandle.replace('@', '')}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:divide-x sm:divide-border/50 py-2">
                <StatItem value={stats.followers >= 1000 ? `${(stats.followers / 1000).toFixed(1)}K` : stats.followers} label="Followers" />
                <StatItem value={stats.following} label="Following" />
                <StatItem value={stats.likes >= 1000 ? `${(stats.likes / 1000).toFixed(1)}K` : stats.likes} label="Likes" />
                <StatItem value={publishedVideos.length} label="Videos" />
              </div>

              {/* Bio */}
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 text-sm md:text-base">
                {displayBio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleToggleFollow}
                  disabled={isTogglingFollow}
                  className={cn(
                      "w-full sm:w-auto min-w-[140px] transition-all",
                      isFollowing ? "bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive border border-transparent" : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {isTogglingFollow ? (
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isFollowing ? (
                     <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                     </>
                  ) : (
                     <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                     </>
                  )}
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="h-10 w-10 rounded-full border border-border/50"
                        aria-label="Share profile"
                      >
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share profile</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="videos" className="w-full">
        {/* Sticky Tabs List */}
        <div className="sticky top-[7.25rem] lg:top-16 z-30 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50 w-full transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                <TabsList className="w-full h-14 justify-start overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 bg-transparent border-0 gap-2 sm:gap-6">
                    <TabsTrigger
                    value="videos"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 sm:px-4 h-full gap-2 font-medium text-muted-foreground transition-all hover:text-foreground"
                    >
                    <Video className="w-4 h-4" />
                    Videos
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {publishedVideos.length}
                    </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 sm:px-4 h-full gap-2 font-medium text-muted-foreground transition-all hover:text-foreground"
                    >
                    <Award className="w-4 h-4" />
                    About
                    </TabsTrigger>
                </TabsList>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[50vh]">
          <TabsContent value="videos" className="mt-0 focus-visible:outline-none">
            {isLoadingVideos ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                  {publishedVideos.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
                {publishedVideos.length === 0 && (
                  <EmptyState type="videos" />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="about" id="profile-about" className="mt-0 focus-visible:outline-none">
            <AboutSection user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}

// Stat Item Component
function StatItem({ value, label, trend }: { value: string | number, label: string, trend?: string }) {
  return (
    <div className="text-center sm:text-left flex flex-col items-center sm:items-start p-2 sm:p-0">
      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span className="hidden sm:inline-flex text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">{label}</p>
    </div>
  );
}

// Video Card Component
function VideoCard({ video, index }: { video: VideoData, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      role="article"
      aria-label={`Video: ${video.title}`}
    >
      <Link
        href={`/app/videos-creations/${video.id}`}
        className="group relative block aspect-[9/16] rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-border/20"
      >
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Video className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </motion.div>
        </div>

        {/* Views Counter */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white drop-shadow-md">
          <Play className="w-3 h-3 fill-white" />
          <span className="text-xs font-semibold">
            {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}K` : video.views}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <Video className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="space-y-2 max-w-xs sm:max-w-sm px-4">
        <h3 className="text-lg font-semibold text-foreground">No videos yet</h3>
        <p className="text-sm text-muted-foreground">
          This creator hasn't uploaded any public videos yet.
        </p>
      </div>
    </div>
  );
}

// About Section Component
function AboutSection({ user }: { user: UserData }) {
  let socialLinks = { instagram: '', youtube: '', website: '' };
  try {
      if (user.socialLinks) {
          socialLinks = JSON.parse(user.socialLinks);
      }
  } catch (e) {
      console.error(e);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>About {user.name}</CardTitle>
          <CardDescription>Get to know more</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="w-4 h-4" />
                <span>Content Creator</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Global</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Fashion & Beauty Enthusiast</span>
              </div>
            </div>
          </div>

          {user.bio && (
            <>
                <Separator />
                <div>
                     <h4 className="font-semibold mb-2 text-sm">Bio</h4>
                     <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
                </div>
            </>
          )}

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 text-sm">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {['Fashion', 'Beauty', 'Hairstyle', 'Skincare', 'Makeup', 'Trends', 'Lifestyle'].map((interest) => (
                <Badge key={interest} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 font-normal">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect with {user.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { platform: 'Instagram', handle: socialLinks.instagram || 'Add link', icon: 'I', url: socialLinks.instagram ? `https://instagram.com/${socialLinks.instagram.replace('@', '')}` : '#' },
              { platform: 'YouTube', handle: socialLinks.youtube || 'Add link', icon: 'Y', url: socialLinks.youtube ? `https://youtube.com/@${socialLinks.youtube.replace('@', '')}` : '#' },
              { platform: 'Website', handle: socialLinks.website || 'Add link', icon: 'W', url: socialLinks.website || '#' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors bg-card hover:bg-accent/50 group"
                aria-label={`Connect on ${social.platform}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                    <span className="text-foreground text-xs font-bold">{social.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{social.platform}</p>
                    <p className="text-xs text-muted-foreground">{social.handle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
