"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Camera,
  Image as ImageIcon,
  Zap,
  Layout,
  Palette,
  CheckCircle2,
  RefreshCcw,
  ShoppingBag
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
    id: number;
    type: "user" | "bot";
    content: string;
    timestamp: string;
    products?: any[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    content: "Hi there! I'm your AI Stylist. Tell me what you're looking for! For example: 'I need a red dress for a party' or 'Show me summer sneakers'.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const stylePersonalities = [
  { name: "Minimalist", icon: Layout, active: true },
  { name: "Streetwear", icon: Zap, active: false },
  { name: "Traditional", icon: Palette, active: false }
];

export default function AIStylistPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarProducts, setSidebarProducts] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
        const res = await fetch('/api/ai-stylist/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg.content })
        });

        if (res.ok) {
            const data = await res.json();
            const botMsg: Message = {
                id: Date.now() + 1,
                type: "bot",
                content: data.message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                products: data.products
            };
            setMessages(prev => [...prev, botMsg]);

            if (data.products && data.products.length > 0) {
                setSidebarProducts(data.products);
            }
        }
    } catch (error) {
        console.error("Chat error", error);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="p-6 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm shadow-violet-100/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-foreground">AI Stylist</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Always Online</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {stylePersonalities.map(style => (
            <button
              key={style.name}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                style.active
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                  : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative flex">
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth no-scrollbar"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                    msg.type === "user"
                      ? "bg-gradient-to-tr from-rose-500 to-violet-500 text-white"
                      : "bg-card border border-border text-violet-600 dark:text-violet-400"
                  }`}>
                    {msg.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <div className={`p-4 rounded-[24px] text-[15px] leading-relaxed shadow-sm border inline-block ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground border-primary rounded-tr-none"
                        : "bg-card text-foreground border-border rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>

                    {msg.products && msg.products.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 max-w-md">
                            {msg.products.map((product: any) => (
                                <Link href={`/app/marketplace/${product.id}`} key={product.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all group block">
                                    <div className="aspect-[3/4] bg-muted relative">
                                         <img src={product.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-3">
                                        <p className="font-bold text-xs truncate mb-1">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <p className={`text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest ${msg.type === "user" ? "text-right" : ""}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-card border border-border p-4 rounded-[24px] rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-transparent">
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Ask me anything about your style..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full pl-28 pr-16 py-5 rounded-[28px] bg-card border border-border focus:border-violet-500 shadow-xl shadow-black/[0.03] transition-all outline-none text-base text-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:bg-muted disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground/50 mt-4 font-bold uppercase tracking-[0.2em]">
              Powered by Rare Style Engine v2.0
            </p>
          </div>
        </main>

        {/* Desktop Recommendations Sidebar */}
        <aside className="hidden xl:flex w-80 border-l border-border bg-card flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Live Suggestions
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {sidebarProducts.length > 0 ? (
               sidebarProducts.map((product) => (
                <motion.div
                    key={`sidebar-${product.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group cursor-pointer"
                >
                    <Link href={`/app/marketplace/${product.id}`} className="block">
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-3 relative shadow-md border border-border">
                        <img
                        src={product.images?.[0]}
                        alt="Suggestion"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="w-4 h-4 text-foreground" />
                        </div>
                    </div>
                    <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">{(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </Link>
                </motion.div>
                ))
            ) : (
                <div className="p-5 rounded-3xl bg-secondary/50 border border-border space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        Start chatting to see personalized recommendations here!
                    </p>
                </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
