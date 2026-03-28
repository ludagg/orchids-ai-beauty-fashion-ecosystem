// [Jules - Extracted ProfileRewardsSection from monolithic ProfileView.tsx]
import { Gift, ArrowRight, Award, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { UserData } from "./types";

export function ProfileRewardsSection({ user }: { user: UserData }) {
  const points = user.loyaltyPoints || 0;

  // Simple level calculation for display (sync with backend logic ideally)
  const getLevel = (p: number) => {
      if (p >= 10000) return { name: "Diamond", next: null, min: 10000 };
      if (p >= 5000) return { name: "Platinum", next: 10000, min: 5000 };
      if (p >= 2000) return { name: "Gold", next: 5000, min: 2000 };
      if (p >= 500) return { name: "Silver", next: 2000, min: 500 };
      return { name: "Bronze", next: 500, min: 0 };
  };

  const currentLevel = getLevel(points);
  const nextMilestone = currentLevel.next || points;
  const progress = currentLevel.next
      ? Math.min(Math.max((points - currentLevel.min) / (currentLevel.next - currentLevel.min) * 100, 0), 100)
      : 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Rewards Card */}
      <Card className="overflow-hidden border shadow-sm">
        <div className="bg-primary p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  Loyalty Points
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Earn points with every booking and purchase
                </CardDescription>
              </div>
              <div className="bg-primary-foreground/10 p-3 rounded-full backdrop-blur-sm">
                <Gift className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-bold text-primary-foreground">{points}</span>
                <span className="text-xl text-primary-foreground/80 font-medium">points</span>
              </div>

              <div className="space-y-2">
                <Progress
                    value={progress}
                    className="h-2 bg-primary-foreground/20"
                    // @ts-ignore
                    indicatorClassName="bg-primary-foreground"
                />
                <div className="flex justify-between text-xs text-primary-foreground/80 font-medium">
                    <span>{points} pts</span>
                    <span>{currentLevel.next ? `Next Level: ${currentLevel.next} pts` : 'Max Level'}</span>
                </div>
              </div>

              <div className="pt-4">
                  <Button variant="secondary" asChild className="w-full sm:w-auto">
                      <Link href="/app/loyalty">
                          View Full Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tier and Level Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Tier</CardTitle>
                <CardDescription>Your membership level</CardDescription>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Award className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-xl font-bold text-foreground">
                  {currentLevel.name} Member
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">Unlock exclusive benefits as you climb tiers.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Earn points on all bookings</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Redeem for discounts & products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Unlock special badges</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Start Earning</CardTitle>
                <CardDescription>How to get points</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8" asChild>
                  <Link href="/app/loyalty/rewards">View Rewards</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Complete a Booking', points: '+10 pts / ₹100', icon: '📅' },
                { action: 'Write a Review', points: '+10 pts', icon: '✍️' },
                { action: 'Review with Photo', points: '+30 pts', icon: '📸' },
                { action: 'Refer a Friend', points: '+50 pts', icon: '👥' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-sm font-medium">{item.action}</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                    {item.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
