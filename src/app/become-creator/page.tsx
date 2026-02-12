"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BecomeCreatorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const formData = new FormData(e.target as HTMLFormElement);
        const bio = formData.get("bio");
        const instagram = formData.get("instagram");
        const youtube = formData.get("youtube");
        const website = formData.get("website");

        const res = await fetch("/api/creator/apply", {
            method: "POST",
            body: JSON.stringify({
                bio,
                socialLinks: { instagram, youtube, website }
            }),
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Application failed");

        toast.success("Application submitted! Welcome to the Studio.");
        router.push("/creator-studio");
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <Link href="/app/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Profile
        </Link>

        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-display">Become a Creator</h1>
            <p className="text-muted-foreground">Join our community of trendsetters and start earning.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Application</CardTitle>
                <CardDescription>Tell us a bit about yourself.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" placeholder="What kind of content do you create?" required className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Handle</Label>
                        <Input id="instagram" name="instagram" placeholder="@username" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube Channel</Label>
                        <Input id="youtube" name="youtube" placeholder="Channel Name" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Portfolio / Website</Label>
                        <Input id="website" name="website" placeholder="https://example.com" />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
