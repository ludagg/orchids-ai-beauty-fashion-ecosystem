"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";

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
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <Card
            key={badge.id}
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
                    {/* Assuming icon is URL or lucide name. If lucide name, need mapping.
                        For now, assume URL or placeholder logic.
                        Prompt says: "Lucide icon name ou URL".
                        I'll try to render image if URL, else specific icon or default.
                    */}
                    {badge.icon.startsWith('http') || badge.icon.startsWith('/') ? (
                        <Image src={badge.icon} alt={badge.name} width={32} height={32} className="object-contain" />
                    ) : (
                         <span className="text-2xl">🏆</span> // Fallback
                    )}

                    {badge.isUnlocked && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />
                        </div>
                    )}
                    {!badge.isUnlocked && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div>
                    <h4 className={cn("font-bold text-sm", badge.isUnlocked ? "text-primary" : "text-muted-foreground")}>
                        {badge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={badge.description}>
                        {badge.description}
                    </p>
                </div>

                {badge.isUnlocked && badge.unlockedAt && (
                    <Badge variant="outline" className="text-[10px] h-5">
                        {format(new Date(badge.unlockedAt as string | Date), 'MMM d, yyyy')}
                    </Badge>
                )}

                {!badge.isUnlocked && badge.pointsBonus && badge.pointsBonus > 0 && (
                     <Badge variant="secondary" className="text-[10px] h-5 bg-yellow-100 text-yellow-800">
                        +{badge.pointsBonus} pts
                     </Badge>
                )}
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
