"use client";

import { MessageCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConversationPlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden h-full bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#262626_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1.2 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]"
      />

      <Empty className="relative z-10 bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl max-w-md w-full p-12 rounded-[40px]">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/10 text-primary w-20 h-20 rounded-[28px] mb-6 flex items-center justify-center">
            <MessageCircle className="w-10 h-10" />
          </EmptyMedia>
          <EmptyTitle className="text-3xl font-bold tracking-tight">Your Inbox</EmptyTitle>
          <EmptyDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
            Select a conversation to start chatting with designers, creators, or salons.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="mt-8 w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-14 font-bold shadow-xl shadow-primary/20 group transition-all"
                aria-label="Start a new conversation"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                New Message
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="font-medium">
              Start a new chat
            </TooltipContent>
          </Tooltip>
        </EmptyContent>
      </Empty>
    </div>
  );
}
