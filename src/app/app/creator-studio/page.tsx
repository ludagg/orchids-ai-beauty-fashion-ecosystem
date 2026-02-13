"use client";

import {
  Heart,
  Upload,
  Play,
  Edit,
  Settings,
  Video,
  Share2,
  Lock,
  Scissors,
  ShoppingBag,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// --- Mock Data ---
const creatorProfile = {
  name: "Jane Doe",
  handle: "@janedoe_style",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  bio: "Fashion enthusiast & style curator. Bringing you the latest trends from Paris to Tokyo. 🌸✨",
  stats: {
    followers: "12.5K",
    likes: "45.2K",
    views: "1.2M",
    engagement: "4.8%"
  }
};

const videos = [
  {
    id: "1",
    title: "Summer 2024 Fashion Trends You Need to Know",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop",
    views: 125000,
    likes: 4500,
    date: "2024-05-15",
    status: "Published"
  },
  {
    id: "2",
    title: "My Daily Skincare Routine for Glowing Skin",
    thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop",
    views: 89000,
    likes: 3200,
    date: "2024-05-10",
    status: "Published"
  },
  {
    id: "3",
    title: "Paris Fashion Week Vlog - Behind the Scenes",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    views: 210000,
    likes: 15000,
    date: "2024-05-01",
    status: "Published"
  },
  {
    id: "4",
    title: "Testing Viral TikTok Makeup Hacks",
    thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
    views: 45000,
    likes: 1800,
    date: "2024-04-20",
    status: "Draft"
  },
  {
    id: "5",
    title: "Street Style Inspo",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    views: 12000,
    likes: 900,
    date: "2024-04-15",
    status: "Published"
  },
   {
    id: "6",
    title: "GRWM for Date Night",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    views: 5600,
    likes: 230,
    date: "2024-04-10",
    status: "Private"
  }
];

// --- Schemas & Types ---
const partnerSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  type: z.enum(["salon", "boutique", "both"]),
  description: z.string().min(10, "Please provide a brief description"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(8, "Phone number is required"),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

interface ServiceItem {
    id: string;
    name: string;
    price: string;
}

interface ProductItem {
    id: string;
    name: string;
    price: string;
}

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [isPartner, setIsPartner] = useState(false);
  const [partnerData, setPartnerData] = useState<PartnerFormValues | null>(null);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);

  // Local state for Services and Products
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);


  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      businessName: "",
      type: "salon",
      description: "",
      address: "",
      phone: "",
    },
  });

  const onPartnerSubmit = (data: PartnerFormValues) => {
    // Mimic API call
    console.log("Partner Data Submitted:", data);
    setPartnerData(data);
    setIsPartner(true);
    setIsPartnerDialogOpen(false);
    toast.success("Congratulations! You are now a Partner.");
  };

  const handleAddService = () => {
      const name = window.prompt("Service Name:");
      if(!name) return;
      const price = window.prompt("Price:");
      if(!price) return;

      setServices([...services, { id: Math.random().toString(), name, price }]);
  };

    const handleAddProduct = () => {
      const name = window.prompt("Product Name:");
      if(!name) return;
      const price = window.prompt("Price:");
      if(!price) return;

      setProducts([...products, { id: Math.random().toString(), name, price }]);
  };

  const publishedVideos = videos.filter(v => v.status === 'Published');
  const draftVideos = videos.filter(v => v.status === 'Draft' || v.status === 'Private');
  const likedVideos = videos.slice(0, 3); // Mock liked videos

  const showServicesTab = isPartner && (partnerData?.type === 'salon' || partnerData?.type === 'both');
  const showProductsTab = isPartner && (partnerData?.type === 'boutique' || partnerData?.type === 'both');


  return (
    <div className="max-w-4xl mx-auto min-h-screen pb-20 pt-8 px-4">

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-6 mb-8">

        {/* Avatar */}
        <div className="relative group">
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background shadow-xl overflow-hidden">
                <Avatar className="w-full h-full">
                    <AvatarImage src={creatorProfile.avatar} className="object-cover" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 border-2 border-background cursor-pointer hover:scale-110 transition-transform">
                <Edit className="w-4 h-4" />
            </div>
        </div>

        {/* Name & Handle */}
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight font-display flex items-center justify-center gap-2">
                {isPartner ? partnerData?.businessName : creatorProfile.name}
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                    {isPartner ? 'Partner' : 'Creator'}
                </Badge>
            </h1>
            <p className="text-muted-foreground font-medium">{creatorProfile.handle}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            {!isPartner && (
                <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
                    <DialogTrigger asChild>
                         <Button className="flex-1 min-w-[120px]" size="lg">
                            Become a Partner
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Become a Partner</DialogTitle>
                        <DialogDescription>
                            Join us as a Salon or Boutique partner. Fill out the details below to get started.
                        </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onPartnerSubmit)} className="space-y-4 py-4">
                             <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input id="businessName" placeholder="e.g. Luxe Salon" {...form.register("businessName")} />
                                {form.formState.errors.businessName && <p className="text-red-500 text-xs">{form.formState.errors.businessName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Partner Type</Label>
                                <Select onValueChange={(val: any) => form.setValue("type", val)} defaultValue={form.getValues("type")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="salon">Salon (Services)</SelectItem>
                                        <SelectItem value="boutique">Boutique (Products)</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Tell us about your business..." {...form.register("description")} />
                                 {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Fashion St, Paris" {...form.register("address")} />
                                {form.formState.errors.address && <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>}
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" placeholder="+1 234 567 890" {...form.register("phone")} />
                                {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="submit">Submit Application</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
             {isPartner && (
                 <Button className="flex-1 min-w-[120px]" size="lg" variant="outline">
                    Edit Business Profile
                </Button>
             )}

            <Button variant="outline" size="icon" className="h-11 w-11">
                <Share2 className="w-5 h-5" />
            </Button>
             <Button variant="secondary" size="icon" className="h-11 w-11">
                <Settings className="w-5 h-5" />
            </Button>
        </div>

        {/* Main Actions (Upload / Live) */}
        <div className="flex items-center justify-center gap-4 text-sm font-medium pt-2">
             <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                <Video className="w-4 h-4" />
                Go Live
            </Button>
             <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                <Upload className="w-4 h-4" />
                Upload New
            </Button>
        </div>


        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 md:gap-12 py-4 border-y border-border/40 w-full max-w-2xl">
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{creatorProfile.stats.followers}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Followers</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold">482</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Following</span>
            </div>
             <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{creatorProfile.stats.likes}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Likes</span>
            </div>
             <div className="flex flex-col items-center hidden sm:flex">
                <span className="text-lg font-bold">{creatorProfile.stats.views}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Views</span>
            </div>
        </div>

        {/* Bio */}
         <p className="text-sm text-center max-w-md mx-auto leading-relaxed">
            {isPartner ? partnerData?.description : creatorProfile.bio} <br/>
            {isPartner && <span className="block mt-2 text-muted-foreground text-xs">{partnerData?.address} • {partnerData?.phone}</span>}
            <a href="#" className="text-primary hover:underline font-medium mt-1 inline-block">linktr.ee/janedoe_style</a>
        </p>

      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-transparent border-b h-12 p-0 rounded-none mb-6 overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="videos"
            className="flex-1 min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>

          {showServicesTab && (
             <TabsTrigger
                value="services"
                className="flex-1 min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
            >
                <Scissors className="w-4 h-4 mr-2" />
                Services
            </TabsTrigger>
          )}

           {showProductsTab && (
             <TabsTrigger
                value="products"
                className="flex-1 min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
            >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Products
            </TabsTrigger>
          )}

          <TabsTrigger
            value="drafts"
            className="flex-1 min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Lock className="w-4 h-4 mr-2" />
            Drafts
          </TabsTrigger>
           <TabsTrigger
            value="liked"
            className="flex-1 min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Heart className="w-4 h-4 mr-2" />
            Liked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
             <div className="grid grid-cols-3 gap-px md:gap-1">
                {publishedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
             </div>
             {publishedVideos.length === 0 && <EmptyState type="videos" />}
        </TabsContent>

        {showServicesTab && (
            <TabsContent value="services" className="mt-0 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">My Services</h2>
                    <Button size="sm" onClick={handleAddService}><Plus className="w-4 h-4 mr-2"/> Add Service</Button>
                </div>
                 {services.length === 0 ? (
                      <EmptyState type="services" onAdd={handleAddService}/>
                 ) : (
                    <div className="grid gap-4">
                        {services.map((service) => (
                            <Card key={service.id}>
                                <CardContent className="flex justify-between items-center p-4">
                                    <div>
                                        <h3 className="font-medium">{service.name}</h3>
                                        <p className="text-sm text-muted-foreground">Service</p>
                                    </div>
                                    <span className="font-bold">{service.price}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                 )}
            </TabsContent>
        )}

         {showProductsTab && (
            <TabsContent value="products" className="mt-0 space-y-4">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">My Products</h2>
                    <Button size="sm" onClick={handleAddProduct}><Plus className="w-4 h-4 mr-2"/> Add Product</Button>
                </div>
                 {products.length === 0 ? (
                      <EmptyState type="products" onAdd={handleAddProduct}/>
                 ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <Card key={product.id}>
                                <CardContent className="p-4 space-y-2">
                                    <div className="aspect-square bg-muted rounded-md w-full" />
                                    <div>
                                        <h3 className="font-medium truncate">{product.name}</h3>
                                        <p className="text-sm font-bold">{product.price}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                 )}
            </TabsContent>
        )}

        <TabsContent value="drafts" className="mt-0">
            <div className="grid grid-cols-3 gap-px md:gap-1">
                {draftVideos.map((video) => (
                     <VideoCard key={video.id} video={video} isPrivate />
                ))}
             </div>
             {draftVideos.length === 0 && <EmptyState type="drafts" />}
        </TabsContent>

         <TabsContent value="liked" className="mt-0">
            <div className="grid grid-cols-3 gap-px md:gap-1">
                {likedVideos.map((video) => (
                     <VideoCard key={video.id} video={video} isLiked />
                ))}
             </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VideoCard({ video, isPrivate, isLiked }: { video: any, isPrivate?: boolean, isLiked?: boolean }) {
    return (
        <div className="aspect-[9/16] relative bg-muted cursor-pointer overflow-hidden group">
            <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Play className="w-8 h-8 text-white fill-white" />
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white drop-shadow-md">
                {isPrivate ? <Lock className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span className="text-xs font-semibold">{video.views >= 1000 ? `${(video.views/1000).toFixed(1)}K` : video.views}</span>
            </div>

            {isLiked && (
                 <div className="absolute top-2 right-2 text-white drop-shadow-md">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                 </div>
            )}
        </div>
    )
}

function EmptyState({ type, onAdd }: { type: string, onAdd?: () => void }) {
    let Icon = Video;
    let title = `No ${type} yet`;
    let description = "Upload your first video to get started sharing your content with the world.";
    let buttonText = "Upload Video";

    if (type === 'drafts') {
        Icon = Lock;
    } else if (type === 'services') {
        Icon = Scissors;
        description = "Add services to your menu so customers can book appointments.";
        buttonText = "Add Service";
    } else if (type === 'products') {
        Icon = ShoppingBag;
        description = "List products to start selling to your followers.";
        buttonText = "Add Product";
    }

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-muted rounded-full p-6">
                <Icon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium capitalize">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
                {description}
            </p>
            <Button variant="outline" onClick={onAdd}>{buttonText}</Button>
        </div>
    )
}
