"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon,
  X,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Upload, 2: Details, 3: Success
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: ""
  });

  const onDropVideo = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setVideoFile(acceptedFiles[0]);
      setStep(2);
    }
  }, []);

  const onDropThumbnail = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setThumbnailFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDrop: onDropVideo,
    accept: { 'video/*': [] },
    maxFiles: 1
  });

  const { getRootProps: getThumbRootProps, getInputProps: getThumbInputProps, isDragActive: isThumbDragActive } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setStep(3);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-6 pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-3xl font-bold">Upload Complete!</h2>
        <p className="text-muted-foreground">
          Your video "{formData.title}" has been successfully uploaded and is now processing.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => {
            setStep(1);
            setVideoFile(null);
            setThumbnailFile(null);
            setFormData({ title: "", description: "", tags: "" });
            setUploadProgress(0);
          }}>
            Upload Another
          </Button>
          <Link href="/app/creator-studio">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Upload Video</h1>
        <p className="text-muted-foreground">Share your creativity with the world.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div
              {...getVideoRootProps()}
              className={`border-2 border-dashed rounded-3xl h-96 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isVideoDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <input {...getVideoInputProps()} />
              <div className="p-6 bg-secondary rounded-full mb-6">
                <UploadIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drag and drop video files to upload</h3>
              <p className="text-muted-foreground mb-6">Your videos will be private until you publish them.</p>
              <Button>Select Files</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left: Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (required)</Label>
                  <Input
                    id="title"
                    placeholder="Add a title that describes your video"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell viewers about your video"
                    className="min-h-[150px]"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <div
                    {...getThumbRootProps()}
                    className={`border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isThumbDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input {...getThumbInputProps()} />
                    {thumbnailFile ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-secondary/50 overflow-hidden rounded-lg">
                        <img
                          src={URL.createObjectURL(thumbnailFile)}
                          alt="Thumbnail preview"
                          className="h-full w-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm font-medium bg-background/80 px-3 py-1 rounded-full">Change Thumbnail</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-sm">Upload thumbnail</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Preview & File Info */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-4 space-y-4">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white/50">
                     <Film className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Filename</span>
                      <span className="font-medium truncate max-w-[150px]">{videoFile?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">{(videoFile?.size ? (videoFile.size / (1024 * 1024)).toFixed(2) : 0)} MB</span>
                    </div>
                  </div>

                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleUpload}
                      disabled={!formData.title}
                    >
                      {formData.title ? "Publish Video" : "Enter Title to Publish"}
                    </Button>
                  )}

                  <Button variant="ghost" className="w-full" onClick={() => setStep(1)} disabled={isUploading}>
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
