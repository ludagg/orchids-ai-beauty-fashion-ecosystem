"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Crown, Star, ShieldCheck, Gem, Sparkles } from "lucide-react";

interface Level {
  id: string;
  name: string;
  minPoints: number;
  badgeImage?: string | null;
}

interface LevelProgressProps {
  currentPoints: number;
  currentLevel: Level | undefined;
  nextLevel: Level | undefined;
}

const getLevelIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("bronze")) return <ShieldCheck className="h-5 w-5 text-amber-700" />;
  if (n.includes("silver") || n.includes("argent")) return <ShieldCheck className="h-5 w-5 text-slate-400" />;
  if (n.includes("gold") || n.includes("or")) return <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
  if (n.includes("platinum") || n.includes("platine")) return <Crown className="h-5 w-5 text-cyan-400" />;
  if (n.includes("diamond") || n.includes("diamant")) return <Gem className="h-5 w-5 text-blue-500" />;
  return <Sparkles className="h-5 w-5 text-primary" />;
};

export function LevelProgress({ currentPoints, currentLevel, nextLevel }: LevelProgressProps) {
  if (!currentLevel) return null;

  let progress = 0;
  let pointsNeeded = 0;

  if (nextLevel) {
    const range = nextLevel.minPoints - currentLevel.minPoints;
    const currentInRange = currentPoints - currentLevel.minPoints;
    progress = Math.min(100, Math.max(0, (currentInRange / range) * 100));
    pointsNeeded = nextLevel.minPoints - currentPoints;
  } else {
    progress = 100; // Max level reached
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-full">
                {getLevelIcon(currentLevel.name)}
            </div>
            <div>
                <h3 className="font-bold text-lg">{currentLevel.name}</h3>
                <p className="text-sm text-muted-foreground">{currentPoints} Glow Points</p>
            </div>
        </div>
        {nextLevel && (
            <div className="text-right">
                <p className="text-sm font-medium text-primary">{pointsNeeded} pts to {nextLevel.name}</p>
                <p className="text-xs text-muted-foreground">Next Reward: {nextLevel.minPoints} pts</p>
            </div>
        )}
        {!nextLevel && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                Max Level Reached! 🏆
            </Badge>
        )}
      </div>

      <div className="relative pt-2">
        <Progress value={progress} className="h-3" />
        <motion.div
            className="absolute top-0 transform -translate-x-1/2 -mt-1"
            style={{ left: `${progress}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                {Math.round(progress)}%
            </div>
        </motion.div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentLevel.minPoints} pts</span>
          <span>{nextLevel ? `${nextLevel.minPoints} pts` : '∞'}</span>
      </div>
    </div>
  );
}
