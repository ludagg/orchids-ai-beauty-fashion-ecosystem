"use client";

import { Search, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Conversation {
  id: string;
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  otherParty: {
    id: string;
    name: string;
    image: string | null;
    type: string;
  };
  lastMessageAt: string;
}

interface ChatSidebarProps {
  selectedId?: number | string;
}

export default function ChatSidebar({ selectedId }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/conversations');
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();

    // Poll every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter(c =>
    c.otherParty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <button className="p-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
           <div className="flex justify-center p-8">
             <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
           </div>
        ) : filteredConversations.length === 0 ? (
           <div className="p-8 text-center text-muted-foreground">
             <p>No conversations yet.</p>
           </div>
        ) : (
          filteredConversations.map((chat) => (
            <Link
              key={chat.id}
              href={`/app/conversations/${chat.id}`}
              className={`w-full p-4 flex gap-4 transition-all border-b border-muted hover:bg-muted/50 ${
                selectedId === chat.id ? "bg-muted border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-secondary">
                  <img
                    src={chat.otherParty.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop"}
                    alt={chat.otherParty.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online status could be implemented later */}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-foreground truncate">{chat.otherParty.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-bold">
                    {chat.lastMessage ? format(new Date(chat.lastMessage.createdAt), "h:mm a") : ""}
                  </span>
                </div>
                <p className={`text-xs truncate ${chat.unreadCount > 0 ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                  {chat.lastMessage?.content || "Start a conversation"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    chat.otherParty.type === 'Salon' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {chat.otherParty.type}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
