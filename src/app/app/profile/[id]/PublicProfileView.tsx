"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Heart, Share2, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { MasonryVideoGrid } from "@/components/videos/MasonryVideoGrid";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { motion } from "framer-motion";

interface UserProfile {
    id: string;
    name: string;
    image: string | null;
    bio: string;
    handle: string;
}

interface UserStats {
    followers: number;
    following: number;
    likes: number;
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
    user: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface PublicProfileViewProps {
    userId: string;
}

export default function PublicProfileView({ userId }: PublicProfileViewProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [videos, setVideos] = useState<VideoData[]>([]);

    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    // Fetch Profile
    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch(`/api/users/${userId}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
                setStats(data.stats);
                setIsFollowing(data.isFollowing);
            } else {
                toast.error("User not found");
                router.push("/app");
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast.error("Failed to load profile");
        } finally {
            setIsLoadingProfile(false);
        }
    }, [userId, router]);

    // Fetch Videos
    const fetchVideos = useCallback(async () => {
        try {
            const res = await fetch(`/api/videos?userId=${userId}&status=published`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                // Map the data appropriately if needed to match VideoCard expectations
                const mappedVideos = data.map((v: any) => ({
                     ...v,
                     thumbnailUrl: v.thumbnailUrl || v.videoUrl, // Fallback
                     user: profile ? { id: profile.id, name: profile.name, image: profile.image } : v.user
                }));
                setVideos(mappedVideos);
            }
        } catch (error) {
            console.error("Failed to fetch videos", error);
        } finally {
            setIsLoadingVideos(false);
        }
    }, [userId, profile]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            fetchVideos();
        }
    }, [profile, fetchVideos]);

    const handleFollowToggle = async () => {
        if (!session?.user) {
            toast.error("Please login to follow users");
            return;
        }

        setIsFollowLoading(true);
        // Optimistic update
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);
        setStats(prev => prev ? {
            ...prev,
            followers: newIsFollowing ? prev.followers + 1 : Math.max(0, prev.followers - 1)
        } : null);

        try {
            const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
            if (!res.ok) throw new Error();
            const data = await res.json();
            // Sync with server if needed
            setIsFollowing(data.following);
        } catch (error) {
            // Revert
            setIsFollowing(!newIsFollowing);
            setStats(prev => prev ? {
                ...prev,
                followers: !newIsFollowing ? prev.followers + 1 : Math.max(0, prev.followers - 1)
            } : null);
            toast.error("Failed to update follow status");
        } finally {
            setIsFollowLoading(false);
        }
    };

    if (isLoadingProfile) {
        return (
             <div className="flex justify-center items-center h-[50vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!profile || !stats) {
        return (
             <div className="flex justify-center items-center h-[50vh]">
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>Profile not found</EmptyTitle>
                        <EmptyDescription>The user you are looking for does not exist.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        );
    }

    const displayAvatar = profile.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 mb-20 space-y-8">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center sm:flex-row sm:items-start gap-6 bg-card rounded-2xl p-6 sm:p-8 border shadow-sm"
            >
                 <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-md">
                    <AvatarImage src={displayAvatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left space-y-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
                        <p className="text-muted-foreground font-medium">{profile.handle}</p>
                    </div>

                    <p className="text-sm sm:text-base max-w-md mx-auto sm:mx-0">
                        {profile.bio}
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                        <div className="text-center sm:text-left">
                            <span className="block font-bold text-lg">{stats.following}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
                        </div>
                        <div className="text-center sm:text-left">
                            <span className="block font-bold text-lg">{stats.followers}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
                        </div>
                        <div className="text-center sm:text-left">
                            <span className="block font-bold text-lg">{stats.likes}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Likes</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row sm:flex-col w-full sm:w-auto gap-3 pt-4 sm:pt-0">
                    {session?.user?.id !== userId && (
                        <Button
                            className="flex-1 sm:w-full"
                            variant={isFollowing ? "outline" : "default"}
                            onClick={handleFollowToggle}
                            disabled={isFollowLoading}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                    )}
                    <Button variant="secondary" size="icon" className="shrink-0" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Profile link copied!");
                    }}>
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>

            {/* Content Tabs */}
            <Tabs defaultValue="videos" className="w-full">
                <TabsList className="w-full grid grid-cols-2 max-w-md mx-auto mb-8">
                    <TabsTrigger value="videos" className="gap-2">
                        <Grid className="w-4 h-4" />
                        Videos
                    </TabsTrigger>
                    <TabsTrigger value="collections" className="gap-2" disabled>
                        <Heart className="w-4 h-4" />
                        Looks (Soon)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="videos" className="mt-0">
                    {isLoadingVideos ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner />
                        </div>
                    ) : videos.length > 0 ? (
                        <MasonryVideoGrid videos={videos} />
                    ) : (
                        <Empty className="py-20">
                            <EmptyHeader>
                                <EmptyMedia>
                                    <Play className="w-12 h-12 text-muted-foreground/30" />
                                </EmptyMedia>
                                <EmptyTitle>No videos yet</EmptyTitle>
                                <EmptyDescription>
                                    This user hasn't published any videos.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    )}
                </TabsContent>
            </Tabs>

        </div>
    );
}
