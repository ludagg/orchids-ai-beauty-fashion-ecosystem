"use client";

import { User, ShoppingBag, Star } from "lucide-react";

type Chat = {
  name: string;
  avatar: string;
  type: string;
};

export default function ChatInfo({ chat }: { chat: Chat }) {
  return (
    <aside className="hidden xl:flex w-80 border-l border-border flex-col bg-card h-full">
      <div className="p-8 text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-[40px] overflow-hidden shadow-2xl border-4 border-muted">
          <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{chat.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{chat.type}</p>
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
            {[1,2,3,4,5,6].map(i => (
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
  );
}
