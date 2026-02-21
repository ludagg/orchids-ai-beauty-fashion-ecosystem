"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingSummaryProps {
  averageRating: number | string;
  totalReviews: number;
  distribution?: { [key: number]: number }; // 5: 10, 4: 2...
  reviews?: any[]; // If provided, calculate distribution
}

export function RatingSummary({ averageRating, totalReviews, distribution, reviews }: RatingSummaryProps) {
  // Parse average rating to number if string
  const avg = typeof averageRating === 'string' ? parseFloat(averageRating) : (averageRating || 0);

  // Calculate distribution if not provided but reviews are
  const dist = distribution || (reviews ? reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number }) : {});

  // Ensure all stars 5-1 are present
  const starCounts = {
    5: dist[5] || 0,
    4: dist[4] || 0,
    3: dist[3] || 0,
    2: dist[2] || 0,
    1: dist[1] || 0,
  };

  return (
    <div className="p-6 rounded-3xl bg-secondary/20 border border-border">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
             <span className="text-5xl font-bold font-display text-foreground">{avg.toFixed(1)}</span>
             <Star className="w-8 h-8 fill-amber-500 text-amber-500" />
           </div>
           <p className="text-sm text-muted-foreground font-medium">{totalReviews} verified reviews</p>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star as keyof typeof starCounts];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1 w-8 flex-shrink-0">
                  <span>{star}</span>
                  <Star className="w-3 h-3 text-muted-foreground" />
                </div>
                <Progress value={percentage} className="h-2 flex-1" indicatorClassName="bg-amber-500" />
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
