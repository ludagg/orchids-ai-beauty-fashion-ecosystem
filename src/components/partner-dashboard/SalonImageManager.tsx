"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface SalonImage {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface SalonImageManagerProps {
  salonId: string;
}

export function SalonImageManager({ salonId }: SalonImageManagerProps) {
  const [images, setImages] = useState<SalonImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [salonId]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/salons/${salonId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.images) {
            setImages(data.images);
        }
      }
    } catch (error) {
      console.error("Failed to fetch images", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setAdding(true);
    try {
      const res = await fetch(`/api/salons/${salonId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl }),
      });

      if (!res.ok) throw new Error("Failed to add image");

      const newImage = await res.json();
      setImages([...images, newImage]);
      setNewUrl("");
      toast.success("Image added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add image");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/salons/${salonId}/images/${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setImages(images.filter((img) => img.id !== imageId));
      toast.success("Image deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    }
  };

  if (loading) return <div>Loading images...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Gallery</h3>
        <span className="text-sm text-muted-foreground">{images.length} images</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
            <img src={img.url} alt={img.caption || "Salon image"} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(img.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {images.length === 0 && (
            <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg text-muted-foreground">
                <ImageIcon className="w-8 h-8 mb-2" />
                <p>No images yet</p>
            </div>
        )}
      </div>

      <form onSubmit={handleAddImage} className="flex gap-2 items-end border-t pt-6">
        <div className="flex-1 space-y-2">
            <Label htmlFor="image-url">Add Image URL</Label>
            <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
            />
        </div>
        <Button type="submit" disabled={adding || !newUrl}>
            {adding ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Add Image</>}
        </Button>
      </form>
    </div>
  );
}
