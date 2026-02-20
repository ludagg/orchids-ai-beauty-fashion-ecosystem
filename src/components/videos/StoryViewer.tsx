"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define types based on what we expect from the API
interface User {
  id: string;
  name: string;
  image: string | null;
}

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string; // ISO date string
  viewed?: boolean;
}

interface UserStories {
  user: User;
  stories: Story[];
}

interface StoryViewerProps {
  initialUserIndex: number;
  userStories: UserStories[];
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function StoryViewer({ initialUserIndex, userStories, onClose }: StoryViewerProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentUser = userStories[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  // Ref for video element to handle play/pause
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle auto-progress
  useEffect(() => {
    if (!currentStory || isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      // If video, we let the video 'ended' event handle progression
      if (currentStory.mediaType === 'video') {
         if (videoRef.current) {
             const duration = videoRef.current.duration || 1;
             const currentTime = videoRef.current.currentTime;
             setProgress((currentTime / duration) * 100);
         }
         return;
      }

      // For images, use timer
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / STORY_DURATION) * 100;

      if (newProgress >= 100) {
        goToNextStory();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentStory, currentUserIndex, currentStoryIndex, isPaused]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
    if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
    }
  }, [currentStoryIndex, currentUserIndex]);

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      // Move to next user
      if (currentUserIndex < userStories.length - 1) {
        setCurrentUserIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
      } else {
        onClose(); // End of all stories
      }
    }
  }, [currentStoryIndex, currentUser.stories.length, currentUserIndex, userStories.length, onClose]);

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      // Move to prev user
      if (currentUserIndex > 0) {
        setCurrentUserIndex(prev => prev - 1);
        // Go to last story of previous user
        setCurrentStoryIndex(userStories[currentUserIndex - 1].stories.length - 1);
      } else {
        // Start of all stories, maybe close or stay?
        setCurrentStoryIndex(0);
      }
    }
  }, [currentStoryIndex, currentUserIndex, userStories]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNextStory();
      if (e.key === 'ArrowLeft') goToPrevStory();
      if (e.key === ' ') setIsPaused(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNextStory, goToPrevStory]);

  if (!currentUser || !currentStory) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
    >
        {/* Desktop close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white p-2 hover:bg-white/10 rounded-full hidden md:block">
            <X className="w-8 h-8" />
        </button>

        {/* Previous Button (Desktop) */}
        <button
            onClick={goToPrevStory}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-2"
            disabled={currentUserIndex === 0 && currentStoryIndex === 0}
        >
            <ChevronLeft className="w-12 h-12" />
        </button>

         {/* Next Button (Desktop) */}
         <button
            onClick={goToNextStory}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-2"
        >
            <ChevronRight className="w-12 h-12" />
        </button>

      {/* Main Container - Mobile Fullscreen, Desktop Aspect Ratio */}
      <div className="relative w-full h-full md:w-[400px] md:h-[80vh] md:rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">

        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {currentUser.stories.map((story, idx) => (
                <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{
                            width: idx < currentStoryIndex ? '100%' :
                                   idx === currentStoryIndex ? `${progress}%` : '0%'
                        }}
                    />
                </div>
            ))}
        </div>

        {/* User Info Header */}
        <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2">
            <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-white/20">
                    <AvatarImage src={currentUser.user.image || undefined} />
                    <AvatarFallback>{currentUser.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-white text-sm font-medium drop-shadow-md">
                    {currentUser.user.name}
                    <span className="ml-2 text-white/60 text-xs font-normal">
                         {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Mobile Close Button */}
            <button onClick={onClose} className="md:hidden text-white drop-shadow-md">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Touch Navigation Zones */}
        <div className="absolute inset-0 z-10 flex">
            <div className="w-1/3 h-full" onClick={goToPrevStory} />
            <div className="w-1/3 h-full" onClick={() => setIsPaused(p => !p)} />
            <div className="w-1/3 h-full" onClick={goToNextStory} />
        </div>

        {/* Content */}
        <div className="w-full h-full bg-black flex items-center justify-center">
            {currentStory.mediaType === 'video' ? (
                <video
                    ref={videoRef}
                    src={currentStory.mediaUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    onEnded={goToNextStory}
                    onPause={() => setIsPaused(true)}
                    onPlay={() => setIsPaused(false)}
                />
            ) : (
                <div className="relative w-full h-full">
                    <Image
                        src={currentStory.mediaUrl}
                        alt="Story"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
        </div>

        {/* Footer Actions (Optional) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/60 to-transparent flex items-center gap-4">
             <div className="flex-1 relative">
                 <input
                    type="text"
                    placeholder="Send a message..."
                    className="w-full bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:border-white text-sm backdrop-blur-sm"
                 />
             </div>
             <button className="text-white hover:scale-110 transition-transform">
                 <Heart className="w-6 h-6" />
             </button>
             <button className="text-white hover:scale-110 transition-transform">
                 <Send className="w-6 h-6" />
             </button>
        </div>

      </div>
    </motion.div>
  );
}
