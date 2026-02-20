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
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PartnerOnboardingModal, PartnerData } from "@/components/profile/PartnerOnboardingModal";
import { VideoUploadModal } from "@/components/profile/VideoUploadModal";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

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
    engagement: "4.8%"
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen pb-20 pt-8 px-4">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-10 mb-8 max-w-5xl mx-auto">

        {/* Avatar */}
        <div className="relative group shrink-0">
           <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl overflow-hidden">
                <Avatar className="w-full h-full">
                    <AvatarImage src={displayAvatar} className="object-cover" />
                    <AvatarFallback>{displayName ? displayName.substring(0, 2).toUpperCase() : "US"}</AvatarFallback>
                </Avatar>
            </div>
            <div
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 border-2 border-background cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setIsEditProfileModalOpen(true)}
            >
                <Edit className="w-4 h-4 md:w-5 md:h-5" />
            </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-5 w-full">

            {/* Top Row */}
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        {displayName}
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                            Pro
                        </Badge>
                        {isPartner && (
                        <Badge variant="default" className="text-[10px] h-5 px-1.5 rounded-full">
                            Partner
                        </Badge>
                        )}
                    </h1>
                    <p className="text-muted-foreground font-medium text-base">{displayHandle}</p>
                </div>
            </div>

            {/* Stats */}
             <div className="flex items-center justify-center md:justify-start gap-6 md:gap-10">
                <div className="flex flex-col items-center md:items-start">
                    <span className="text-lg font-bold">{stats.followers}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <span className="text-lg font-bold">482</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
                </div>
                 <div className="flex flex-col items-center md:items-start">
                    <span className="text-lg font-bold">{stats.likes}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Likes</span>
                </div>
                 <div className="flex flex-col items-center md:items-start hidden sm:flex">
                    <span className="text-lg font-bold">{stats.views}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Views</span>
                </div>
            </div>

            {/* Bio */}
            <p className="text-sm leading-relaxed max-w-lg mx-auto md:mx-0">
                {displayBio} <br/>
                <a href="#" className="text-primary hover:underline font-medium">linktr.ee/janedoe_style</a>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full pt-1">
                <Button className="flex-1 md:flex-none min-w-[120px]" size="default" onClick={() => setIsEditProfileModalOpen(true)}>
                    Edit Profile
                </Button>
                {!isPartner ? (
                    <Button
                        className="flex-1 md:flex-none min-w-[120px] bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 border-0"
                        onClick={() => setIsPartnerModalOpen(true)}
                    >
                        Become a Partner
                    </Button>
                ) : (
                    <Link
                    href={`/app/partner-dashboard?type=${partnerData?.type || 'SALON'}&businessName=${encodeURIComponent(partnerData?.businessName || '')}&salonId=${salonId || ''}`}
                    passHref
                    className="flex-1 md:flex-none min-w-[120px]"
                    >
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-0 gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Partner Dashboard
                        </Button>
                    </Link>
                )}

                 {/* Secondary Actions */}
                 <div className="flex gap-2">
                     <Button variant="outline" size="icon" className="h-10 w-10">
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-10 w-10">
                        <Settings className="w-4 h-4" />
                    </Button>
                 </div>

                 {/* Upload/Go Live */}
                 <div className="flex items-center gap-2 ml-auto md:ml-4 border-l pl-4 hidden md:flex">
                     <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                        <Video className="w-4 h-4" />
                        Go Live
                    </Button>
                     <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-primary"
                        onClick={() => setIsVideoUploadModalOpen(true)}
                     >
                        <Upload className="w-4 h-4" />
                        Upload
                    </Button>
                </div>
            </div>
             {/* Mobile only Upload/Live buttons */}
             <div className="flex md:hidden items-center justify-center gap-4 text-sm font-medium pt-2 w-full">
                 <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                    <Video className="w-4 h-4" />
                    Go Live
                </Button>
                 <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground hover:text-primary"
                    onClick={() => setIsVideoUploadModalOpen(true)}
                 >
                    <Upload className="w-4 h-4" />
                    Upload
                </Button>
            </div>
        </div>
      </div>

      {/* Tabs: Videos & Rewards */}
      <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="w-full">
            {isLoadingVideos ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                        {publishedVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                    {publishedVideos.length === 0 && <EmptyState type="videos" onUpload={() => setIsVideoUploadModalOpen(true)} />}
                </>
            )}
          </TabsContent>

          <TabsContent value="rewards">
            <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Gift className="w-48 h-48 transform rotate-12" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                My Loyalty Points
                            </CardTitle>
                            <CardDescription className="text-indigo-100">Earn points with every booking and purchase.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <span className="text-6xl font-bold font-display">{user.loyaltyPoints || 0}</span>
                                <span className="text-xl font-medium mb-4 opacity-80">points</span>
                            </div>
                            <p className="mt-4 text-sm text-indigo-100 bg-white/10 p-3 rounded-lg inline-block border border-white/10 backdrop-blur-sm">
                                100 points = $1.00 discount (Redemption Coming Soon)
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Level</CardTitle>
                            <CardDescription>Your current tier</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-2">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg mb-4">
                                <span className="text-3xl">🌟</span>
                            </div>
                            <h3 className="text-xl font-bold text-yellow-600">Gold Member</h3>
                            <p className="text-xs text-muted-foreground mt-1">Top 10% of users</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                        <CardDescription>Recent point activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                            <Gift className="w-8 h-8 opacity-20 mb-2" />
                            <p>No recent activity.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
      </Tabs>

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
    </div>
  );
}

function VideoCard({ video, isPrivate, isLiked }: { video: VideoData, isPrivate?: boolean, isLiked?: boolean }) {
    return (
        <div className="aspect-[9/16] relative bg-muted cursor-pointer overflow-hidden group">
            {video.thumbnailUrl ? (
                 <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <Video className="w-8 h-8 opacity-20" />
                </div>
            )}

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Play className="w-8 h-8 text-white fill-white" />
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white drop-shadow-md">
                {isPrivate ? <Lock className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span className="text-xs font-semibold">{video.views >= 1000 ? `${(video.views/1000).toFixed(1)}K` : video.views}</span>
            </div>

            {isLiked && (
                 <div className="absolute top-2 right-2 text-white drop-shadow-md">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                 </div>
            )}
        </div>
    )
}

function EmptyState({ type, onUpload }: { type: string, onUpload?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-muted rounded-full p-6">
                <Video className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No videos yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
                Upload your first video to get started sharing your content with the world.
            </p>
            {onUpload && <Button variant="outline" onClick={onUpload}>Upload Video</Button>}
        </div>
    )
}
