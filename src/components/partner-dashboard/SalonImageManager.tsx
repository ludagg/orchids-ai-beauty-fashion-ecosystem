"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

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

  const handleDeleteClick = (imageId: string) => {
    setImageToDelete(imageId);
    setIsDeleteDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/salons/${salonId}/images/${imageToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setImages(images.filter((img) => img.id !== imageToDelete));
      toast.success("Image deleted");
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]" aria-label="Loading gallery images">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(img.id)}
                    aria-label={`Delete image${img.caption ? `: ${img.caption}` : ""}`}
                    className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete image</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-2 md:col-span-4">
            <Empty className="border-2 border-dashed py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>No images yet</EmptyTitle>
                <EmptyDescription>
                  Add image URLs below to display your salon's gallery to customers.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
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
            {adding ? (
              <>
                <Spinner className="mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add Image
              </>
            )}
        </Button>
      </form>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from your salon's gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner className="mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
