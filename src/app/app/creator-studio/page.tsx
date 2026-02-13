"use client";

import { motion } from "framer-motion";
import { Eye, Users, Clock, DollarSign, Upload, Radio, PenTool } from "lucide-react";
import StatsCard from "@/components/creator-studio/StatsCard";
import AnalyticsChart from "@/components/creator-studio/AnalyticsChart";
import RecentUploads from "@/components/creator-studio/RecentUploads";

const stats = [
  {
    title: "Total Views",
    value: "2.4M",
    change: "+12.5%",
    trend: "up" as const,
    icon: Eye,
    description: "In the last 28 days"
  },
  {
    title: "Subscribers",
    value: "142.3K",
    change: "+840",
    trend: "up" as const,
    icon: Users,
    description: "Net subscribers gained"
  },
  {
    title: "Watch Time (hrs)",
    value: "84.2K",
    change: "-2.1%",
    trend: "down" as const,
    icon: Clock,
    description: "Average view duration stable"
  },
  {
    title: "Est. Revenue",
    value: "$4,290",
    change: "+8.4%",
    trend: "up" as const,
    icon: DollarSign,
    description: "Processing payments"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CreatorStudioPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Welcome back, Jane</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your channel today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            <Upload className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95">
            <Radio className="w-4 h-4" />
            <span>Go Live</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.title} variants={item}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Analytics Chart - Takes up 2 columns on large screens */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2 space-y-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Performance</h2>
                <button className="text-sm font-medium text-primary hover:underline">View Analytics</button>
            </div>
            <AnalyticsChart />

            <div className="mt-8">
                <RecentUploads />
            </div>
        </motion.div>

        {/* Sidebar Widgets - Recent Comments / News */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
        >
            {/* Creator Tips / News */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-violet-600 dark:text-violet-400">
                    <PenTool className="w-5 h-5" />
                    Creator Tips
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    Shorts under 60 seconds are getting 2x more visibility this week. Try remixing your latest long-form video!
                </p>
                <button className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 hover:underline">
                    Read More
                </button>
            </div>

            {/* Latest Comments */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Latest Comments</h3>
                <div className="space-y-4">
                    {[
                        { user: "Sarah M.", text: "Love the new collection! Where can I buy the blue dress?", time: "2m ago", avatar: "S" },
                        { user: "Mike R.", text: "Great video quality. What camera are you using?", time: "15m ago", avatar: "M" },
                        { user: "Priya K.", text: "Please do a tutorial on this makeup look!", time: "1h ago", avatar: "P" },
                    ].map((comment, i) => (
                        <div key={i} className="flex gap-3 items-start pb-4 border-b border-border last:border-0 last:pb-0">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                                {comment.avatar}
                            </div>
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-foreground">{comment.user}</p>
                                    <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl hover:bg-secondary">
                    View All Comments
                </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
