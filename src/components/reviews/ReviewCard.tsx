"use client";

import { Star, ThumbsUp, CheckCircle2, User, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string[] | null;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  salonReply: string | null;
  salonReplyAt: string | null;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = async () => {
    if (hasVoted) return;

    try {
      const res = await fetch(`/api/reviews/${review.id}/helpful`, {
        method: "POST",
      });

      if (res.ok) {
        setHelpfulCount(prev => prev + 1);
        setHasVoted(true);
        toast.success("Thanks for your feedback!");
      } else {
        toast.error("Failed to vote");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarImage src={review.user.image || ""} />
            <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-foreground text-sm">{review.user.name}</p>
              {review.isVerified && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" title="Verified Visit">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Verified</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-muted-foreground leading-relaxed text-sm">
          {review.comment}
        </p>
      )}

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {review.images.map((img, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-90 transition-opacity">
                  <Image src={img} alt="Review photo" fill className="object-cover" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none">
                <div className="relative w-full aspect-video">
                  <Image src={img} alt="Review photo full" fill className="object-contain" />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 gap-1.5 text-xs ${hasVoted ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          onClick={handleHelpful}
          disabled={hasVoted}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-current" : ""}`} />
          Helpful ({helpfulCount})
        </Button>
      </div>

      {review.salonReply && (
        <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border space-y-2">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">Response from Salon</span>
            {review.salonReplyAt && (
                <span className="text-[10px] text-muted-foreground">• {format(new Date(review.salonReplyAt), "MMM d, yyyy")}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{review.salonReply}"
          </p>
        </div>
      )}
    </div>
  );
}
