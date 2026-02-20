"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Mail, Phone, MapPin, Instagram, Youtube, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name: string;
    email: string;
    image: string | null;
    createdAt?: Date;
  };
  onSave?: () => void;
}

export function EditProfileModal({ isOpen, onOpenChange, user, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState<string | null>(user.image);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user.name);
    setImage(user.image);
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
      if (onSave) onSave();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal and creator details.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="creator">Creator Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <button
                    type="button"
                    className="relative group cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={handleImageClick}
                    aria-label="Change profile picture"
                  >
                    <Avatar className="w-24 h-24 border-2 border-background shadow-md">
                      <AvatarImage src={image || "/placeholder-avatar.jpg"} alt="Profile" className="object-cover" />
                      <AvatarFallback className="text-xl">
                        {name ? name.substring(0, 2).toUpperCase() : "JD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="w-full space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="email" value={user.email} disabled className="pl-9" />
                        </div>
                     </div>
                     <div className="space-y-2 opacity-50 pointer-events-none">
                         <Label htmlFor="phone">Phone</Label>
                         <div className="relative">
                             <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                             <Input id="phone" defaultValue="+1234567890" className="pl-9" />
                         </div>
                     </div>
                     <div className="space-y-2 opacity-50 pointer-events-none">
                         <Label htmlFor="location">Location</Label>
                         <div className="relative">
                             <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                             <Input id="location" defaultValue="New York, USA" className="pl-9" />
                         </div>
                     </div>
                  </div>
            </div>
          </TabsContent>

          <TabsContent value="creator" className="space-y-6">
             <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                    defaultValue="Passionate about sustainable fashion and minimalist design. Sharing my journey and tips for a conscious wardrobe."
                  />
             </div>
             <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-5 h-5 text-pink-600 shrink-0" />
                      <Input placeholder="Instagram Handle" defaultValue="@jane.fashion" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Youtube className="w-5 h-5 text-red-600 shrink-0" />
                      <Input placeholder="YouTube Channel" defaultValue="Jane's Style" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                      <Input placeholder="Website URL" defaultValue="https://janedoe.com" />
                    </div>
                  </div>
             </div>
             <div className="space-y-3">
                  <Label>Specialties</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Fashion", "Beauty", "Lifestyle", "Tech"].map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox id={tag} defaultChecked={["Fashion", "Lifestyle"].includes(tag)} />
                        <Label htmlFor={tag} className="font-normal cursor-pointer text-sm">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
             </div>
              <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Accepting Bookings</Label>
                  </div>
                  <Switch defaultChecked />
             </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
