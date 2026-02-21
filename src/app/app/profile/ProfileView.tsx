"use client";

import {
  Heart,
  Upload,
  Play,
  Edit,
  Settings,
  Video,
  Share2,
  Lock,
  LayoutDashboard,
  Loader2,
  Gift,
  Award,
  TrendingUp,
  Calendar,
  Star,
  MoreHorizontal,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight
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

// Interface for User Data
interface UserData {
    name: string;
    image: string | null;
    email: string;
    id: string;
    loyaltyPoints?: number;
    createdAt?: Date;
}

// Interface for Salon Data
interface SalonData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: "SALON" | "BOUTIQUE" | "BOTH";
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

interface ProfileViewProps {
    user: UserData;
    initialSalon: SalonData | null;
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

export default function ProfileView({ user, initialSalon }: ProfileViewProps) {
  const router = useRouter();

  // State
  const [isPartner, setIsPartner] = useState(!!initialSalon);
  const [partnerData, setPartnerData] = useState<{
        businessName: string;
        description: string;
        type: "SALON" | "BOUTIQUE" | "BOTH";
  } | null>(initialSalon ? {
        businessName: initialSalon.name,
        description: initialSalon.description || "",
        type: initialSalon.type
  } : null);
  const [salonId, setSalonId] = useState<string | null>(initialSalon?.id || null);

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

  // Display Logic
  const displayName = isPartner && partnerData ? partnerData.businessName : user.name;
  const displayHandle = isPartner && initialSalon ? `@${initialSalon.slug}` : (user.email ? `@${user.email.split('@')[0]}` : "@creator");
  const displayAvatar = user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";
  const displayBio = isPartner && partnerData ? partnerData.description : "Fashion enthusiast & style curator. Bringing you the latest trends.";

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
                    {isPartner && (
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

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:divide-x sm:divide-border/50 py-2">
                <StatItem value={stats.followers} label="Followers" trend="+12%" />
                <StatItem value="482" label="Following" trend="+3%" />
                <StatItem value={stats.likes} label="Likes" trend="+8%" />
                <StatItem value={stats.videos} label="Videos" />
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

                {!isPartner ? (
                  <Link href="/become-partner" className="w-full sm:w-auto min-w-[140px]">
                      <Button className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Become Partner
                      </Button>
                  </Link>
                ) : (
                  <Link href={`/app/partner-dashboard?type=${partnerData?.type || 'SALON'}&businessName=${encodeURIComponent(partnerData?.businessName || '')}&salonId=${salonId || ''}`} className="w-full sm:w-auto min-w-[140px]">
                    <Button
                      className="w-full"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
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
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
                {publishedVideos.length === 0 && (
                  <EmptyState type="videos" onUpload={() => setIsVideoUploadModalOpen(true)} />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="rewards" className="mt-0 focus-visible:outline-none">
            <RewardsSection user={user} />
          </TabsContent>

          <TabsContent value="about" className="mt-0 focus-visible:outline-none">
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
function EmptyState({ type, onUpload }: { type: string, onUpload?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <Video className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="space-y-2 max-w-xs sm:max-w-sm px-4">
        <h3 className="text-lg font-semibold text-foreground">No videos yet</h3>
        <p className="text-sm text-muted-foreground">
          Start sharing your style journey by uploading your first video.
        </p>
      </div>

      {onUpload && (
        <Button onClick={onUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Your First Video
        </Button>
      )}
    </div>
  );
}

// Rewards Section Component
function RewardsSection({ user }: { user: UserData }) {
  const points = user.loyaltyPoints || 0;

  // Simple level calculation for display (sync with backend logic ideally)
  const getLevel = (p: number) => {
      if (p >= 10000) return { name: "Diamond", next: null, min: 10000 };
      if (p >= 5000) return { name: "Platinum", next: 10000, min: 5000 };
      if (p >= 2000) return { name: "Gold", next: 5000, min: 2000 };
      if (p >= 500) return { name: "Silver", next: 2000, min: 500 };
      return { name: "Bronze", next: 500, min: 0 };
  };

  const currentLevel = getLevel(points);
  const nextMilestone = currentLevel.next || points;
  const progress = currentLevel.next
      ? Math.min(Math.max((points - currentLevel.min) / (currentLevel.next - currentLevel.min) * 100, 0), 100)
      : 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Rewards Card */}
      <Card className="overflow-hidden border shadow-sm">
        <div className="bg-primary p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  Loyalty Points
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Earn points with every booking and purchase
                </CardDescription>
              </div>
              <div className="bg-primary-foreground/10 p-3 rounded-full backdrop-blur-sm">
                <Gift className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-bold text-primary-foreground">{points}</span>
                <span className="text-xl text-primary-foreground/80 font-medium">points</span>
              </div>

              <div className="space-y-2">
                <Progress
                    value={progress}
                    className="h-2 bg-primary-foreground/20"
                    // @ts-ignore
                    indicatorClassName="bg-primary-foreground"
                />
                <div className="flex justify-between text-xs text-primary-foreground/80 font-medium">
                    <span>{points} pts</span>
                    <span>{currentLevel.next ? `Next Level: ${currentLevel.next} pts` : 'Max Level'}</span>
                </div>
              </div>

              <div className="pt-4">
                  <Button variant="secondary" asChild className="w-full sm:w-auto">
                      <Link href="/app/loyalty">
                          View Full Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tier and Level Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Tier</CardTitle>
                <CardDescription>Your membership level</CardDescription>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Award className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-xl font-bold text-foreground">
                  {currentLevel.name} Member
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">Unlock exclusive benefits as you climb tiers.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Earn points on all bookings</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Redeem for discounts & products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Unlock special badges</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Start Earning</CardTitle>
                <CardDescription>How to get points</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8" asChild>
                  <Link href="/app/loyalty/rewards">View Rewards</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Complete a Booking', points: '+10 pts / ₹100', icon: '📅' },
                { action: 'Write a Review', points: '+10 pts', icon: '✍️' },
                { action: 'Review with Photo', points: '+30 pts', icon: '📸' },
                { action: 'Refer a Friend', points: '+50 pts', icon: '👥' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-sm font-medium">{item.action}</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                    {item.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// About Section Component
function AboutSection({ user }: { user: UserData }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
          <CardDescription>A little more about my journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                <span>Gold Member</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="w-4 h-4" />
                <span>Content Creator</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Fashion & Beauty Enthusiast</span>
              </div>
            </div>
          </div>

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

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🎬', title: 'First Video', unlocked: true },
                { icon: '⭐', title: '100 Likes', unlocked: true },
                { icon: '👥', title: '1K Followers', unlocked: true },
                { icon: '💎', title: '10K Views', unlocked: true },
                { icon: '🏆', title: 'Trending', unlocked: false },
                { icon: '👑', title: 'VIP Status', unlocked: false },
              ].map((achievement, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all",
                    achievement.unlocked
                      ? "bg-muted/50 border-primary/20"
                      : "bg-muted/20 border-border opacity-50 grayscale"
                  )}
                >
                  <span className="text-2xl mb-2">{achievement.icon}</span>
                  <p className="text-[10px] font-medium">{achievement.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect with me</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { platform: 'Instagram', handle: '@janedoe_style', icon: 'I' },
              { platform: 'TikTok', handle: '@janedoe_style', icon: 'T' },
              { platform: 'YouTube', handle: 'Jane Doe Style', icon: 'Y' },
            ].map((social, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors bg-card hover:bg-accent/50"
                aria-label={`Connect on ${social.platform}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-foreground text-xs font-bold">{social.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{social.platform}</p>
                    <p className="text-xs text-muted-foreground">{social.handle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
