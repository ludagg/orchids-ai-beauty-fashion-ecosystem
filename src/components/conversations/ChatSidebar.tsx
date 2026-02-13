"use client";

import { Search, MoreVertical } from "lucide-react";
import Link from "next/link";
import { chats } from "@/app/app/conversations/data";

interface ChatSidebarProps {
  selectedId?: number | string;
}

export default function ChatSidebar({ selectedId }: ChatSidebarProps) {
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
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/app/conversations/${chat.id}`}
            className={`w-full p-4 flex gap-4 transition-all border-b border-muted hover:bg-muted/50 ${
              Number(selectedId) === chat.id ? "bg-muted border-l-4 border-l-primary" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
              </div>
              {chat.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-foreground truncate">{chat.name}</h3>
                <span className="text-[10px] text-muted-foreground font-bold">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unread > 0 ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                {chat.lastMessage}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                  chat.type === 'Business' ? 'bg-blue-500/10 text-blue-500' :
                  chat.type === 'Creator' ? 'bg-rose-500/10 text-rose-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {chat.type}
                </span>
                {chat.unread > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
