"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LiveHero from "@/components/videos-creations/LiveHero";
import CategoryPills from "@/components/videos-creations/CategoryPills";
import CreatorRail from "@/components/videos-creations/CreatorRail";
import VideoCard, { VideoCardProps } from "@/components/videos-creations/VideoCard";
import { Loader2, Video as VideoIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "All",
  "Live Now",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Luxury",
  "Streetwear",
  "Minimalist",
];

// Mock creators for the rail (can be fetched dynamically later)
const creators = [
  { id: "1", name: "Ananya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isLive: true },
  { id: "2", name: "Rahul Mehra", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isLive: false },
  { id: "3", name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isLive: true },
];

export default function VideosCreationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Fashion");
  const [isUploading, setIsUploading] = useState(false);

  // Product Tagging State
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (productSearch.length > 2) {
            try {
                const res = await fetch(`/api/products?search=${productSearch}&limit=5`);
                if (res.ok) {
                    setSearchResults(await res.json());
                }
            } catch (error) {
                console.error("Search error", error);
            }
        } else {
            setSearchResults([]);
        }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [productSearch]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All" && selectedCategory !== "Live Now") {
            params.append("category", selectedCategory);
        }
        const res = await fetch(`/api/videos?${params.toString()}`);
        if (res.ok) {
            const data = await res.json();
            // Transform data to match VideoCardProps
            const transformed = data.map((v: any) => ({
                id: v.id,
                title: v.title,
                creator: {
                    name: v.user.name,
                    avatar: v.user.image,
                    verified: v.salonId ? true : false
                },
                thumbnail: v.thumbnailUrl,
                views: v.views.toString(),
                likes: v.likes.toString(),
                isLive: v.isLive,
                category: v.category
            }));

            if (selectedCategory === "Live Now") {
                 setVideos(transformed.filter((v: any) => v.isLive));
            } else {
                 setVideos(transformed);
            }
        }
    } catch (error) {
        console.error("Failed to fetch videos", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
        toast.error("Please login to upload");
        return;
    }

    setIsUploading(true);
    try {
        const res = await fetch('/api/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: uploadTitle,
                videoUrl: uploadUrl,
                category: uploadCategory,
                // Simple mock thumbnail logic for now
                thumbnailUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=1000&fit=crop",
                productIds: selectedProducts.map(p => p.id)
            })
        });

        if (res.ok) {
            toast.success("Video uploaded successfully!");
            setIsUploadOpen(false);
            setUploadTitle("");
            setUploadUrl("");
            setSelectedProducts([]);
            setProductSearch("");
            fetchVideos(); // Refresh list
        } else {
            toast.error("Failed to upload video");
        }
    } catch (error) {
        console.error("Upload error", error);
        toast.error("Something went wrong");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">

      {/* Hero Section */}
      <LiveHero />

      {/* Creator Rail */}
      <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display text-foreground">Top Creators</h2>
              {session && (
                  <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                      <DialogTrigger asChild>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
                              <Plus className="w-4 h-4" />
                              Upload Video
                          </button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Upload New Video</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpload} className="space-y-4 pt-4">
                              <div className="space-y-2">
                                  <Label>Video Title</Label>
                                  <Input
                                    placeholder="e.g. Summer Haul"
                                    value={uploadTitle}
                                    onChange={e => setUploadTitle(e.target.value)}
                                    required
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Video URL (MP4 or YouTube)</Label>
                                  <Input
                                    placeholder="https://..."
                                    value={uploadUrl}
                                    onChange={e => setUploadUrl(e.target.value)}
                                    required
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Category</Label>
                                  <select
                                    className="w-full px-3 py-2 rounded-md border bg-background"
                                    value={uploadCategory}
                                    onChange={e => setUploadCategory(e.target.value)}
                                  >
                                      {categories.filter(c => c !== "All" && c !== "Live Now").map(c => (
                                          <option key={c} value={c}>{c}</option>
                                      ))}
                                  </select>
                              </div>

                              <div className="space-y-2">
                                  <Label>Tag Products (Shoppable)</Label>
                                  <Input
                                      placeholder="Search products to tag..."
                                      value={productSearch}
                                      onChange={e => setProductSearch(e.target.value)}
                                  />
                                  {searchResults.length > 0 && (
                                      <div className="border rounded-xl p-2 mt-2 bg-secondary/50 max-h-40 overflow-y-auto z-50">
                                          {searchResults.map(product => (
                                              <div
                                                  key={product.id}
                                                  className="flex items-center gap-3 p-2 hover:bg-background rounded-lg cursor-pointer transition-colors"
                                                  onClick={() => {
                                                      if (!selectedProducts.find(p => p.id === product.id)) {
                                                          setSelectedProducts([...selectedProducts, product]);
                                                          setProductSearch("");
                                                          setSearchResults([]);
                                                      }
                                                  }}
                                              >
                                                  <img src={product.images?.[0]} className="w-8 h-8 rounded-md object-cover bg-muted" />
                                                  <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                                  </div>
                                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  {selectedProducts.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                          {selectedProducts.map(p => (
                                               <div key={p.id} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                                  <span className="max-w-[150px] truncate">{p.name}</span>
                                                  <button
                                                    type="button"
                                                    onClick={() => setSelectedProducts(selectedProducts.filter(sp => sp.id !== p.id))}
                                                    className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                                                  >
                                                      <X className="w-3 h-3" />
                                                  </button>
                                               </div>
                                          ))}
                                      </div>
                                  )}
                              </div>

                              <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                              >
                                  {isUploading ? "Uploading..." : "Publish Video"}
                              </button>
                          </form>
                      </DialogContent>
                  </Dialog>
              )}
          </div>
          <CreatorRail creators={creators} />
      </section>

      {/* Categories */}
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Video Grid */}
      {loading ? (
           <div className="flex justify-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-primary" />
           </div>
      ) : (
        <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
            {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
            ))}
        </motion.div>
      )}

        {videos.length === 0 && !loading && (
            <div className="text-center py-20 bg-muted/30 rounded-[40px] border border-dashed border-border">
                <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-bold">No videos found for this category.</p>
                <button
                    onClick={() => setSelectedCategory("All")}
                    className="mt-4 px-6 py-2 rounded-full bg-foreground text-white font-bold text-sm"
                >
                    Clear Filters
                </button>
            </div>
        )}
    </div>
  );
}
