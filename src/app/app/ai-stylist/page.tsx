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

const initialMessages = [
  {
    id: 1,
    type: "bot",
    content: "Hi JD! I'm your Priisme AI Stylist. I've analyzed your recent browsing and noticed you're interested in minimalist summer wear. Would you like some personalized recommendations for your upcoming weekend trip?",
    timestamp: "10:00 AM"
  }
];

const stylePersonalities = [
  { name: "Minimalist", icon: Layout, active: true },
  { name: "Streetwear", icon: Zap, active: false },
  { name: "Traditional", icon: Palette, active: false }
];

export default function AIStylistPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content: "That sounds like a great plan! For a weekend in Goa, I recommend lightweight linen shirts paired with tailored chino shorts. I've found a few pieces from Studio Épure that would fit your style perfectly. Should I show them to you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
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
                  : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
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
                  <div className="space-y-1">
                    <div className={`p-4 rounded-[24px] text-[15px] leading-relaxed shadow-sm border ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground border-primary rounded-tr-none"
                        : "bg-card text-foreground border-border rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest ${msg.type === "user" ? "text-right" : ""}`}>
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
            <p className="text-center text-[11px] text-[#c4c4c4] mt-4 font-bold uppercase tracking-[0.2em]">
              Powered by Priisme Style Engine v2.0
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
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-3 relative shadow-md border border-border">
                  <img
                    src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&sig=${i}`}
                    alt="Suggestion"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingBag className="w-4 h-4 text-foreground" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-foreground truncate">Linen Utility Shirt</h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Studio Épure • ₹2,899</p>
              </motion.div>
            ))}

            <div className="p-5 rounded-3xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/30 space-y-3">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Style Score</span>
              </div>
              <p className="text-sm text-violet-900 dark:text-violet-200 leading-relaxed font-medium">
                These pieces match your "Minimalist" profile with <span className="font-bold">94% accuracy</span>.
              </p>
              <button className="w-full py-2.5 rounded-xl bg-card text-violet-700 dark:text-violet-400 text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5" />
                Regenerate Picks
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
