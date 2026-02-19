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
  ShoppingBag,
  X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

export default function AIStylistSheet() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
        }
    } catch (error) {
        console.error("Chat error", error);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
        </button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "w-full sm:max-w-md md:max-w-lg p-0 border-l border-border bg-background flex flex-col h-full",
          isMobile && "h-[85vh] rounded-t-[20px] border-t border-l-0"
        )}
      >
        <SheetHeader className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <SheetTitle className="text-lg font-bold">AI Stylist</SheetTitle>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xs text-muted-foreground font-medium">Online</p>
                    </div>
                </div>
            </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col relative">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex gap-2 max-w-[85%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                                msg.type === "user"
                                ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white"
                                : "bg-card border border-border text-violet-600 dark:text-violet-400"
                            }`}>
                                {msg.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className="space-y-1 min-w-0">
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                                    msg.type === "user"
                                    ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
                                    : "bg-card text-foreground border-border rounded-tl-sm"
                                }`}>
                                    {msg.content}
                                </div>

                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {msg.products.map((product: any) => (
                                            <Link href={`/app/marketplace/${product.id}`} key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all group block">
                                                <div className="aspect-[3/4] bg-muted relative">
                                                    <img src={product.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="p-2">
                                                    <p className="font-bold text-xs truncate mb-0.5">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                <p className={`text-[10px] text-muted-foreground/60 ${msg.type === "user" ? "text-right" : ""}`}>
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
                        className="flex justify-start pl-10"
                    >
                        <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 bg-background border-t border-border mt-auto sticky bottom-0 z-10">
                <div className="relative flex items-center gap-2">
                    <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors shrink-0">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="w-full pl-4 pr-12 py-3 rounded-full bg-secondary/50 border-transparent focus:bg-background focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:bg-transparent disabled:text-muted-foreground transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
