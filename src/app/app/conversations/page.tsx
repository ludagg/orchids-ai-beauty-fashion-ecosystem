"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Check,
  CheckCheck,
  ArrowLeft,
  Circle
} from "lucide-react";
import { useState } from "react";

const chats = [
  {
    id: 1,
    name: "Ananya Sharma",
    lastMessage: "The blue linen set is back in stock!",
    time: "10:30 AM",
    unread: 2,
    online: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Aura Luxury Spa",
    lastMessage: "Your appointment is confirmed for tomorrow.",
    time: "Yesterday",
    unread: 0,
    online: false,
    avatar: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Rahul Mehra",
    lastMessage: "Did you check out the new tech jackets?",
    time: "Wed",
    unread: 0,
    online: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  }
];

const messages = [
  { id: 1, text: "Hi! I saw your stream earlier.", sender: "me", time: "10:00 AM" },
  { id: 2, text: "The Eco-Linen collection looks amazing!", sender: "me", time: "10:01 AM" },
  { id: 3, text: "Thanks! So glad you liked it. 😊", sender: "them", time: "10:15 AM" },
  { id: 4, text: "Is the blue set coming back soon?", sender: "me", time: "10:20 AM" },
  { id: 5, text: "The blue linen set is back in stock!", sender: "them", time: "10:30 AM" }
];

export default function ConversationsPage() {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      {/* Sidebar - Chat List */}
      <aside className={`w-full lg:w-96 border-r border-[#e5e5e5] flex flex-col ${activeChat && "hidden lg:flex"}`}>
        <div className="p-6 border-b border-[#e5e5e5]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-[#f5f5f5] border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-[#e5e5e5] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full p-4 flex gap-4 transition-all border-b border-[#f5f5f5] ${
                activeChat?.id === chat.id ? "bg-blue-50/50" : "hover:bg-[#fcfcfc]"
              }`}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#f5f5f5]">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[#1a1a1a] truncate">{chat.name}</h3>
                  <span className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${chat.unread > 0 ? "text-[#1a1a1a] font-bold" : "text-[#6b6b6b]"}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col bg-[#fcfcfc] ${!activeChat && "hidden lg:flex"}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="px-6 py-4 bg-white border-b border-[#e5e5e5] flex items-center justify-between shadow-sm relative z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null as any)} className="lg:hidden p-2 -ml-2 hover:bg-[#f5f5f5] rounded-xl">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f5f5f5]">
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a1a] text-sm">{activeChat.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${activeChat.online ? "bg-emerald-500" : "bg-[#c4c4c4]"}`} />
                      <span className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">
                        {activeChat.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              <div className="text-center">
                <span className="px-3 py-1 rounded-full bg-[#f5f5f5] text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">
                  Today
                </span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] space-y-1`}>
                    <div className={`px-5 py-3 rounded-[24px] text-sm shadow-sm ${
                      msg.sender === "me"
                        ? "bg-[#1a1a1a] text-white rounded-br-none"
                        : "bg-white text-[#1a1a1a] rounded-bl-none border border-[#e5e5e5]"
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1.5 px-1 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">{msg.time}</span>
                      {msg.sender === "me" && <CheckCheck className="w-3 h-3 text-blue-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <footer className="p-6 bg-white border-t border-[#e5e5e5]">
              <div className="max-w-4xl mx-auto flex items-end gap-3">
                <div className="flex items-center gap-1 pb-1">
                  <button className="p-2 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    rows={1}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full pl-6 pr-12 py-3.5 bg-[#f5f5f5] border-transparent rounded-[24px] text-sm outline-none focus:bg-white focus:border-[#e5e5e5] transition-all resize-none max-h-32"
                  />
                  <button className="absolute right-2 bottom-1.5 p-2 rounded-xl text-[#6b6b6b] hover:text-blue-600 transition-all">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button className="p-3.5 rounded-full bg-[#1a1a1a] text-white shadow-xl shadow-black/10 hover:bg-[#333] transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-[40px] bg-white border border-[#e5e5e5] flex items-center justify-center text-[#c4c4c4] shadow-xl shadow-black/[0.02]">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Select a conversation</h2>
              <p className="text-[#6b6b6b] max-w-sm font-medium">Choose a chat from the left sidebar to start messaging with creators and salons.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
