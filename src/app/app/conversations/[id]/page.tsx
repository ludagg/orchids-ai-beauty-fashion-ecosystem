"use client";

import { use } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import { chats } from "../data";
import { notFound } from "next/navigation";

export default function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const chatId = parseInt(id, 10);
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-background flex overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <ConversationList selectedId={chatId} className="hidden lg:flex lg:w-96" />

      {/* Chat Window - Visible on mobile and desktop */}
      <ChatWindow chat={chat} className="w-full lg:flex-1" />
    </div>
  );
}
