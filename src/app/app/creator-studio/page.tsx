"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Play, Users, Eye, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Subscribers", value: "12,450", change: "+12%", icon: Users, color: "text-violet-500" },
  { label: "Total Views", value: "45.2K", change: "+8%", icon: Eye, color: "text-blue-500" },
  { label: "Watch Time (hrs)", value: "1,200", change: "+5%", icon: Clock, color: "text-amber-500" },
  { label: "Estimated Revenue", value: "$3,450", change: "+15%", icon: DollarSign, color: "text-emerald-500" },
];

const recentUploads = [
  { title: "Summer Fashion Trends 2024", views: "1.2K", date: "2 days ago", thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=60" },
  { title: "My Skincare Routine", views: "3.4K", date: "5 days ago", thumbnail: "https://images.unsplash.com/photo-1556228720-1917374022ba?w=800&auto=format&fit=crop&q=60" },
  { title: "Vlog: A Day in Paris", views: "850", date: "1 week ago", thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=60" },
];

export default function CreatorStudioOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="text-emerald-500 flex items-center">
                    {stat.change} <ArrowUpRight className="w-3 h-3" />
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Uploads Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-violet-500" /> Recent Uploads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentUploads.map((video, index) => (
             <motion.div
              key={video.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </div>
              <h3 className="font-medium group-hover:text-violet-500 transition-colors line-clamp-1">{video.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{video.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Tips or Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
            <CardHeader>
                <CardTitle className="text-lg">Creator Tips</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Optimize your titles for better discovery! Using keywords like "Summer" and "2024" can boost your visibility by 20%.
                </p>
            </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardHeader>
                <CardTitle className="text-lg">New Features</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    We've added new filters to the video editor. Try out the "Vintage" look in your next upload!
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
