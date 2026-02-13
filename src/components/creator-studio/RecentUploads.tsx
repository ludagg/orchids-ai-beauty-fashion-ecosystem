"use client";

import { Eye, ThumbsUp, MessageCircle, MoreVertical, Globe, Lock } from "lucide-react";
import Image from "next/image";

const uploads = [
  {
    id: 1,
    title: "Summer Fashion Trends 2024",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
    status: "Public",
    date: "Oct 24, 2023",
    views: "12.5k",
    likes: "3.2k",
    comments: "450"
  },
  {
    id: 2,
    title: "My Skincare Routine",
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&h=300&fit=crop",
    status: "Public",
    date: "Oct 20, 2023",
    views: "8.1k",
    likes: "2.1k",
    comments: "210"
  },
  {
    id: 3,
    title: "Top 5 Sneakers",
    thumbnail: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop",
    status: "Draft",
    date: "Oct 18, 2023",
    views: "-",
    likes: "-",
    comments: "-"
  },
  {
    id: 4,
    title: "Vlog: Day in Life",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    status: "Private",
    date: "Oct 15, 2023",
    views: "1.2k",
    likes: "400",
    comments: "56"
  }
];

export default function RecentUploads() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Content</h3>
        <button className="text-sm font-medium text-primary hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Video</th>
              <th className="px-6 py-4 font-medium">Visibility</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-center">Views</th>
              <th className="px-6 py-4 font-medium text-center">Likes</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {uploads.map((video) => (
              <tr key={video.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-muted">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-medium text-foreground truncate max-w-[150px]">{video.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {video.status === "Public" ? (
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className={video.status === "Public" ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                        {video.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{video.date}</td>
                <td className="px-6 py-4 text-center">
                    {video.views !== "-" ? (
                         <div className="inline-flex items-center gap-1">
                            <span className="font-medium">{video.views}</span>
                         </div>
                    ) : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                    {video.likes !== "-" ? (
                         <div className="inline-flex items-center gap-1">
                            <span className="font-medium">{video.likes}</span>
                         </div>
                    ) : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
