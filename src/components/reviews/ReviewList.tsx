"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CheckCircle2, Image as ImageIcon, MessageSquare } from "lucide-react";

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

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");

  const filteredReviews = reviews
    .filter((review) => {
      if (filter.includes("verified") && !review.isVerified) return false;
      if (filter.includes("photos") && (!review.images || review.images.length === 0)) return false;
      if (filter.includes("5stars") && review.rating !== 5) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <ToggleGroup type="multiple" variant="outline" value={filter} onValueChange={setFilter}>
          <ToggleGroupItem value="verified" aria-label="Toggle verified">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Verified
          </ToggleGroupItem>
          <ToggleGroupItem value="photos" aria-label="Toggle photos">
            <ImageIcon className="h-4 w-4 mr-2" />
            With Photos
          </ToggleGroupItem>
          <ToggleGroupItem value="5stars" aria-label="Toggle 5 stars">
             5 Stars
          </ToggleGroupItem>
        </ToggleGroup>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]" aria-label="Sort reviews by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Empty className="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No reviews found</EmptyTitle>
              <EmptyDescription>
                No reviews match your selected filters. Try clearing filters to view all reviews.
              </EmptyDescription>
            </EmptyHeader>
            {filter.length > 0 && (
              <EmptyContent>
                <Button variant="outline" onClick={() => setFilter([])}>
                  Clear filters
                </Button>
              </EmptyContent>
            )}
          </Empty>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
