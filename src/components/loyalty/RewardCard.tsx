"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, ShoppingBag, Percent, Tag, Store } from "lucide-react";
import Image from "next/image";

interface Reward {
  id: string;
  name: string;
  description?: string | null;
  cost: number;
  type: string;
  image?: string | null;
  value?: number | null;
  quantity?: number | null;
  salon?: {
      name: string;
      image?: string | null;
  };
}

interface RewardCardProps {
  reward: Reward;
  onRedeem?: (rewardId: string) => void;
  isLoading?: boolean;
  canAfford?: boolean;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'discount_fixed': return <Tag className="h-4 w-4" />;
        case 'discount_percent': return <Percent className="h-4 w-4" />;
        case 'product': return <ShoppingBag className="h-4 w-4" />;
        case 'free_service': return <Ticket className="h-4 w-4" />;
        default: return <Tag className="h-4 w-4" />;
    }
};

const getTypeName = (type: string) => {
     switch (type) {
        case 'discount_fixed': return 'Discount';
        case 'discount_percent': return '% Off';
        case 'product': return 'Product';
        case 'free_service': return 'Free Service';
        default: return 'Reward';
    }
}

export function RewardCard({ reward, onRedeem, isLoading, canAfford = true }: RewardCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 w-full bg-muted">
         {reward.image ? (
            <Image src={reward.image} alt={reward.name} fill className="object-cover" />
         ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                {getTypeIcon(reward.type)}
            </div>
         )}
         <div className="absolute top-2 right-2">
             <Badge variant="secondary" className="backdrop-blur-md bg-white/50">
                 {getTypeName(reward.type)}
             </Badge>
         </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1" title={reward.name}>{reward.name}</CardTitle>
        </div>
        {reward.salon && (
             <div className="flex items-center text-xs text-muted-foreground gap-1">
                 <Store className="h-3 w-3" />
                 {reward.salon.name}
             </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2" title={reward.description || ''}>
            {reward.description}
        </p>
      </CardContent>

      <CardFooter className="pt-2 border-t bg-muted/20">
        <div className="flex w-full items-center justify-between">
            <span className="font-bold text-primary">{reward.cost} pts</span>
            <Button
                size="sm"
                onClick={() => onRedeem?.(reward.id)}
                disabled={!canAfford || isLoading || (reward.quantity != null && reward.quantity <= 0)}
            >
                {isLoading ? "..." : (reward.quantity != null && reward.quantity <= 0) ? "Out of Stock" : "Redeem"}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
