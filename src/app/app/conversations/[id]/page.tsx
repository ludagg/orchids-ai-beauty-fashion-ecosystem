"use client";

import { useParams } from "next/navigation";
import ChatWindow from "../components/ChatWindow";
import ChatInfo from "../components/ChatInfo";
import { chats } from "../data";

export default function ConversationPage() {
  const params = useParams();
  const id = Number(params.id);
  const chat = chats.find((c) => c.id === id);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full h-full overflow-hidden">
      <ChatWindow key={chat.id} chat={chat} />
      <ChatInfo key={`info-${chat.id}`} chat={chat} />
    </div>
  );
}
