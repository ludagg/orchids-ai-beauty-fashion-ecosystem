"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Save, Globe, Instagram, Youtube, Loader2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || null);
    }
  }, [session]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g., limit to 2MB to avoid huge base64 strings)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information, creator profile, and rewards.</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="creator">Creator Profile</TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
             <Gift className="w-4 h-4" />
             Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Avatar Section */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="flex flex-col items-center text-center pt-6">
                  <div
                    className="relative mb-4 group cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                      <AvatarImage src={image || "/placeholder-avatar.jpg"} alt="Profile" className="object-cover" />
                      <AvatarFallback className="text-4xl bg-gradient-to-tr from-violet-500 to-rose-500 text-white">
                        {name ? name.substring(0, 2).toUpperCase() : "JD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  <div className="mt-4 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                    Member since {session?.user?.createdAt ? new Date(session.user.createdAt).getFullYear() : "2024"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={session?.user?.email || ""}
                        className="pl-9"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                  </div>

                  <div className="space-y-2 opacity-50 pointer-events-none" title="Coming soon">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2 opacity-50 pointer-events-none" title="Coming soon">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="location" defaultValue="Bangalore, India" className="pl-9" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="creator">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Creator Profile</CardTitle>
                <CardDescription>Manage your public creator profile and settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and what you create..."
                    className="min-h-[120px]"
                    defaultValue="Passionate about sustainable fashion and minimalist design. Sharing my journey and tips for a conscious wardrobe."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <Input placeholder="Instagram Handle" defaultValue="@jane.fashion" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <Input placeholder="YouTube Channel" defaultValue="Jane's Style" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <Input placeholder="Website URL" defaultValue="https://janedoe.com" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 flex items-center justify-center font-bold text-black dark:text-white">Tk</span>
                      <Input placeholder="TikTok Handle" defaultValue="@jane.tok" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Specialties</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Fashion", "Beauty", "Lifestyle", "Tech", "Travel", "Food", "Fitness", "DIY"].map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox id={tag} defaultChecked={["Fashion", "Lifestyle"].includes(tag)} />
                        <Label htmlFor={tag} className="font-normal cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-0.5">
                    <Label className="text-base">Accepting Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Let brands and users verify you are open for collaborations.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="rewards">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Gift className="w-48 h-48 transform rotate-12" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                             My Loyalty Points
                        </CardTitle>
                        <CardDescription className="text-indigo-100">Earn points with every booking and purchase.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-6xl font-bold font-display">{(session?.user as any)?.loyaltyPoints || 0}</span>
                            <span className="text-xl font-medium mb-4 opacity-80">points</span>
                        </div>
                        <p className="mt-4 text-sm text-indigo-100 bg-white/10 p-3 rounded-lg inline-block border border-white/10 backdrop-blur-sm">
                            100 points = $1.00 discount (Redemption Coming Soon)
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                     <CardHeader>
                        <CardTitle>Level</CardTitle>
                        <CardDescription>Your current tier</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-2">
                         <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg mb-4">
                             <span className="text-3xl">🌟</span>
                         </div>
                         <h3 className="text-xl font-bold text-yellow-600">Gold Member</h3>
                         <p className="text-xs text-muted-foreground mt-1">Top 10% of users</p>
                    </CardContent>
                </Card>
             </div>

            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>Recent point activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                        <Gift className="w-8 h-8 opacity-20 mb-2" />
                        <p>No recent activity.</p>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
