"use client";

import ChatSidebar from "@/components/conversations/ChatSidebar";
import ConversationPlaceholder from "@/components/conversations/ConversationPlaceholder";

export default function ConversationsPage() {
  return (
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-background flex overflow-hidden">
      {/* Chats Sidebar - Always visible on mobile in this route, left side on desktop */}
      <aside className="w-full lg:w-96 border-r border-border flex flex-col bg-card">
        <ChatSidebar />
      </aside>

      {/* Placeholder - Hidden on mobile, visible on desktop */}
      <main className="hidden lg:flex flex-1 flex-col bg-background">
        <ConversationPlaceholder />
      </main>
    </div>
  );
}
