"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckCircle2, Image as ImageIcon, Search } from "lucide-react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { motion } from "framer-motion";

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
          <SelectTrigger className="w-[180px]">
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
          <Empty className="min-h-[300px] bg-muted/30 border-none relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Search className="w-6 h-6" />
                    </EmptyMedia>
                    <EmptyTitle>No matching reviews</EmptyTitle>
                    <EmptyDescription>
                        We couldn't find any reviews that match your current filters. Try adjusting your selection to see more results.
                    </EmptyDescription>
                </EmptyHeader>
            </motion.div>
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
