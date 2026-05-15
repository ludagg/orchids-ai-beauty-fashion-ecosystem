"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* [Jules - Standardize Conversation Inbox Empty State with Empty UI primitives and branded decorations] */
export default function ConversationPlaceholder() {
  return (
    <div className="flex-1 relative overflow-hidden h-full bg-background flex flex-col items-center justify-center">
      {/* Branded Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <Empty className="border-none bg-transparent relative z-10">
        <EmptyHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <EmptyMedia variant="icon" className="w-20 h-20 rounded-[32px] bg-card border border-border shadow-xl">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </EmptyMedia>
          </motion.div>
          <EmptyTitle className="text-2xl font-bold">Your Inbox</EmptyTitle>
          <EmptyDescription className="max-w-xs mx-auto">
            Select a conversation to start chatting with designers, creators, or salons.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-95"
                aria-label="New Message"
              >
                New Message
              </button>
            </TooltipTrigger>
            <TooltipContent>Start a new chat</TooltipContent>
          </Tooltip>
        </EmptyContent>
      </Empty>
    </div>
  );
}
