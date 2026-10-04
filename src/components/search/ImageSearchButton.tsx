"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageSearchButtonProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function ImageSearchButton({ onSearch, className = "" }: ImageSearchButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }

    // Basic validation
    if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB.");
        return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading("Analyzing image...");

    try {
      // Convert to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]); // Get only the base64 part
          } else {
              reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Image = await base64Promise;

      // Send to API
      const response = await fetch("/api/search/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: file.type
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();

      if (data.keywords && data.keywords.length > 0) {
        const searchQuery = data.keywords.join(" ");
        toast.success("Image analyzed successfully!", { id: toastId });
        onSearch(searchQuery);
      } else {
         toast.error("Could not identify any relevant items in the image.", { id: toastId });
      }

    } catch (error) {
      console.error("Image search error:", error);
      toast.error("Failed to analyze image. Please try again.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isAnalyzing}
        className={`p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${className}`}
        aria-label="Search by image"
        title="Search by image"
      >
        {isAnalyzing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
}
