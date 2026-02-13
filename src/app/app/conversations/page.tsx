"use client";

import ConversationList from "./components/ConversationList";
import EmptyState from "./components/EmptyState";

export default function ConversationsPage() {
  return (
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-background flex overflow-hidden">
      {/* Chats Sidebar - Always visible on mobile for root route, visible on desktop */}
      <ConversationList className="w-full lg:w-96" />

      {/* Empty State - Hidden on mobile for root route, visible on desktop */}
      <div className="hidden lg:flex flex-1">
        <EmptyState />
      </div>
    </div>
  );
}
