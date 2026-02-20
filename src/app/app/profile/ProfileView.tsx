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
import { PartnerOnboardingModal, PartnerData } from "@/components/profile/PartnerOnboardingModal";
import { VideoUploadModal } from "@/components/profile/VideoUploadModal";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [partnerData, setPartnerData] = useState<PartnerData | null>(initialSalon ? {
        businessName: initialSalon.name,
        description: initialSalon.description || "",
        address: "",
        city: "",
        zipCode: "",
        type: initialSalon.type
  } : null);
  const [salonId, setSalonId] = useState<string | null>(initialSalon?.id || null);

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
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

  const handlePartnerComplete = (data: PartnerData & { id?: string }) => {
    setPartnerData(data);
    if (data.id) setSalonId(data.id);
    setIsPartner(true);
    router.refresh();
  };

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
      {/* Hero Section with Gradient Background */}
      <motion.div variants={itemVariants} className="relative bg-gradient-to-b from-rose-50/80 via-purple-50/40 to-background dark:from-rose-950/40 dark:via-purple-950/20 dark:to-background border-b border-border/50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">

            {/* Avatar with enhanced styling */}
            <div className="relative shrink-0 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-background bg-background">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={displayAvatar} className="object-cover" alt={displayName} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-rose-500 to-indigo-500 text-white">
                        {displayName ? displayName.substring(0, 2).toUpperCase() : "US"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </motion.div>

              {/* Online/Active indicator */}
              <div className="absolute bottom-2 right-2 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full border-4 border-background shadow-lg" />

              {/* Edit Avatar Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-2 shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                <Edit className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 space-y-6 w-full text-center lg:text-left">

              {/* Name and Badges */}
              <div className="space-y-2">
                <div className="flex flex-col lg:flex-row items-center gap-3 justify-center lg:justify-start">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight font-display text-foreground">
                    {displayName}
                  </h1>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                    {isPartner && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm text-xs px-2 py-0.5">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Partner
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm text-xs px-2 py-0.5">
                      Pro
                    </Badge>
                    <Badge variant="outline" className="border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400 text-xs px-2 py-0.5">
                      Verified
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground font-medium flex items-center justify-center lg:justify-start gap-1 text-sm md:text-base">
                  <span className="text-rose-500">@</span>
                  {displayHandle.replace('@', '')}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 sm:divide-x sm:divide-border/50 py-2">
                <StatItem value={stats.followers} label="Followers" trend="+12%" />
                <StatItem value="482" label="Following" trend="+3%" />
                <StatItem value={stats.likes} label="Likes" trend="+8%" />
                <StatItem value={stats.videos} label="Videos" />
              </div>

              {/* Bio */}
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                {displayBio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="w-full sm:w-auto min-w-[140px] shadow-sm bg-background border border-border hover:bg-accent hover:text-accent-foreground text-foreground"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>

                {!isPartner ? (
                  <Button
                    onClick={() => setIsPartnerModalOpen(true)}
                    className="w-full sm:w-auto min-w-[140px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-500/20 text-white border-0"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Become Partner
                  </Button>
                ) : (
                  <Link href={`/app/partner-dashboard?type=${partnerData?.type || 'SALON'}&businessName=${encodeURIComponent(partnerData?.businessName || '')}&salonId=${salonId || ''}`} className="w-full sm:w-auto min-w-[140px]">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 text-white border-0"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border/50">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border/50">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="videos" className="w-full">
        {/* Sticky Tabs List */}
        <div className="sticky top-[7.25rem] lg:top-16 z-30 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-sm w-full transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                <TabsList className="w-full h-14 justify-start overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 bg-transparent border-0 gap-2 sm:gap-6">
                    <TabsTrigger
                    value="videos"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 sm:px-4 h-full gap-2 font-medium text-muted-foreground transition-all hover:text-foreground"
                    >
                    <Video className="w-4 h-4" />
                    Videos
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-muted text-muted-foreground">
                        {publishedVideos.length}
                    </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                    value="rewards"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 sm:px-4 h-full gap-2 font-medium text-muted-foreground transition-all hover:text-foreground"
                    >
                    <Gift className="w-4 h-4" />
                    Rewards
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-muted text-muted-foreground">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
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
        <Button
          size="lg"
          onClick={() => setIsVideoUploadModalOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-xl shadow-rose-500/30 p-0 flex items-center justify-center"
        >
          <Upload className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      <PartnerOnboardingModal
        isOpen={isPartnerModalOpen}
        onOpenChange={setIsPartnerModalOpen}
        onComplete={handlePartnerComplete}
      />

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
          <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] h-5 px-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-0">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {trend}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">{label}</p>
    </div>
  );
}

// Video Card Component with Animation
function VideoCard({ video, index }: { video: VideoData, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-muted shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-border/20"
    >
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <Video className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/40" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
        </motion.div>
      </div>

      {/* Views Counter */}
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 text-white drop-shadow-md">
        <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
        <span className="text-[10px] sm:text-xs font-semibold">
          {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}K` : video.views}
        </span>
      </div>

      {/* Video Title */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 pt-6 sm:pt-8 hidden sm:block">
        <p className="text-white text-[10px] sm:text-xs font-medium line-clamp-2 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {video.title}
        </p>
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({ type, onUpload }: { type: string, onUpload?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-4 sm:space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-100 to-purple-100 dark:from-rose-950/30 dark:to-purple-950/30 flex items-center justify-center">
          <Video className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
      </motion.div>

      <div className="space-y-2 max-w-xs sm:max-w-sm px-4">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">No videos yet</h3>
        <p className="text-sm text-muted-foreground">
          Start sharing your style journey by uploading your first video.
        </p>
      </div>

      {onUpload && (
        <Button
          onClick={onUpload}
          className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white border-0 shadow-md"
        >
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
  const nextLevel = 1000;
  const progress = Math.min((points / nextLevel) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Rewards Card */}
      <Card className="overflow-hidden border-0 shadow-xl bg-card">
        <div className="bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white/30 rounded-full" />
            <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white/30 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-display text-white">
                  My Loyalty Points
                </CardTitle>
                <CardDescription className="text-white/80 text-sm sm:text-base">
                  Earn points with every booking and purchase
                </CardDescription>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-bold text-white font-display">{points}</span>
                <span className="text-xl text-white/80 font-medium">points</span>
              </div>

              <div className="space-y-2">
                <Progress
                    value={progress}
                    className="h-3 bg-black/20"
                />
                <div className="flex justify-between text-xs text-white/90 font-medium">
                    <span>{points} / {nextLevel}</span>
                    <span>Next Reward: $10 Off</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-white/80">
                {nextLevel - points} points to next level • 100 points = $1.00 discount
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tier and Level Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-amber-100 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Tier</CardTitle>
                <CardDescription>Your membership level</CardDescription>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg text-white">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Gold Member
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">Top 10% of active users</p>
            </div>

            <Separator className="bg-amber-200/50 dark:bg-amber-800/50" />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>2x points on all purchases</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Priority booking access</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Exclusive partner discounts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Points History</CardTitle>
                <CardDescription>Recent activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Booking at Luxe Salon', points: '+50', date: '2 hours ago', positive: true },
                { action: 'Purchase - Summer Collection', points: '+120', date: 'Yesterday', positive: true },
                { action: 'Reward Redemption', points: '-500', date: '3 days ago', positive: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge
                    variant={item.positive ? "default" : "secondary"}
                    className={cn(item.positive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-0" : "")}
                  >
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
            <h4 className="font-semibold mb-3">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {['Fashion', 'Beauty', 'Hairstyle', 'Skincare', 'Makeup', 'Trends', 'Lifestyle'].map((interest) => (
                <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1">
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
                    "flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all hover:scale-105",
                    achievement.unlocked
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900"
                      : "bg-muted/50 border-border opacity-50 grayscale"
                  )}
                >
                  <span className="text-2xl mb-2">{achievement.icon}</span>
                  <p className="text-[10px] font-medium">{achievement.title}</p>
                  {achievement.unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-1" />}
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
              { platform: 'Instagram', handle: '@janedoe_style', color: 'from-pink-500 to-rose-500' },
              { platform: 'TikTok', handle: '@janedoe_style', color: 'from-gray-900 to-gray-700' },
              { platform: 'YouTube', handle: 'Jane Doe Style', color: 'from-red-600 to-red-700' },
            ].map((social, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-3 rounded-xl border hover:border-primary/50 transition-colors bg-card hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm", social.color)}>
                    <span className="text-white text-xs font-bold">{social.platform[0]}</span>
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
