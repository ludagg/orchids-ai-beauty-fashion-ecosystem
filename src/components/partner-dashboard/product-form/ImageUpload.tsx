"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
    value: string[]; // Array of URLs
    onChange: (value: string[]) => void;
    maxFiles?: number;
    salonId: string;
    productId: string; // Draft ID
    type?: "main" | "gallery" | "variant" | "video";
    variantColor?: string;
}

export function ImageUpload({ value = [], onChange, maxFiles = 1, salonId, productId, type = "gallery", variantColor }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!salonId || !productId) {
            toast.error("Missing salon or product ID");
            return;
        }

        if (value.length + acceptedFiles.length > maxFiles) {
            toast.error(`Max ${maxFiles} files allowed`);
            return;
        }

        setUploading(true);
        setProgress(0);

        const newUrls: string[] = [];
        let completed = 0;

        try {
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("salonId", salonId);
                formData.append("productId", productId);
                formData.append("type", type);
                if (variantColor) formData.append("variantColor", variantColor);

                const res = await fetch("/api/upload/product", {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) {
                    throw new Error("Upload failed");
                }

                const data = await res.json();
                newUrls.push(data.url);
                completed++;
                setProgress((completed / acceptedFiles.length) * 100);
            }

            onChange([...value, ...newUrls]);
            toast.success("Upload complete");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [value, maxFiles, onChange, salonId, productId, type, variantColor]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: type === 'video'
            ? { 'video/*': ['.mp4', '.mov'] }
            : { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: maxFiles - value.length,
        disabled: uploading || value.length >= maxFiles
    })

    const removeImage = (url: string) => {
        onChange(value.filter(v => v !== url));
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary"}
                    ${(uploading || value.length >= maxFiles) ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 bg-muted rounded-full">
                        <UploadCloud className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {type === 'video' ? 'MP4 or MOV (max 100MB)' : 'JPG, PNG or WEBP (max 5MB)'}
                    </div>
                </div>
            </div>

            {uploading && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}

            {value.length > 0 && (
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                    {value.map((url, index) => (
                        <div key={url} className="relative aspect-square group rounded-md overflow-hidden border">
                            {type === 'video' ? (
                                <video src={url} className="w-full h-full object-cover" controls />
                            ) : (
                                <Image
                                    src={url}
                                    alt={`Uploaded ${index}`}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(url);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
