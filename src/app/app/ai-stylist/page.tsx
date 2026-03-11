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
  ThumbsUp,
  ThumbsDown,
  ShoppingBag,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  products?: any[];
  feedback?: "like" | "dislike" | null;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

const STORAGE_KEY = "ai-stylist-conversations";

const stylePersonalities = [
  { name: "Minimalist", icon: Layout, active: true },
  { name: "Streetwear", icon: Zap, active: false },
  { name: "Traditional", icon: Palette, active: false },
];

function createWelcomeMessage(): Message {
  return {
    id: 1,
    type: "bot",
    content:
      "Hi there! I'm your AI Stylist. Tell me what you're looking for! For example: 'I need a red dress for a party' or 'Show me summer sneakers'.",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    feedback: null,
  };
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // ignore
  }
}

export default function AIStylistPage() {
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarProducts, setSidebarProducts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadConversations();
    setConversations(saved);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const saveCurrentConversation = useCallback(
    (msgs: Message[]) => {
      if (msgs.length <= 1) return;
      const convId = currentConvId || `conv-${Date.now()}`;
      if (!currentConvId) setCurrentConvId(convId);

      const firstUserMsg = msgs.find((m) => m.type === "user");
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? "…" : "")
        : "New Conversation";

      const updated: Conversation = {
        id: convId,
        title,
        timestamp: new Date().toISOString(),
        messages: msgs,
      };

      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== convId);
        const next = [updated, ...filtered].slice(0, 20);
        saveConversations(next);
        return next;
      });
    },
    [currentConvId]
  );

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue("");
    setIsTyping(true);

    const streamingId = Date.now() + 1;
    const streamingMsg: Message = {
      id: streamingId,
      type: "bot",
      content: "",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isStreaming: true,
      feedback: null,
    };

    setMessages((prev) => [...prev, streamingMsg]);

    try {
      const res = await fetch("/api/ai-stylist/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (res.ok) {
        const data = await res.json();
        const fullText: string = data.message || "";

        // Simulate streaming effect
        let displayed = "";
        const words = fullText.split(" ");
        for (let i = 0; i < words.length; i++) {
          displayed += (i === 0 ? "" : " ") + words[i];
          const partial = displayed;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamingId
                ? { ...m, content: partial, isStreaming: i < words.length - 1 }
                : m
            )
          );
          await new Promise((r) => setTimeout(r, 30));
        }

        const finalMsg: Message = {
          id: streamingId,
          type: "bot",
          content: fullText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          products: data.products,
          isStreaming: false,
          feedback: null,
        };

        setMessages((prev) => {
          const updated = prev.map((m) => (m.id === streamingId ? finalMsg : m));
          saveCurrentConversation(updated);
          return updated;
        });

        if (data.products && data.products.length > 0) {
          setSidebarProducts(data.products);
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamingId
            ? {
                ...m,
                content: "Sorry, I encountered an error. Please try again.",
                isStreaming: false,
                feedback: null,
              }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = (msgId: number, type: "like" | "dislike") => {
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id !== msgId) return m;
        const newFeedback = m.feedback === type ? null : type;
        return { ...m, feedback: newFeedback };
      });
      saveCurrentConversation(updated);
      return updated;
    });
    toast.success(type === "like" ? "Thanks for the feedback! 💖" : "Got it, I'll do better!");
  };

  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
    setShowHistory(false);
    const lastProds = [...conv.messages].reverse().find((m) => m.products?.length);
    if (lastProds?.products) setSidebarProducts(lastProds.products);
  };

  const deleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== convId);
      saveConversations(next);
      return next;
    });
    if (currentConvId === convId) {
      setMessages([createWelcomeMessage()]);
      setCurrentConvId(null);
    }
  };

  const startNewConversation = () => {
    setMessages([createWelcomeMessage()]);
    setCurrentConvId(null);
    setSidebarProducts([]);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="p-4 sm:p-6 border-b border-border bg-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-foreground">
              AI Stylist
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Always Online
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History toggle on mobile */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={startNewConversation}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-border bg-card text-muted-foreground hover:border-violet-500 hover:text-violet-600 transition-all"
          >
            + New
          </button>

          <div className="hidden md:flex items-center gap-2">
            {stylePersonalities.map((style) => (
              <button
                key={style.name}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  style.active
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                    : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* History Dropdown */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-card overflow-hidden"
          >
            <div className="p-4 max-h-64 overflow-y-auto no-scrollbar">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No conversation history yet. Start chatting!
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Recent Conversations
                  </p>
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv)}
                      className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left hover:bg-secondary transition-colors group ${
                        currentConvId === conv.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Bot className="w-4 h-4 text-violet-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.timestamp).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all shrink-0"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative flex">
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth no-scrollbar"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${
                    msg.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                      msg.type === "user"
                        ? "bg-gradient-to-tr from-rose-500 to-violet-500 text-white"
                        : "bg-card border border-border text-violet-600 dark:text-violet-400"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <div
                      className={`p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] text-[14px] sm:text-[15px] leading-relaxed shadow-sm border inline-block ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground border-primary rounded-tr-none"
                          : "bg-card text-foreground border-border rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                      {msg.isStreaming && (
                        <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse rounded-sm" />
                      )}
                    </div>

                    {/* Product Grid */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm">
                        {msg.products.map((product: any) => (
                          <Link
                            href={`/app/marketplace/${product.id}`}
                            key={product.id}
                            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all group block"
                          >
                            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                              <img
                                src={product.images?.[0]}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={product.name}
                              />
                            </div>
                            <div className="p-2 sm:p-3">
                              <p className="font-bold text-xs truncate mb-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(product.price / 100).toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                })}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Feedback buttons for bot messages */}
                    {msg.type === "bot" && !msg.isStreaming && msg.id !== 1 && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleFeedback(msg.id, "like")}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            msg.feedback === "like"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                          aria-label="Like this response"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful</span>
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "dislike")}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            msg.feedback === "dislike"
                              ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                          aria-label="Dislike this response"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>Not helpful</span>
                        </button>
                      </div>
                    )}

                    <p
                      className={`text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest ${
                        msg.type === "user" ? "text-right" : ""
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && !messages.find((m) => m.isStreaming) && (
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
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-transparent">
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button className="p-1.5 sm:p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="p-1.5 sm:p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything about your style..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
                className="w-full pl-24 sm:pl-28 pr-14 sm:pr-16 py-4 sm:py-5 rounded-[24px] sm:rounded-[28px] bg-card border border-border focus:border-violet-500 shadow-xl shadow-black/[0.03] transition-all outline-none text-sm sm:text-base text-foreground disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:bg-muted disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground/50 mt-3 sm:mt-4 font-bold uppercase tracking-[0.2em]">
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
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {(product.price / 100).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
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
