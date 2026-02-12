"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageSquare,
  ThumbsUp,
  Edit,
  Trash2,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock Data
const VIDEOS = [
  { id: 1, title: "Summer Fashion Trends 2024", thumbnail: null, status: "Published", date: "Oct 24, 2023", views: "12,405", comments: "142", likes: "1,204" },
  { id: 2, title: "My Skincare Routine", thumbnail: null, status: "Published", date: "Oct 20, 2023", views: "8,532", comments: "98", likes: "900" },
  { id: 3, title: "Vlog: Unexpected Trip to Paris", thumbnail: null, status: "Draft", date: "Oct 18, 2023", views: "-", comments: "-", likes: "-" },
  { id: 4, title: "10 Outfit Ideas for Work", thumbnail: null, status: "Published", date: "Oct 15, 2023", views: "24,100", comments: "310", likes: "2,400" },
  { id: 5, title: "GRWM: Date Night", thumbnail: null, status: "Private", date: "Oct 10, 2023", views: "50", comments: "0", likes: "12" },
];

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredVideos = VIDEOS.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || video.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Content</h1>
        <p className="text-muted-foreground">Manage your videos and live streams.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Filter"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {["All", "Published", "Draft", "Private"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-14 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{video.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">Description preview...</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {video.status === "Published" && <div className="w-2 h-2 rounded-full bg-green-500" />}
                    {video.status === "Draft" && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    {video.status === "Private" && <div className="w-2 h-2 rounded-full bg-red-400" />}
                    <span>{video.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{video.date}</TableCell>
                <TableCell className="text-right">{video.views}</TableCell>
                <TableCell className="text-right">{video.comments}</TableCell>
                <TableCell className="text-right">{video.likes}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" /> Comments
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 focus:text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
