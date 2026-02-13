"use client";

import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Eye,
  Upload,
  Plus,
  BarChart3,
  TrendingUp,
  MoreVertical,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

// Mock Data
const creatorProfile = {
  name: "Jane Doe",
  handle: "@janedoe_style",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  cover: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=400&fit=crop",
  bio: "Fashion enthusiast & style curator. Bringing you the latest trends from Paris to Tokyo. 🌸✨",
  stats: {
    followers: "12.5K",
    likes: "45.2K",
    views: "1.2M",
    videos: 24
  }
};

const videos = [
  {
    id: "1",
    title: "Summer 2024 Fashion Trends You Need to Know",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop",
    views: "125K",
    likes: "4.5K",
    date: "2 days ago",
    status: "Published"
  },
  {
    id: "2",
    title: "My Daily Skincare Routine for Glowing Skin",
    thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop",
    views: "89K",
    likes: "3.2K",
    date: "1 week ago",
    status: "Published"
  },
  {
    id: "3",
    title: "Paris Fashion Week Vlog - Behind the Scenes",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    views: "210K",
    likes: "15K",
    date: "2 weeks ago",
    status: "Published"
  },
  {
    id: "4",
    title: "Testing Viral TikTok Makeup Hacks",
    thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
    views: "45K",
    likes: "1.8K",
    date: "3 weeks ago",
    status: "Published"
  },
  {
    id: "5",
    title: "Closet Tour & Organization Tips",
    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop",
    views: "32K",
    likes: "1.2K",
    date: "1 month ago",
    status: "Published"
  },
  {
    id: "6",
    title: "How to Style Oversized Blazers",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    views: "156K",
    likes: "8.9K",
    date: "1 month ago",
    status: "Published"
  }
];

export default function CreatorStudioPage() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full bg-muted overflow-hidden">
          <img
            src={creatorProfile.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative -mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden shadow-xl">
                <img
                  src={creatorProfile.avatar}
                  alt={creatorProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-bold text-white drop-shadow-md mb-1">{creatorProfile.name}</h1>
              <p className="text-white/90 font-medium mb-2 drop-shadow-sm">{creatorProfile.handle}</p>
              <p className="text-sm text-foreground/80 md:text-white/80 max-w-xl md:drop-shadow-sm hidden md:block">
                {creatorProfile.bio}
              </p>
            </div>

            <div className="flex gap-3 mb-2 w-full md:w-auto">
              <Button className="flex-1 md:flex-none gap-2" size="lg">
                <Upload className="w-4 h-4" />
                Upload Video
              </Button>
              <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Bio */}
          <p className="text-sm text-muted-foreground mb-6 md:hidden">
            {creatorProfile.bio}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-violet-500/10 text-violet-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{creatorProfile.stats.followers}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Followers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{creatorProfile.stats.likes}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Likes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{creatorProfile.stats.views}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Views</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+12%</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Growth</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Your Videos
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground">Recent</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">Popular</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ y: -5 }}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-xs font-medium text-white">
                      {video.status}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between text-white/90 text-sm font-medium">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4" />
                          {video.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Published {video.date}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
