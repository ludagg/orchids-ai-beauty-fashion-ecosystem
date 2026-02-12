"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
       <div>
        <h1 className="text-2xl font-bold">Studio Settings</h1>
        <p className="text-muted-foreground">Manage your creator preferences and payout details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Channel Details</CardTitle>
                <CardDescription>How you appear to viewers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="channelName">Channel Name</Label>
                    <Input id="channelName" defaultValue="Jane Doe Fashion" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Channel Bio</Label>
                    <Textarea id="bio" defaultValue="Fashion, lifestyle, and everything in between." />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Payment & Payouts</CardTitle>
                <CardDescription>Manage where you receive your earnings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="paypal">PayPal Email</Label>
                    <Input id="paypal" type="email" defaultValue="jane@example.com" />
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Stripe Connected</span>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
