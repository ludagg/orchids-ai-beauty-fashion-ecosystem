"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users, Check, Gift } from "lucide-react";
import { toast } from "sonner";

export function ReferralsCard() {
    const [referralCode, setReferralCode] = useState<string>("");
    const [referralCount, setReferralCount] = useState<number>(0);
    const [hasReferredBy, setHasReferredBy] = useState<boolean>(true); // assume true to avoid flash of input
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const [friendCode, setFriendCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchReferralData() {
            try {
                const res = await fetch("/api/loyalty/referral");
                if (res.ok) {
                    const data = await res.json();
                    setReferralCode(data.referralCode);
                    setReferralCount(data.referralCount);
                    setHasReferredBy(data.hasReferredBy);
                }
            } catch (error) {
                console.error("Failed to fetch referral data", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReferralData();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        setIsCopied(true);
        toast.success("Referral code copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleApplyCode = async () => {
        if (!friendCode.trim()) {
            toast.error("Please enter a referral code");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/loyalty/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: friendCode.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Code applied successfully! Points awarded.");
                setHasReferredBy(true);
            } else {
                toast.error(data.error || "Failed to apply referral code");
            }
        } catch (error) {
            console.error("Error applying code", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Refer a Friend
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-32 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Refer a Friend
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Invite your friends and earn <span className="font-semibold text-foreground">500 points</span> for each successful referral! They will also get 200 points.
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <div className="relative flex-1">
                            <Input
                                readOnly
                                value={referralCode}
                                className="font-mono text-center tracking-wider bg-muted/50 pr-10"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={copyToClipboard}
                        >
                            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Friends Referred</span>
                        <span className="text-2xl font-bold">{referralCount}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-sm text-muted-foreground">Points Earned</span>
                        <span className="text-2xl font-bold text-primary">+{referralCount * 500}</span>
                    </div>
                </div>

                {!hasReferredBy && (
                    <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Gift className="w-4 h-4 text-primary" />
                            Have a referral code?
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Enter friend's code"
                                value={friendCode}
                                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                            />
                            <Button
                                onClick={handleApplyCode}
                                disabled={isSubmitting || !friendCode.trim()}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
