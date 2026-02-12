"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Users,
  Eye,
  DollarSign,
  TrendingUp,
  Video,
  MoreVertical,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const MOCK_STATS = [
  { label: "Total Subscribers", value: "1,234", change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Total Views", value: "45.2K", change: "+8%", icon: Eye, color: "text-green-500" },
  { label: "Est. Earnings", value: "$324.50", change: "+4%", icon: DollarSign, color: "text-amber-500" },
  { label: "Avg. Watch Time", value: "4m 12s", change: "+2%", icon: TrendingUp, color: "text-purple-500" },
];

const RECENT_VIDEOS = [
  { id: 1, title: "Summer Fashion Trends 2024", views: "12K", likes: "1.2K", date: "2 days ago", status: "Published" },
  { id: 2, title: "My Skincare Routine", views: "8.5K", likes: "900", date: "5 days ago", status: "Published" },
  { id: 3, title: "Vlog: unexpected trip", views: "-", likes: "-", date: "Draft", status: "Draft" },
];

export default function CreatorStudioPage() {
  // In a real app, this would come from the session/database
  const [isCreator, setIsCreator] = useState(false); // Default to false to show onboarding
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setApplicationSubmitted(true);
      // Auto-approve for demo purposes after 2 seconds
      setTimeout(() => setIsCreator(true), 2000);
    }, 1000);
  };

  if (!isCreator) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-4 rounded-full bg-gradient-to-br from-violet-100 to-rose-100 dark:from-violet-900/20 dark:to-rose-900/20 mb-4"
          >
            <Sparkles className="w-12 h-12 text-violet-600 dark:text-violet-400" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-rose-500">
            Become a Creator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your style, build your community, and earn from your passion.
            Join thousands of creators on Priisme.
          </p>
        </div>

        {applicationSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-green-200 dark:border-green-900 p-8 rounded-2xl text-center space-y-4 shadow-lg"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Application Received!</h3>
            <p className="text-muted-foreground">
              We are reviewing your profile. You will be notified shortly.
              <br />
              <span className="text-xs text-muted-foreground/60">(Demo: Redirecting in 2s...)</span>
            </p>
          </motion.div>
        ) : (
          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle>Creator Application</CardTitle>
              <CardDescription>Tell us a bit about yourself and what you create.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="I am a fashion enthusiast who loves..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma separated)</Label>
                  <Input
                    id="specialties"
                    placeholder="Fashion, Beauty, Lifestyle, Tech..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio / Social Links</Label>
                  <Input
                    id="portfolio"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-violet-600 to-rose-500 hover:opacity-90 transition-opacity">
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Creator Studio</h1>
          <p className="text-muted-foreground">Manage your content and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/creator-studio/upload">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
              <Upload className="w-4 h-4" />
              Upload Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Videos Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Uploads</h2>
            <Link href="/app/creator-studio/content" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {RECENT_VIDEOS.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-32 h-20 bg-muted rounded-md relative flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                       <Video className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate group-hover:text-primary transition-colors">{video.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {video.likes}
                      </span>
                      <span>• {video.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className={`text-xs px-2 py-1 rounded-full ${
                       video.status === 'Published'
                         ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                         : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                     }`}>
                       {video.status}
                     </span>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                       <MoreVertical className="w-4 h-4" />
                     </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Tips / Announcements */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold">Creator Tips</h2>
           <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none">
             <CardContent className="p-6 space-y-4">
               <Sparkles className="w-8 h-8 text-yellow-300" />
               <h3 className="text-lg font-bold">Boost your reach!</h3>
               <p className="text-violet-100 text-sm leading-relaxed">
                 Creators who upload consistently get 3x more views. Try scheduling your posts for peak hours (6pm - 9pm).
               </p>
               <Button variant="secondary" size="sm" className="w-full">
                 Read Guide
               </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
