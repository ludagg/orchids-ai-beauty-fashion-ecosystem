"use client";

import { use } from "react";
import ChatSidebar from "@/components/conversations/ChatSidebar";
import ChatWindow from "@/components/conversations/ChatWindow";

export default function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-background flex overflow-hidden">
      {/* Chats Sidebar - Hidden on mobile in this route, visible on desktop */}
      <aside className="hidden lg:flex w-96 border-r border-border flex-col bg-card">
        <ChatSidebar selectedId={id} />
      </aside>

      {/* Chat Window - Always visible here, but full screen on mobile */}
      <main className="flex-1 flex flex-col bg-background w-full">
        <ChatWindow chatId={id} />
      </main>
    </div>
  );
}
