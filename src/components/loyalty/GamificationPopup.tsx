"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface GamificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image?: string;
  points?: number;
  type: 'badge' | 'level' | 'reward';
}

export function GamificationPopup({ isOpen, onClose, title, description, image, points, type }: GamificationPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center border-none shadow-xl bg-gradient-to-b from-background to-muted/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Simple CSS/SVG Confetti or background effect */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent opacity-50 animate-pulse" />
        </div>

        <DialogHeader className="pt-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto bg-background p-4 rounded-full shadow-lg mb-4 border-4 border-yellow-400"
          >
            {image ? (
                <img src={image} alt={title} className="w-16 h-16 object-contain" />
            ) : (
                type === 'level' ? <Trophy className="w-12 h-12 text-yellow-500" /> :
                type === 'badge' ? <Star className="w-12 h-12 text-purple-500" /> :
                <Sparkles className="w-12 h-12 text-primary" />
            )}
          </motion.div>

          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 relative z-10">
            {points && points > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-lg shadow-sm"
                >
                    +{points} Glow Points
                </motion.div>
            )}
        </div>

        <DialogFooter className="sm:justify-center pb-4 relative z-10">
          <Button onClick={onClose} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
