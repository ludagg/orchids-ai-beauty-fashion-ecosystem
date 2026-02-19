"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const categories = [
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Luxury",
  "Streetwear",
  "Minimalist",
];

interface VideoUploadModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function VideoUploadModal({ trigger, onSuccess }: VideoUploadModalProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [isUploading, setIsUploading] = useState(false);

  // Product Tagging
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
                title,
                videoUrl: url,
                category,
                // TODO: Replace hardcoded thumbnail with real file upload or auto-generation service
                // Current infrastructure lacks media storage.
                thumbnailUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=1000&fit=crop",
                productIds: selectedProducts.map(p => p.id)
            })
        });

        if (res.ok) {
            toast.success("Video uploaded successfully!");
            setIsOpen(false);
            setTitle("");
            setUrl("");
            setSelectedProducts([]);
            setProductSearch("");
            if (onSuccess) onSuccess();
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

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
             <Plus className="w-4 h-4" />
             Upload
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4 pt-4">
          <div className="space-y-2">
              <Label>Video Title</Label>
              <Input
                placeholder="e.g. Summer Haul"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
          </div>
          <div className="space-y-2">
              <Label>Video URL (MP4 or YouTube)</Label>
              <Input
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
              />
          </div>
          <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                  {categories.map(c => (
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
                  <div className="border rounded-xl p-2 mt-2 bg-secondary/50 max-h-40 overflow-y-auto z-50 absolute w-[calc(100%-3rem)] bg-background shadow-lg">
                      {searchResults.map(product => (
                          <div
                              key={product.id}
                              className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
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

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
              {isUploading ? "Uploading..." : "Publish Video"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
