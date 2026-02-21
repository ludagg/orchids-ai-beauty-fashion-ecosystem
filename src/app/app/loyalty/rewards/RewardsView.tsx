"use client";

import { RewardCard } from "@/components/loyalty/RewardCard";
import { useState } from "react";
import { toast } from "sonner";
import { GamificationPopup } from "@/components/loyalty/GamificationPopup";

interface Reward {
  id: string;
  name: string;
  description?: string;
  cost: number;
  type: string;
  image?: string;
  value?: number;
  quantity?: number;
  salon?: {
      name: string;
      image?: string;
  };
}

interface RewardsViewProps {
  initialRewards: Reward[];
  userPoints: number;
}

export function RewardsView({ initialRewards, userPoints }: RewardsViewProps) {
  const [rewards, setRewards] = useState(initialRewards);
  const [points, setPoints] = useState(userPoints);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<Reward | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string>("");

  const handleRedeem = async (rewardId: string) => {
    setLoadingId(rewardId);
    try {
      const res = await fetch("/api/loyalty/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to redeem");
      }

      setPoints(data.pointsRemaining);
      const reward = rewards.find(r => r.id === rewardId);
      if (reward) {
          setRedeemedReward(reward);
          setRedeemedCode(data.code);
          setShowPopup(true);
      }
      toast.success("Reward redeemed successfully!");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Rewards Shop</h2>
          <div className="bg-primary/10 px-4 py-2 rounded-full font-bold text-primary">
              Balance: {points} pts
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            onRedeem={handleRedeem}
            isLoading={loadingId === reward.id}
            canAfford={points >= reward.cost}
          />
        ))}
        {rewards.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">
                No rewards available at the moment.
            </p>
        )}
      </div>

      {redeemedReward && (
          <GamificationPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            title="Reward Unlocked!"
            description={`You have redeemed ${redeemedReward.name}. Use code: ${redeemedCode}`}
            image={redeemedReward.image}
            type="reward"
          />
      )}
    </>
  );
}
