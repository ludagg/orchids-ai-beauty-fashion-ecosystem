"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

interface LoyaltyBadge {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date | string | null;
  rarity?: string | null;
  pointsBonus?: number | null;
}

interface BadgeCollectionProps {
  badges: LoyaltyBadge[];
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  if (badges.length === 0) {
    return (
      <Empty className="py-12 border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Award className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No achievements found</EmptyTitle>
          <EmptyDescription>
            Complete activities and book services to unlock loyalty badges.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" aria-label="Achievements list">
      {badges.map((badge) => {
        const formattedDate = badge.isUnlocked && badge.unlockedAt ? format(new Date(badge.unlockedAt as string | Date), 'MMM d, yyyy') : null;
        const ariaLabel = `${badge.name}: ${badge.isUnlocked ? `Unlocked${formattedDate ? ' on ' + formattedDate : ''}` : 'Locked'}${!badge.isUnlocked && badge.pointsBonus ? `, +${badge.pointsBonus} bonus points` : ''}. ${badge.description || ''}`;

        return (
          <Card
            key={badge.id}
            role="listitem"
            aria-label={ariaLabel}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              badge.isUnlocked
                ? "border-primary/50 bg-gradient-to-br from-background to-primary/5 shadow-md hover:shadow-lg hover:-translate-y-1"
                : "opacity-60 grayscale border-dashed hover:opacity-80"
            )}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3 h-full">
              <div className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center shadow-inner",
                badge.isUnlocked ? "bg-primary/20" : "bg-muted"
              )}>
                {badge.icon.startsWith('http') || badge.icon.startsWith('/') ? (
                  <Image src={badge.icon} alt="" width={32} height={32} className="object-contain" aria-hidden="true" />
                ) : (
                  <span className="text-2xl" aria-hidden="true">🏆</span>
                )}

                {badge.isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" aria-hidden="true" />
                  </div>
                )}
                {!badge.isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                    <Lock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div>
                <h4 className={cn("font-bold text-sm", badge.isUnlocked ? "text-primary" : "text-muted-foreground")}>
                  {badge.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={badge.description || undefined}>
                  {badge.description}
                </p>
              </div>

              {badge.isUnlocked && badge.unlockedAt && (
                <Badge variant="outline" className="text-[10px] h-5">
                  {formattedDate}
                </Badge>
              )}

              {!badge.isUnlocked && badge.pointsBonus && badge.pointsBonus > 0 && (
                <Badge variant="secondary" className="text-[10px] h-5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  +{badge.pointsBonus} pts
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
