"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface SalonReviewsManagerProps {
  salonId: string;
}

export function SalonReviewsManager({ salonId }: SalonReviewsManagerProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/salons/${salonId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [salonId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20" role="status" aria-label="Loading reviews">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Reviews</h3>
        <span className="text-sm text-muted-foreground">{reviews.length} reviews</span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4 p-4 border rounded-lg bg-card shadow-sm">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.user.image || ""} />
              <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{review.user.name}</span>
                <span className="text-xs text-muted-foreground">
                    {format(new Date(review.createdAt), "PPP")}
                </span>
              </div>
              <div
                className="flex items-center text-yellow-500 mb-1"
                role="img"
                aria-label={`Rating: ${review.rating} out of 5 stars`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted stroke-muted-foreground"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground">{review.comment}</p>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <Empty className="border-2 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquare className="opacity-50" />
              </EmptyMedia>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>Reviews from your customers will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}
