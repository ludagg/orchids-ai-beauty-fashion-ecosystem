"use client";

import {
  Phone,
  Video,
  Info,
  Send,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { initialMessages } from "../data";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
};

export default function ChatWindow({ chat }: { chat: Chat }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full overflow-hidden">
      {/* Chat Header */}
      <header className="h-20 px-6 border-b border-border bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/app/conversations"
            className="lg:hidden p-2 -ml-2 text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-border">
              <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
            </div>
            {chat.online && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-foreground">{chat.name}</h2>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              {chat.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-card border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest shadow-sm">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] space-y-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-[24px] text-sm shadow-sm ${
                  msg.sender === 'me'
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border text-foreground rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                {msg.time}
                {msg.sender === 'me' && (
                  msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-card border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full pl-4 pr-12 py-4 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/10"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
