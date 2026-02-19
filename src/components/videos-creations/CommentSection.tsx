"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface CommentSectionProps {
  videoId: string;
  initialCommentsCount?: number;
  hideHeader?: boolean;
  className?: string;
}

export function CommentSection({ videoId, initialCommentsCount = 0, hideHeader = false, className }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [count, setCount] = useState(initialCommentsCount);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/videos/${videoId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setCount(data.length);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setContent("");
        setCount((prev) => prev + 1);
        toast.success("Comment posted!");
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {!hideHeader && (
        <div className="flex items-center gap-2 mb-4 pt-8 border-t border-border">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-bold text-lg">Comments ({count})</h3>
        </div>
      )}

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] bg-secondary/50 border-none focus-visible:ring-1 resize-none rounded-xl"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={submitting || !content.trim()} className="rounded-full px-6">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Post
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-secondary/30 p-4 rounded-xl text-center text-sm text-muted-foreground border border-border/50">
          Please login to post a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Avatar className="w-10 h-10 border border-border mt-1">
                <AvatarImage src={comment.user.image || undefined} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-secondary/30 rounded-2xl p-3 px-4 border border-border/50 hover:border-border transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{comment.user.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
