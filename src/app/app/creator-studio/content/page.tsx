"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const videos = [
  {
    id: 1,
    title: "Summer Fashion Trends 2024",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&auto=format&fit=crop&q=60",
    status: "Published",
    date: "Oct 24, 2023",
    views: "1,245",
    comments: "45",
    likes: "120",
  },
  {
    id: 2,
    title: "My Skincare Routine",
    thumbnail: "https://images.unsplash.com/photo-1556228720-1917374022ba?w=200&auto=format&fit=crop&q=60",
    status: "Published",
    date: "Oct 20, 2023",
    views: "3,400",
    comments: "120",
    likes: "450",
  },
  {
    id: 3,
    title: "Vlog: A Day in Paris",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&auto=format&fit=crop&q=60",
    status: "Draft",
    date: "Oct 18, 2023",
    views: "-",
    comments: "-",
    likes: "-",
  },
  {
    id: 4,
    title: "Top 5 Makeup Hacks",
    thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop&q=60",
    status: "Processing",
    date: "Oct 15, 2023",
    views: "-",
    comments: "-",
    likes: "-",
  },
];

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Video Content</h2>
        <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <Button variant="secondary">Columns</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
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
            {videos.map((video) => (
              <TableRow key={video.id} className="group">
                <TableCell>
                  <div className="flex gap-4 items-center">
                    <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-muted">
                        <img src={video.thumbnail} alt={video.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="font-medium truncate max-w-[200px]" title={video.title}>
                        {video.title}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <Badge variant={video.status === 'Published' ? 'default' : video.status === 'Draft' ? 'secondary' : 'outline'}>
                        {video.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{video.date}</TableCell>
                <TableCell className="text-right">{video.views}</TableCell>
                <TableCell className="text-right">{video.comments}</TableCell>
                <TableCell className="text-right">{video.likes}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Analytics</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
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
