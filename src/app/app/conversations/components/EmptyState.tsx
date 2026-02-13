"use client";

import { MessageCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-background">
      <div className="w-24 h-24 rounded-[40px] bg-card border border-border flex items-center justify-center shadow-xl">
        <MessageCircle className="w-10 h-10 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Your Inbox</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Select a conversation to start chatting with designers, creators, or salons.
        </p>
      </div>
      <button className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/10">
        New Message
      </button>
    </div>
  );
}
