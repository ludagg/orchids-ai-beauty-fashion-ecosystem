"use client";

import {
  Heart,
  Upload,
  Play,
  Edit,
  Settings,
  Video,
  Share2,
  LayoutDashboard,
  Loader2,
  Gift,
  Award,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VideoUploadModal } from "@/components/profile/VideoUploadModal";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// [Jules - Modularizing ProfileView imports]
import { StatItem } from "@/components/profile/StatItem";
import { ProfileVideoCard } from "@/components/profile/ProfileVideoCard";
import { ProfileEmptyState } from "@/components/profile/ProfileEmptyState";
import { RewardsSection } from "@/components/profile/RewardsSection";
import { AboutSection } from "@/components/profile/AboutSection";
import { UserData, VideoData } from "@/components/profile/types";


// Interface for User Data
interface ProfileViewProps {
    user: UserData;
    isSalonOwner: boolean;
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

export default function ProfileView({ user, isSalonOwner }: ProfileViewProps) {
  const router = useRouter();

  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

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

  const publishedVideos = videos.filter(v => v.status === 'published');

  // Display Logic - Always User Info
  const displayName = user.name;
  const displayHandle = user.email ? `@${user.email.split('@')[0]}` : "@creator";
  const displayAvatar = user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";
  const displayBio = user.bio || "Fashion enthusiast & style curator. Bringing you the latest trends.";

  // Mock stats
  const stats = {
    followers: "12.5K",
    likes: "45.2K",
    views: "1.2M",
    engagement: "4.8%",
    videos: publishedVideos.length
  };

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

              {/* Online/Active indicator */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-background shadow-sm" />

              {/* Edit Avatar Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-2 shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setIsEditProfileModalOpen(true)}
                    aria-label="Edit avatar"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit avatar</p>
                </TooltipContent>
              </Tooltip>
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
                    <Badge variant="secondary">
                      Pro
                    </Badge>
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

              {/* Stats Grid — cliquable pour voir le détail */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:divide-x sm:divide-border/50 py-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("profile-about");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:opacity-70 transition-opacity text-left"
                >
                  <StatItem value={stats.followers} label="Followers" trend="+12%" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("profile-about");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:opacity-70 transition-opacity text-left"
                >
                  <StatItem value="482" label="Following" trend="+3%" />
                </button>
                <Link href="/app/videos-creations" className="hover:opacity-70 transition-opacity">
                  <StatItem value={stats.likes} label="Likes" trend="+8%" />
                </Link>
                <Link href="/app/videos-creations" className="hover:opacity-70 transition-opacity">
                  <StatItem value={stats.videos} label="Videos" />
                </Link>
              </div>

              {/* Bio */}
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 text-sm md:text-base">
                {displayBio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="w-full sm:w-auto min-w-[140px]"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>

                {!isSalonOwner ? (
                  <Link href="/become-partner" className="w-full sm:w-auto min-w-[140px]">
                      <Button className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Become Partner
                      </Button>
                  </Link>
                ) : (
                  <Link href="/app/my-business" className="w-full sm:w-auto min-w-[140px]">
                    <Button
                      className="w-full"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      My Businesses
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full border border-border/50"
                        aria-label="Profile settings"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Profile settings</p>
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
                    value="rewards"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 sm:px-4 h-full gap-2 font-medium text-muted-foreground transition-all hover:text-foreground"
                    >
                    <Gift className="w-4 h-4" />
                    Rewards
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {user.loyaltyPoints || 0}
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
                    <ProfileVideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
                {publishedVideos.length === 0 && (
                  <ProfileEmptyState type="videos" onUpload={() => setIsVideoUploadModalOpen(true)} />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="rewards" className="mt-0 focus-visible:outline-none">
            <RewardsSection user={user} />
          </TabsContent>

          <TabsContent value="about" id="profile-about" className="mt-0 focus-visible:outline-none">
            <AboutSection user={user} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-24 lg:bottom-12 right-4 lg:right-8 z-40"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              onClick={() => setIsVideoUploadModalOpen(true)}
              className="rounded-full w-14 h-14 shadow-lg p-0 flex items-center justify-center"
              aria-label="Upload new video"
            >
              <Upload className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Upload new video</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      <VideoUploadModal
        isOpen={isVideoUploadModalOpen}
        onOpenChange={setIsVideoUploadModalOpen}
        onSuccess={fetchVideos}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onOpenChange={setIsEditProfileModalOpen}
        user={user}
        onSave={() => window.location.reload()}
      />
    </motion.div>
  );
}










