"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Send,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Circle,
  ArrowLeft,
  ShoppingBag,
  User,
  Star
} from "lucide-react";
import { useState } from "react";

const chats = [
  {
    id: 1,
    name: "Studio Épure",
    avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
    lastMessage: "Your order has been shipped! 📦",
    time: "10:30 AM",
    unread: 2,
    online: true,
    type: "Business"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "I loved the minimalist dress you picked!",
    time: "Yesterday",
    unread: 0,
    online: false,
    type: "Creator"
  },
  {
    id: 3,
    name: "Aura Luxury Spa",
    avatar: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=100&h=100&fit=crop",
    lastMessage: "Confirming your appointment for Sunday.",
    time: "Tue",
    unread: 0,
    online: true,
    type: "Salon"
  }
];

const initialMessages = [
  { id: 1, text: "Hi! I had a question about the Summer Minimalist Dress.", sender: "me", time: "10:00 AM", status: "read" },
  { id: 2, text: "Hello! We'd be happy to help. What would you like to know?", sender: "them", time: "10:05 AM", status: "read" },
  { id: 3, text: "Is the fabric stretchable?", sender: "me", time: "10:10 AM", status: "read" },
  { id: 4, text: "It's 100% organic cotton, so it has a natural give but isn't highly stretchable. It's designed for a relaxed fit though!", sender: "them", time: "10:15 AM", status: "read" },
  { id: 5, text: "Your order has been shipped! 📦", sender: "them", time: "10:30 AM", status: "sent" },
];

export default function ConversationsPage() {
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false); // In a real app, use a hook

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
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      {/* Chats Sidebar */}
      <aside className={`w-full lg:w-96 border-r border-[#e5e5e5] flex flex-col bg-white ${selectedChat && 'hidden lg:flex'}`}>
        <div className="p-6 border-b border-[#e5e5e5] space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Messages</h1>
            <button className="p-2 rounded-xl bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e5e5e5] transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex gap-4 transition-all border-b border-[#f5f5f5] hover:bg-[#fafafa] ${
                selectedChat?.id === chat.id ? "bg-[#f5f5f5] border-l-4 border-l-[#1a1a1a]" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[#1a1a1a] truncate">{chat.name}</h3>
                  <span className="text-[10px] text-[#c4c4c4] font-bold">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? "text-[#1a1a1a] font-bold" : "text-[#6b6b6b]"}`}>
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    chat.type === 'Business' ? 'bg-blue-50 text-blue-600' :
                    chat.type === 'Creator' ? 'bg-rose-50 text-rose-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {chat.type}
                  </span>
                  {chat.unread > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-[#1a1a1a] text-white text-[10px] font-bold flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className={`flex-1 flex flex-col bg-[#fcfcfc] ${!selectedChat && 'hidden lg:flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <header className="h-20 px-6 border-b border-[#e5e5e5] bg-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedChat(null as any)}
                  className="lg:hidden p-2 -ml-2 text-[#1a1a1a]"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-[#e5e5e5]">
                    <img src={selectedChat.avatar} alt={selectedChat.name} className="w-full h-full object-cover" />
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1a1a]">{selectedChat.name}</h2>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    {selectedChat.online ? 'Online' : 'Offline'}
                  </p>
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
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              <div className="flex justify-center">
                <span className="px-4 py-1.5 rounded-full bg-white border border-[#e5e5e5] text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest shadow-sm">
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
                          ? "bg-[#1a1a1a] text-white rounded-tr-none"
                          : "bg-white border border-[#e5e5e5] text-[#1a1a1a] rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold text-[#c4c4c4] ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
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
            <footer className="p-6 bg-white border-t border-[#e5e5e5]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
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
                    className="w-full pl-4 pr-12 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] transition-all outline-none text-sm"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 rounded-2xl bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#333] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-[40px] bg-white border border-[#e5e5e5] flex items-center justify-center shadow-xl">
              <MessageCircle className="w-10 h-10 text-[#c4c4c4]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Your Inbox</h2>
              <p className="text-[#6b6b6b] mt-2 max-w-xs">
                Select a conversation to start chatting with designers, creators, or salons.
              </p>
            </div>
            <button className="px-8 py-3.5 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10">
              New Message
            </button>
          </div>
        )}
      </main>

      {/* Info Sidebar - Desktop Only */}
      {selectedChat && (
        <aside className="hidden xl:flex w-80 border-l border-[#e5e5e5] flex-col bg-white">
          <div className="p-8 text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-[40px] overflow-hidden shadow-2xl border-4 border-[#f5f5f5]">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">{selectedChat.name}</h3>
              <p className="text-sm text-[#6b6b6b] mt-1">{selectedChat.type}</p>
            </div>
            <div className="flex justify-center gap-3">
              <button className="p-3 rounded-2xl border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all">
                <User className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-2xl border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-2xl border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all">
                <Star className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 border-t border-[#e5e5e5] space-y-8">
            <section>
              <h4 className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em] mb-4">Shared Media</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-[#f5f5f5] overflow-hidden border border-[#e5e5e5]">
                    <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop&q=${i}`} alt="media" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em] mb-4">Settings</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 text-rose-600 transition-all group">
                  <span className="text-sm font-bold">Block Business</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b] transition-all">
                  <span className="text-sm font-bold">Mute Notifications</span>
                  <div className="w-8 h-4 bg-[#e5e5e5] rounded-full relative">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
                  </div>
                </button>
              </div>
            </section>
          </div>
        </aside>
      )}
    </div>
  );
}
