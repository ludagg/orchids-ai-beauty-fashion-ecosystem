"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical, Eye, ThumbsUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function ContentPage() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/creator/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content</h1>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Video</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No videos found. Upload your first video!
                    </TableCell>
                </TableRow>
            ) : videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-24 h-14 rounded-md overflow-hidden bg-secondary shrink-0">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <span className="font-medium truncate max-w-[200px]">{video.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        video.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                        {video.status}
                    </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                    {new Date(video.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        {video.views}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                        {video.likes}
                    </div>
                </TableCell>
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
                            <DropdownMenuItem className="text-destructive">
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
