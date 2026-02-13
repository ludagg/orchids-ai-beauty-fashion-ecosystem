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
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useState } from "react";

type CreatorVideo = {
  id: number;
  views: string;
  thumbnail: string;
};

// Mock Data matching the previous structure but adapted for the new layout
const creatorData = {
  name: "Ananya Sharma",
  handle: "@ananya_style",
  role: "Fashion & Lifestyle Creator",
  bio: "Exploring the intersection of sustainability and high fashion. India-based. Minimalist at heart. 🌿",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  followers: "124K",
  following: "432",
  likes: "2.4M",
  isFollowing: false,
  recentVideos: [
    { id: 1, views: "45K", thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop" },
    { id: 2, views: "12K", thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop" },
    { id: 3, views: "89K", thumbnail: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=600&fit=crop" },
    { id: 4, views: "34K", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop" },
    { id: 5, views: "15K", thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=600&fit=crop" },
    { id: 6, views: "28K", thumbnail: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop" },
  ] as CreatorVideo[]
};

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(creatorData.isFollowing);

  return (
    <div className="max-w-4xl mx-auto min-h-screen pb-20 pt-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-6 mb-8">

        {/* Avatar */}
        <div className="relative group">
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background shadow-xl overflow-hidden">
                <Avatar className="w-full h-full">
                    <AvatarImage src={creatorData.avatar} className="object-cover" />
                    <AvatarFallback>AS</AvatarFallback>
                </Avatar>
            </div>
        </div>

        {/* Name & Handle */}
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight font-display flex items-center justify-center gap-2">
                {creatorData.name}
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                    Pro
                </Badge>
            </h1>
            <p className="text-muted-foreground font-medium">{creatorData.handle}</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 md:gap-12 py-2 w-full max-w-2xl">
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-lg font-bold">{creatorData.following}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-lg font-bold">{creatorData.followers}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
            </div>
             <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{creatorData.likes}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Likes</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
            <Button
                className={`flex-1 min-w-[120px] transition-all ${isFollowing ? "bg-muted text-foreground hover:bg-muted/80" : ""}`}
                size="lg"
                onClick={() => setIsFollowing(!isFollowing)}
                variant={isFollowing ? "secondary" : "default"}
            >
                {isFollowing ? "Following" : "Follow"}
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
            {creatorData.bio} <br/>
            <a href="#" className="text-primary hover:underline font-medium">linktr.ee/ananya_style</a>
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
             <div className="grid grid-cols-3 gap-px md:gap-1">
                {creatorData.recentVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
             </div>
        </TabsContent>

         <TabsContent value="liked" className="mt-0">
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="bg-muted rounded-full p-6">
                    <Lock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">This user's liked videos are private</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    Videos liked by {creatorData.name} are currently hidden.
                </p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VideoCard({ video }: { video: CreatorVideo }) {
    return (
        <div className="aspect-[9/16] relative bg-muted cursor-pointer overflow-hidden group">
            <img
                src={video.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
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
