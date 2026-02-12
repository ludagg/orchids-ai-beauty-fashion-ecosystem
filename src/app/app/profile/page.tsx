"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Save, Globe, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and creator profile.</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="creator">Creator Profile</TabsTrigger>
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
                  <div className="relative mb-4 group cursor-pointer">
                    <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                      <AvatarFallback className="text-4xl bg-gradient-to-tr from-violet-500 to-rose-500 text-white">JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold">Jane Doe</h2>
                  <p className="text-sm text-muted-foreground">Fashion Enthusiast</p>
                  <div className="mt-4 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                    Member since 2024
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Jane" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" defaultValue="jane.doe@example.com" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
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
      </Tabs>
    </div>
  );
}
