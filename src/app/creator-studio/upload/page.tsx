"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock API call
    try {
        await fetch("/api/creator/videos", {
            method: "POST",
            body: JSON.stringify({ title: "New Video", description: "Test" }),
        });
        toast.success("Video uploaded successfully!");
        router.push("/creator-studio/content");
    } catch (e) {
        toast.error("Failed to upload video");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Upload New Video</h1>
        <p className="text-muted-foreground">Share your creativity with the world.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-secondary/50 transition-colors cursor-pointer group">
            <div className="p-4 bg-primary/10 text-primary rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold">Drag and drop video files to upload</h3>
            <p className="text-sm text-muted-foreground mt-2">Your videos will be private until you publish them.</p>
            <Button type="button" variant="secondary" className="mt-6">Select Files</Button>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. My Summer Morning Routine" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Tell viewers about your video..." className="min-h-[120px]" />
            </div>

             <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input id="thumbnail" type="file" accept="image/*" />
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
        </div>
      </form>
    </div>
  );
}
