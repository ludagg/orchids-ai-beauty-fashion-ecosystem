"use client";

import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Eye,
  Upload,
  Plus,
  TrendingUp,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Settings,
  ArrowUpRight,
  Globe,
  Video,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock Data
const creatorProfile = {
  name: "Jane Doe",
  handle: "@janedoe_style",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  bio: "Fashion enthusiast & style curator. Bringing you the latest trends from Paris to Tokyo. 🌸✨",
  stats: {
    followers: "12.5K",
    likes: "45.2K",
    views: "1.2M",
    engagement: "4.8%"
  }
};

const videos = [
  {
    id: "1",
    title: "Summer 2024 Fashion Trends You Need to Know",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop",
    views: 125000,
    likes: 4500,
    date: "2024-05-15",
    status: "Published"
  },
  {
    id: "2",
    title: "My Daily Skincare Routine for Glowing Skin",
    thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop",
    views: 89000,
    likes: 3200,
    date: "2024-05-10",
    status: "Published"
  },
  {
    id: "3",
    title: "Paris Fashion Week Vlog - Behind the Scenes",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    views: 210000,
    likes: 15000,
    date: "2024-05-01",
    status: "Published"
  },
  {
    id: "4",
    title: "Testing Viral TikTok Makeup Hacks",
    thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
    views: 45000,
    likes: 1800,
    date: "2024-04-20",
    status: "Draft"
  }
];

const analyticsData = [
  { date: "Mon", views: 2400 },
  { date: "Tue", views: 1398 },
  { date: "Wed", views: 9800 },
  { date: "Thu", views: 3908 },
  { date: "Fri", views: 4800 },
  { date: "Sat", views: 3800 },
  { date: "Sun", views: 4300 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
};

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Creator Studio</h1>
          <p className="text-muted-foreground mt-1">Manage your content and analyze your performance.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
            <Video className="w-4 h-4" />
            Go Live
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Upload className="w-4 h-4" />
            Upload New
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatorProfile.stats.followers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatorProfile.stats.views}</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatorProfile.stats.likes}</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +5.4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatorProfile.stats.engagement}</div>
             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-emerald-500 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +1.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Analytics & Recent Videos */}
        <div className="lg:col-span-2 space-y-8">

          {/* Analytics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Views Overview</CardTitle>
              <CardDescription>Your performance over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
               <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                    />
                     <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="var(--color-views)"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      strokeWidth={2}
                    />
                  </AreaChart>
               </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Recent Content</CardTitle>
                    <CardDescription>Manage your latest uploads.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="relative w-full sm:w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white fill-white/50" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                             <h4 className="font-semibold text-sm truncate pr-4" title={video.title}>{video.title}</h4>
                             <Badge variant={video.status === 'Published' ? 'default' : 'secondary'} className="capitalize">
                                {video.status}
                             </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(video.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.views.toLocaleString()}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {video.likes.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center mt-2 sm:mt-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-3">
                <div className="text-xs text-muted-foreground w-full text-center">
                    Showing {videos.length} most recent uploads
                </div>
            </CardFooter>
          </Card>

        </div>

        {/* Sidebar - Profile & Quick Actions */}
        <div className="space-y-6">
            <Card>
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden mb-4">
                        <Avatar className="w-full h-full">
                            <AvatarImage src={creatorProfile.avatar} className="object-cover" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle>{creatorProfile.name}</CardTitle>
                    <CardDescription>{creatorProfile.handle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">{creatorProfile.bio}</p>
                    <div className="flex justify-center gap-2">
                         <Button variant="outline" size="sm" className="w-full">
                            <Edit className="w-3 h-3 mr-2" /> Edit Profile
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Globe className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-none shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-200" />
                        Pro Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-indigo-100 text-sm">
                        Consistent posting increases engagement by 40%. Try scheduling your next 3 videos.
                    </p>
                    <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                        Schedule Content
                    </Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {videos.slice(0, 3).map((video, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                                <img src={video.thumbnail} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{video.title}</p>
                                <p className="text-xs text-muted-foreground">{video.views.toLocaleString()} views</p>
                            </div>
                            <div className="text-xs font-bold text-emerald-500">#{i + 1}</div>
                        </div>
                     ))}
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
