"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StoryViewer } from "./StoryViewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  viewed?: boolean;
}

interface UserStories {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  stories: Story[];
}

export function StoriesRail() {
  const { data: session } = useSession();
  const [userStories, setUserStories] = useState<UserStories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [iscreateOpen, setIsCreateOpen] = useState(false);
  const [newStoryUrl, setNewStoryUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        setUserStories(data);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryUrl) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: newStoryUrl,
          mediaType: newStoryUrl.match(/\.(mp4|webm)$/i) ? "video" : "image"
        })
      });

      if (res.ok) {
        toast.success("Story created!");
        setNewStoryUrl("");
        setIsCreateOpen(false);
        fetchStories();
      } else {
        toast.error("Failed to create story");
      }
    } catch (error) {
      toast.error("Error creating story");
    } finally {
      setIsSubmitting(false);
    }
  };

  const myUserIndex = session?.user ? userStories.findIndex(us => us.user.id === session.user.id) : -1;
  const hasMyStory = myUserIndex !== -1;

  const handleMyStoryClick = () => {
    if (hasMyStory) {
      setSelectedUserIndex(myUserIndex);
    } else {
      setIsCreateOpen(true);
    }
  };

  return (
    <div className="w-full py-3 bg-background/50">
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x items-center">

        {/* Create Story Button (Always first if logged in) */}
        {session?.user && (
           <div className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start group relative">
                <div
                    onClick={handleMyStoryClick}
                    className={cn(
                    "relative w-[72px] h-[72px] rounded-full p-[2px] transition-transform active:scale-95",
                    hasMyStory ? "bg-gradient-to-tr from-yellow-400 to-red-600" : "bg-muted border border-border"
                    )}
                >
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden relative">
                     <Avatar className="w-full h-full">
                        <AvatarImage src={session.user.image || undefined} className="object-cover" />
                        <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                     </Avatar>

                     {/* Overlay for hover effect if no story */}
                     {!hasMyStory && (
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                     )}
                  </div>

                  {/* Plus Button Badge */}
                  {!hasMyStory && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCreateOpen(true);
                        }}
                        className="absolute bottom-0 right-0 translate-x-1 translate-y-1 bg-background rounded-full p-0.5 cursor-pointer z-10 shadow-sm border border-border"
                    >
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5" />
                        </div>
                    </div>
                  )}

                  {/* If has story, maybe just show the ring. The plus is only for creating new.
                      Actually, Instagram shows a plus if you view your own story and want to add more?
                      For now, let's keep it simple: Ring = has story. Plus badge = empty state.
                  */}
                </div>
                <span className="text-xs font-medium truncate w-[72px] text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  Your Story
                </span>

                <Dialog open={iscreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add to Story</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateStory} className="space-y-4 pt-4">
                        <div className="space-y-2">
                        <Label>Media URL (Image or Video)</Label>
                        <Input
                            placeholder="https://..."
                            value={newStoryUrl}
                            onChange={e => setNewStoryUrl(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Supported: JPG, PNG, MP4, WebM.
                        </p>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Posting..." : "Share to Story"}
                        </Button>
                    </form>
                    </DialogContent>
                </Dialog>
           </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
             <Skeleton className="w-[72px] h-[72px] rounded-full" />
             <Skeleton className="w-16 h-3" />
          </div>
        ))}

        {/* User Stories List */}
        {!isLoading && userStories.map((us, index) => {
            if (session?.user && us.user.id === session.user.id) return null;

            return (
                <button
                    key={us.user.id}
                    onClick={() => setSelectedUserIndex(index)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start group"
                >
                    <div className="w-[72px] h-[72px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-red-600 transition-transform group-hover:scale-105">
                        <div className="w-full h-full rounded-full border-2 border-background overflow-hidden relative">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={us.user.image || undefined} className="object-cover" />
                                <AvatarFallback>{us.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <span className="text-xs font-medium truncate w-[72px] text-center text-muted-foreground group-hover:text-foreground transition-colors">
                        {us.user.name.split(' ')[0]}
                    </span>
                </button>
            );
        })}
      </div>

      {/* Full Screen Viewer */}
      {selectedUserIndex !== null && (
          <StoryViewer
            userStories={userStories}
            initialUserIndex={selectedUserIndex}
            onClose={() => setSelectedUserIndex(null)}
          />
      )}
    </div>
  );
}
