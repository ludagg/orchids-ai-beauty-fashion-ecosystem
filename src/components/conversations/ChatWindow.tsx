"use client";

import { useState, useEffect, useRef } from "react";
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
  User,
  ShoppingBag,
  Star,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { format } from "date-fns";

interface ChatWindowProps {
  chatId: number | string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  otherParty: {
    id: string;
    name: string;
    image: string | null;
    type: string;
  };
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchData() {
      if (!chatId || !session?.user) return;
      try {
        const [convRes, msgsRes] = await Promise.all([
          fetch(`/api/conversations/${chatId}`),
          fetch(`/api/conversations/${chatId}/messages`)
        ]);

        if (convRes.ok) {
          setConversation(await convRes.json());
        }

        if (msgsRes.ok) {
          setMessages(await msgsRes.json());
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    }

    fetchData();

    // Poll for new messages every 5s
    const interval = setInterval(async () => {
        if (!chatId) return;
        const msgsRes = await fetch(`/api/conversations/${chatId}/messages`);
        if (msgsRes.ok) {
            const newMessages = await msgsRes.json();
            // Only update if length changed to avoid re-renders or scroll jumps if not needed
            // Actually, comparing JSON string is easier for deep equality in this simple case
            setMessages(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(newMessages)) {
                    return newMessages;
                }
                return prev;
            });
        }
    }, 5000);

    return () => clearInterval(interval);
  }, [chatId, session]);

  // Scroll to bottom when messages change
  useEffect(() => {
      scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session?.user) return;

    const optimisticMsg: Message = {
      id: Date.now().toString(), // Temp ID
      content: newMessage,
      senderId: session.user.id,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages([...messages, optimisticMsg]);
    setNewMessage("");

    try {
        const res = await fetch(`/api/conversations/${chatId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: optimisticMsg.content })
        });

        if (res.ok) {
            // Re-fetch to get real ID and server timestamp
            const msgsRes = await fetch(`/api/conversations/${chatId}/messages`);
            if (msgsRes.ok) {
                setMessages(await msgsRes.json());
            }
        } else {
            // Handle error (maybe toast)
            console.error("Failed to send message");
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      );
  }

  if (!conversation) {
      return <div className="flex items-center justify-center h-full">Chat not found</div>;
  }

  return (
    <div className="flex h-full w-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background min-w-0">
            {/* Header */}
            <header className="h-20 px-6 border-b border-border bg-card flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <Link
                  href="/app/conversations"
                  className="lg:hidden p-2 -ml-2 text-foreground"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-border bg-secondary">
                    <img
                        src={conversation.otherParty.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop"}
                        alt={conversation.otherParty.name}
                        className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online status placeholder */}
                   <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">{conversation.otherParty.name}</h2>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    Online
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

              {messages.map((msg, index) => {
                const isMe = msg.senderId === session?.user?.id;
                return (
                    <div
                    key={msg.id || index}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                    <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div
                        className={`p-4 rounded-[24px] text-sm shadow-sm ${
                            isMe
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-card border border-border text-foreground rounded-tl-none"
                        }`}
                        >
                        {msg.content}
                        </div>
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground ${isMe ? 'flex-row-reverse' : ''}`}>
                        {format(new Date(msg.createdAt), "h:mm a")}
                        {isMe && (
                            msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3" />
                        )}
                        </div>
                    </div>
                    </div>
                );
              })}
              <div ref={messagesEndRef} />
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

        {/* Info Sidebar - Desktop Only */}
        <aside className="hidden xl:flex w-80 border-l border-border flex-col bg-card">
          <div className="p-8 text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-[40px] overflow-hidden shadow-2xl border-4 border-muted bg-secondary">
              <img
                src={conversation.otherParty.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop"}
                alt={conversation.otherParty.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{conversation.otherParty.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{conversation.otherParty.type}</p>
            </div>
            <div className="flex justify-center gap-3">
              <button className="p-3 rounded-2xl border border-border hover:bg-muted transition-all">
                <User className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-3 rounded-2xl border border-border hover:bg-muted transition-all">
                <ShoppingBag className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-3 rounded-2xl border border-border hover:bg-muted transition-all">
                <Star className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 border-t border-border space-y-8 no-scrollbar">
            <section>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Shared Media</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden border border-border">
                    <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop&q=${i}`} alt="media" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Settings</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all group">
                  <span className="text-sm font-bold">Block Business</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <span className="text-sm font-bold">Mute Notifications</span>
                  <div className="w-8 h-4 bg-muted-foreground/30 rounded-full relative">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-card rounded-full" />
                  </div>
                </button>
              </div>
            </section>
          </div>
        </aside>
    </div>
  );
}
